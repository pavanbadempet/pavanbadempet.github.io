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
    "assets/Pavan_Badempet_Resume.pdf",
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
