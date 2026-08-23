import { test, expect } from "bun:test";

const WORKER_URL = "https://portfolio-ai-proxy.pavan9b.workers.dev/v1/chat/completions";

test("Cloudflare Worker responds to OPTIONS preflight with CORS headers", async () => {
  const res = await fetch(WORKER_URL, {
    method: "OPTIONS",
    headers: {
      "Origin": "https://pavanbadempet.github.io",
      "Access-Control-Request-Method": "POST"
    }
  });

  expect([200, 204]).toContain(res.status);
  expect(res.headers.get("access-control-allow-origin")).toBe("*");
});

test("Cloudflare Worker generates grounded completion without AWS Glue hallucination", async () => {
  const startTime = performance.now();
  const res = await fetch(WORKER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content: "You are Pavan's AI Copilot. Pavan's AWS stack is specifically S3, Lambda, Step Functions, EventBridge, and SNS at Nissan. Do not invent AWS Glue."
        },
        {
          role: "user",
          content: "What AWS tools did Pavan use in his projects?"
        }
      ]
    })
  });

  const duration = performance.now() - startTime;
  console.log(`[Worker Benchmark] Chat completion returned in ${duration.toFixed(2)}ms`);

  expect(res.status).toBe(200);
  const data = await res.json() as any;
  expect(data.choices).toBeDefined();
  expect(data.choices.length).toBeGreaterThan(0);

  const content = data.choices[0].message.content.toLowerCase();
  expect(content).toContain("lambda");
  expect(content).toContain("step functions");
  expect(content).toContain("s3");
}, 20000);
