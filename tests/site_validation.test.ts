import { test, expect } from "bun:test";
import { existsSync, readFileSync } from "fs";

test("Site assets and integrity checks pass in Bun", () => {
  const requiredFiles = [
    "index.html",
    "ai_chunks.json",
    "favicon.ico",
    "site.webmanifest",
    "assets/wasm/rust_wasm_engine.wasm",
    "assets/js/wasm-bridge.js",
    "assets/js/ai-engine.js",
    "assets/js/marked.min.js",
    "assets/Pavan_Badempet_Resume.pdf",
    "assets/img/pavan_badempet.webp",
  ];

  for (const file of requiredFiles) {
    expect(existsSync(file)).toBeTrue();
    const size = readFileSync(file).length;
    expect(size).toBeGreaterThan(0);
  }

  const wasmBuf = readFileSync("assets/wasm/rust_wasm_engine.wasm");
  expect(wasmBuf[0]).toBe(0x00);
  expect(wasmBuf[1]).toBe(0x61);
  expect(wasmBuf[2]).toBe(0x73);
  expect(wasmBuf[3]).toBe(0x6d);
});

test("Bun post-build optimizer compresses HTML and ensures async decoding", async () => {
  const { mkdirSync, writeFileSync, readFileSync, rmSync } = await import("fs");
  const tempDir = "temp_opt_test";
  mkdirSync(tempDir, { recursive: true });

  const sampleHtml = `<!DOCTYPE html>
<html>
  <head>
    <!-- Standard comment to strip -->
    <title>Test Page</title>
  </head>
  <body>
    <p>Hello   world</p>
    <img src="test.jpg" alt="test">
  </body>
</html>`;

  writeFileSync(`${tempDir}/test.html`, sampleHtml);

  const proc = Bun.spawnSync(["bun", "run", "scripts/optimize-site.ts", tempDir]);
  expect(proc.exitCode).toBe(0);

  const result = readFileSync(`${tempDir}/test.html`, "utf8");
  expect(result.includes("Standard comment to strip")).toBeFalse();
  expect(result.includes('decoding="async"')).toBeTrue();
  expect(result.length).toBeLessThan(sampleHtml.length);

  rmSync(tempDir, { recursive: true, force: true });
});
