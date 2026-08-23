/**
 * Fast Bun script to trigger Cloudflare Vectorize RAG Ingestion
 */
const WORKER_URL = "https://portfolio-ai-proxy.pavan9b.workers.dev/ingest";

console.log(`[Bun Ingest] Triggering Cloudflare Vectorize ingestion at ${WORKER_URL}...`);
const startTime = performance.now();

try {
  const response = await fetch(WORKER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  });

  const duration = (performance.now() - startTime).toFixed(2);

  if (!response.ok) {
    console.error(`[Bun Ingest] Error (${response.status}): ${await response.text()}`);
    process.exit(1);
  }

  const data = await response.json();
  console.log(`[Bun Ingest] Success (${duration}ms):`, JSON.stringify(data, null, 2));
} catch (err) {
  console.error(`[Bun Ingest] Failed to connect:`, err);
  process.exit(1);
}
