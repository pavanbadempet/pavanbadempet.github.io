/**
 * OpenAI-compatible chat proxy for static sites (keeps API key off the client).
 * Deploy separately with Wrangler; set site.ai_worker_url in Jekyll _config.yml.
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
    if (url.pathname !== '/v1/chat/completions' || request.method !== 'POST') {
      return new Response('Not Found', { status: 404, headers: ch });
    }

    if (!env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: { message: 'Worker missing OPENAI_API_KEY secret' } }),
        { status: 500, headers: { ...ch, 'content-type': 'application/json' } }
      );
    }

    const body = await request.text();
    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + env.OPENAI_API_KEY,
        'Content-Type': 'application/json',
      },
      body,
    });

    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        ...ch,
        'content-type': upstream.headers.get('content-type') || 'application/json',
      },
    });
  },
};
