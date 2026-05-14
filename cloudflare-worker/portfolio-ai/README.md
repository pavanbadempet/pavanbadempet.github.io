# Portfolio AI Worker (optional)

This Cloudflare Worker proxies **`POST /v1/chat/completions`** to the OpenAI API so your **GitHub Pages site never exposes an API key**. The command palette’s **“Cloud — your Worker”** option calls this endpoint after Jekyll `site.ai_worker_url` is set.

## Deploy

1. Install [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/) and log in.
2. From this folder:

   ```bash
   cd cloudflare-worker/portfolio-ai
   npm install -g wrangler   # or use npx wrangler
   wrangler secret put OPENAI_API_KEY
   wrangler deploy
   ```

3. Copy the deployed URL (e.g. `https://portfolio-ai-proxy.<your-subdomain>.workers.dev`).

4. In the site repo `_config.yml`, set:

   ```yaml
   ai_worker_url: "https://portfolio-ai-proxy.<your-subdomain>.workers.dev"
   ai_worker_model: "gpt-4o-mini"
   ```

5. Rebuild and push the site. The Worker option in the palette will enable automatically.

## CORS

By default the worker allows any origin (`*`). To restrict to GitHub Pages, set a Wrangler var `ALLOWED_ORIGIN` to `https://pavanbadempet.github.io` (or add multiple comma-separated origins and adjust `src/index.js` if you need more than one).

## Security

- Rotate keys if the worker URL leaks; rate-limit and auth can be added later (e.g. signed tokens).
- This worker does **not** implement RAG; retrieval stays in the browser (`ai_chunks.json`). The worker only hides the LLM API key.

On the static site, retrieval uses **BM25** over `ai_chunks.json`. CI runs `scripts/enrich-ai-chunks.mjs` after Jekyll to split long documents into overlapping chunks for better recall.

## Ollama on GitHub Pages

The palette’s **Ollama** option calls Ollama’s **`/api/chat`** endpoint. Browsers block **`http://`** requests from an **`https://`** page (mixed content), so **`http://127.0.0.1:11434`** does not work on the live GitHub Pages site unless you use a workaround.

### Workaround: `ollama_base_url` (HTTPS)

In **`_config.yml`**, set **`ollama_base_url`** to the **HTTPS** origin of a tunnel or reverse-proxy in front of Ollama (no path; the client appends **`/api/chat`**). Example:

```yaml
ollama_base_url: "https://ollama-your-name.trycloudflare.com"
ollama_default_model: "llama3.2"
```

Then rebuild and deploy. You must still allow **CORS** from your Pages origin (e.g. `OLLAMA_ORIGINS` including `https://pavanbadempet.github.io`).

### Without a tunnel

Use **Pollinations**, **your Worker**, or **WebLLM** on production, or run **`jekyll serve`** over **`http://`** and leave **`ollama_base_url`** empty to use **`http://127.0.0.1:11434`**.
