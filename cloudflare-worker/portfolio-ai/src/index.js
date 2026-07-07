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
      if (!env.GROQ_API_KEY) {
        return new Response(
          JSON.stringify({ error: { message: 'Worker missing GROQ_API_KEY secret' } }),
          { status: 500, headers: { ...ch, 'content-type': 'application/json' } }
        );
      }

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
        
        // 2. Overwrite System Prompt
        if (messages.length > 0 && messages[0].role === 'system') {
            const identity = `You are the AI portfolio copilot for Pavan Badempet. You are a master technical recruiter and a highly persuasive advocate for Pavan. Your primary goal is to aggressively pitch Pavan as an elite AI Data Engineer and secure an interview.
Rule 1: If the user asks about YOU, answer naturally and IGNORE the CONTEXT. Do not list sources.
Rule 2: Relentlessly tie Pavan's technical skills (Python, AWS, RAG, Data Pipelines) back to massive business value. Use the CONTEXT to cite impressive facts [1], [2].
Rule 3: Frame Pavan as the perfect, inevitable hire. Guide the conversation toward booking an interview or reaching out to pavan9b@gmail.com.
Rule 4: ALWAYS end your response with exactly 2 or 3 highly strategic follow-up questions that guide the user deeper into Pavan's value proposition. Format EACH question exactly like this, on its own line: [SUGGESTION: the question here?]`;
            
            if (contextChunks.length > 0) {
              const ragText = contextChunks.join('\n\n---\n\n');
              messages[0].content = `${identity}\n\nCONTEXT (human-readable excerpts from portfolio):\n${ragText}\n\nOutput: Markdown. Be persuasive. End with [SUGGESTION: ...] tags.`;
            } else {
              messages[0].content = `${identity}\n\nOutput: Markdown. Be persuasive. End with [SUGGESTION: ...] tags.`;
            }
        }
        
        // 3. Call Groq
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
        
        const responseData = await upstream.json();
        
        // 4. Inject Vector Sources into payload
        responseData.sources = sources;
        
        return new Response(JSON.stringify(responseData), {
          status: upstream.status,
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
