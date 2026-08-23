/**
 * OpenAI-compatible chat proxy with Semantic Vector RAG via Cloudflare Vectorize and Workers AI.
 */

function corsHeaders(env, request) {
  const origin = request.headers.get('Origin') || '';
  const allowed = (env.ALLOWED_ORIGIN || '*').split(',').map((s) => s.trim()).filter(Boolean);
  const allow =
    allowed.includes('*') || allowed.length === 0
      ? '*'
      : allowed.find((o) => origin === o) || allowed[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    Vary: 'Origin',
  };
}

export default {
  async fetch(request, env) {
    const ch = corsHeaders(env, request);
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: ch });
    }

    const url = new URL(request.url);

    // --- INGEST ENDPOINT ---
    if (url.pathname === '/ingest' && request.method === 'POST') {
      const chunksUrl = url.searchParams.get('url') || 'https://pavanbadempet.github.io/ai_chunks.json';
      try {
        const res = await fetch(chunksUrl);
        const chunks = await res.json();
        
        const vectors = [];
        for (const chunk of chunks) {
          const text = [chunk.title, chunk.tags, chunk.category, chunk.body].join(' ');
          const embeddingResp = await env.AI.run('@cf/baai/bge-small-en-v1.5', { text: [text] });
          const embedding = embeddingResp.data[0];
          let safeId = String(chunk.id || '');
          if (safeId.length > 64) {
            safeId = safeId.substring(0, 50) + '_' + safeId.substring(safeId.length - 10);
          }
          if (!safeId) safeId = `chunk-${Math.random().toString(36).substring(2, 10)}`;

          vectors.push({
            id: safeId,
            values: embedding,
            metadata: {
              title: chunk.title || '',
              category: chunk.category || '',
              url: chunk.url || '',
              body: String(chunk.body || '').slice(0, 5000) // Vectorize metadata limit is ~10kb
            }
          });
        }
        
        const upsertResult = await env.VECTORIZE_INDEX.upsert(vectors);
        return new Response(JSON.stringify({ success: true, count: vectors.length, upsertResult }), { headers: ch });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message, stack: e.stack }), { status: 500, headers: ch });
      }
    }

    // --- CHAT ENDPOINT ---
    if (url.pathname === '/v1/chat/completions' && request.method === 'POST') {
      try {
        const json = await request.json();
        const messages = json.messages || [];
        const lastUserMessage = messages.slice().reverse().find(m => m.role === 'user');
        
        let contextChunks = [];
        let sources = [];
        
        // 1. Vector RAG Retrieval + BM25 RRF + Re-Ranking
        if (lastUserMessage && lastUserMessage.content.length > 3) {
          const qEmbeddingResp = await env.AI.run('@cf/baai/bge-small-en-v1.5', { text: [lastUserMessage.content] });
          const qEmbedding = qEmbeddingResp.data[0];
          
          const searchResults = await env.VECTORIZE_INDEX.query(qEmbedding, { topK: 10, returnMetadata: 'all' });
          
          // Reciprocal Rank Fusion (RRF)
          const scores = {};
          const poolDict = {};
          const kRRF = 60;
          
          searchResults.matches.forEach((m, rank) => {
             scores[m.id] = (scores[m.id] || 0) + 1 / (kRRF + rank + 1);
             poolDict[m.id] = m.metadata || {};
             poolDict[m.id].id = m.id;
          });
          
          const sparse = json.bm25Chunks || [];
          sparse.forEach((m, rank) => {
             scores[m.id] = (scores[m.id] || 0) + 1 / (kRRF + rank + 1);
             poolDict[m.id] = m;
          });
          
          let pool = Object.keys(scores)
             .sort((a, b) => scores[b] - scores[a])
             .map(id => poolDict[id])
             .slice(0, 10);
             
          // Re-Ranking via Cloudflare AI
          if (pool.length > 0) {
            try {
              const texts = pool.map(c => [c.title, c.category, c.body].join(' '));
              const rerankResp = await env.AI.run('@cf/baai/bge-reranker-base', {
                query: lastUserMessage.content,
                text_0: lastUserMessage.content, // Some AI bindings use text_0/text_1 or query/texts
                texts: texts
              });
              
              // Reranker returns an array of scores, or { data: [...] } depending on the binding version
              // According to docs, it returns { "results": [ {"score": 0.9, "index": 0}, ... ] }
              const rerankedList = rerankResp.results || rerankResp.data || rerankResp;
              if (Array.isArray(rerankedList)) {
                for (const r of rerankedList) {
                  if (r.index !== undefined && pool[r.index]) {
                    pool[r.index].rerankScore = r.score;
                  }
                }
                pool.sort((a, b) => (b.rerankScore || 0) - (a.rerankScore || 0));
              }
            } catch (e) {
              console.error('Rerank failed, falling back to RRF', e);
            }
            
            const finalTop5 = pool.slice(0, 5);
            for (let i = 0; i < finalTop5.length; i++) {
               const meta = finalTop5[i];
               sources.push({
                 index: i + 1,
                 id: meta.id,
                 title: meta.title,
                 url: meta.url,
                 score: meta.rerankScore || scores[meta.id]
               });
               contextChunks.push(`[${i+1}] **${meta.title}** (${meta.category}) — ${meta.url}\n${String(meta.body).slice(0, 1500)}`);
            }
          }
        }
        
        // 2. Append/Merge Vector Context to the Client's System Prompt
        if (messages.length > 0 && messages[0].role === 'system') {
            if (contextChunks.length > 0) {
              const ragText = contextChunks.join('\n\n---\n\n');
              if (messages[0].content.includes('</context>')) {
                messages[0].content = messages[0].content.replace('</context>', ragText + '\n</context>');
              } else {
                messages[0].content += `\n\n<vector_context>\n${ragText}\n</vector_context>\n`;
              }
            }
        }
        
        let responseContent = '';
        let upstreamSuccess = false;

        // 3. Try Groq if GROQ_API_KEY is configured
        if (env.GROQ_API_KEY) {
          try {
            const upstreamReq = {
              model: json.model || 'llama-3.3-70b-versatile',
              messages: messages,
              temperature: json.temperature || 0.4,
              max_tokens: json.max_tokens || 1000
            };
            
            const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: {
                Authorization: 'Bearer ' + env.GROQ_API_KEY,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(upstreamReq),
            });
            
            if (upstream.ok) {
              const data = await upstream.json();
              if (data.choices && data.choices[0] && data.choices[0].message) {
                responseContent = data.choices[0].message.content;
                upstreamSuccess = true;
              }
            } else {
              console.warn('Groq returned non-200:', upstream.status);
            }
          } catch (groqErr) {
            console.error('Groq fetch error, falling back to Workers AI:', groqErr);
          }
        }

        // 4. Native Cloudflare Workers AI Fallback (Zero external keys required, 100% reliable)
        let lastError = '';
        if (!upstreamSuccess && env.AI) {
          const cfModels = [
            '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
            '@cf/meta/llama-3.2-3b-instruct',
            '@cf/meta/llama-3.2-1b-instruct',
            '@cf/meta/llama-3-8b-instruct',
            '@cf/mistral/mistral-7b-instruct-v0.2',
            '@cf/qwen/qwen2.5-7b-instruct'
          ];
          
          for (const m of cfModels) {
            try {
              const aiResp = await env.AI.run(m, {
                messages: messages,
                max_tokens: 1000,
                temperature: json.temperature || 0.4
              });
              responseContent = aiResp.response || (typeof aiResp === 'string' ? aiResp : '');
              if (responseContent) {
                upstreamSuccess = true;
                break;
              }
            } catch (aiErr) {
              lastError = aiErr.message || String(aiErr);
              console.error(`Workers AI model ${m} failed:`, aiErr);
            }
          }
        }

        if (!upstreamSuccess) {
          return new Response(JSON.stringify({ error: { message: 'Inference backend error: ' + (lastError || 'No provider succeeded') } }), {
            status: 502,
            headers: { ...ch, 'content-type': 'application/json' }
          });
        }

        const responseData = {
          choices: [
            {
              message: {
                role: 'assistant',
                content: responseContent
              }
            }
          ],
          sources: sources
        };

        return new Response(JSON.stringify(responseData), {
          status: 200,
          headers: {
            ...ch,
            'content-type': 'application/json',
          },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: { message: err.message } }), { status: 500, headers: ch });
      }
    }

    return new Response('Not Found', { status: 404, headers: ch });
  },
};
