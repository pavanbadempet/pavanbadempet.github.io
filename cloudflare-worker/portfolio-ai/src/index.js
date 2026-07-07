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
          vectors.push({
            id: chunk.id,
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
        
        // 1. Vector RAG Retrieval
        if (lastUserMessage && lastUserMessage.content.length > 3) {
          const qEmbeddingResp = await env.AI.run('@cf/baai/bge-small-en-v1.5', { text: [lastUserMessage.content] });
          const qEmbedding = qEmbeddingResp.data[0];
          
          const searchResults = await env.VECTORIZE_INDEX.query(qEmbedding, { topK: 5, returnMetadata: 'all' });
          
          for (let i = 0; i < searchResults.matches.length; i++) {
            const match = searchResults.matches[i];
            // BGE cosine similarity > 0.5 is usually good
            if (match.score > 0.5) { 
               const meta = match.metadata || {};
               sources.push({
                 index: i + 1,
                 id: match.id,
                 title: meta.title,
                 url: meta.url,
                 score: match.score
               });
               contextChunks.push(`[${i+1}] **${meta.title}** (${meta.category}) — ${meta.url}\n${meta.body}`);
            }
          }
        }
        
        // 2. Overwrite System Prompt
        if (messages.length > 0 && messages[0].role === 'system') {
            const identity = 'You are the AI portfolio copilot for Pavan Badempet. You are powered by an advanced open-source LLM.\nCONTRACT: portfolio-ai-v2. Use CONTEXT indices [1], [2], … when citing facts about Pavan drawn from CONTEXT. If asked about Pavan and the CONTEXT/FACTS lack the answer, refuse and suggest his Resume/email. If asked about yourself (the AI), answer naturally.';
            
            if (contextChunks.length > 0) {
              const ragText = contextChunks.join('\n\n---\n\n');
              messages[0].content = `${identity}\n\nCONTEXT (human-readable excerpts from portfolio):\n${ragText}\n\nOutput: Markdown. Be concise unless the user asks for depth. End with a **Sources:** line listing [n] titles.`;
            } else {
              messages[0].content = `${identity}\n\nOutput: Markdown. Be concise unless the user asks for depth.`;
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
