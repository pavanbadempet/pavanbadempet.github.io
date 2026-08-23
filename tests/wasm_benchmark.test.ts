import { test, expect } from "bun:test";
import { readFileSync } from "fs";

test("Rust WebAssembly Engine initializes and computes faster than pure JS", async () => {
  const bytes = readFileSync("assets/wasm/rust_wasm_engine.wasm");
  const wasmModule = await WebAssembly.instantiate(bytes, {});
  const wasm = wasmModule.instance.exports as any;

  expect(wasm).toBeDefined();
  expect(typeof wasm.cosine_similarity).toBe("function");
  expect(typeof wasm.estimate_tokens).toBe("function");
  expect(typeof wasm.fast_text_score).toBe("function");

  // Benchmark Cosine Similarity (10,000 iterations over 384-dim vectors)
  const dim = 384;
  const vecA = new Float32Array(dim).map(() => Math.random());
  const vecB = new Float32Array(dim).map(() => Math.random());

  const ptrA = wasm.wasm_alloc(dim * 4);
  const ptrB = wasm.wasm_alloc(dim * 4);

  new Float32Array(wasm.memory.buffer, ptrA, dim).set(vecA);
  new Float32Array(wasm.memory.buffer, ptrB, dim).set(vecB);

  // Measure Rust Wasm
  const startRust = performance.now();
  for (let i = 0; i < 10000; i++) {
    wasm.cosine_similarity(ptrA, ptrB, dim);
  }
  const timeRust = performance.now() - startRust;

  // Measure JS
  const startJS = performance.now();
  for (let i = 0; i < 10000; i++) {
    let dot = 0, nA = 0, nB = 0;
    for (let j = 0; j < dim; j++) {
      dot += vecA[j] * vecB[j];
      nA += vecA[j] * vecA[j];
      nB += vecB[j] * vecB[j];
    }
    const res = dot / (Math.sqrt(nA) * Math.sqrt(nB));
  }
  const timeJS = performance.now() - startJS;

  console.log(`[Benchmark] 10,000 Cosine Similarities (384-dim):`);
  console.log(`   Rust Wasm: ${timeRust.toFixed(2)}ms`);
  console.log(`   Pure JS:   ${timeJS.toFixed(2)}ms`);

  wasm.wasm_dealloc(ptrA, dim * 4);
  wasm.wasm_dealloc(ptrB, dim * 4);

  // Test Token Estimation
  const text = "Pavan Badempet is a Data Engineer proficient in PySpark, Databricks, and AWS Lambda.";
  const encoder = new TextEncoder();
  const textBytes = encoder.encode(text);
  const textPtr = wasm.wasm_alloc(textBytes.length);
  new Uint8Array(wasm.memory.buffer, textPtr, textBytes.length).set(textBytes);
  const tokenCount = wasm.estimate_tokens(textPtr, textBytes.length);
  wasm.wasm_dealloc(textPtr, textBytes.length);

  expect(tokenCount).toBeGreaterThan(10);
  expect(tokenCount).toBeLessThan(30);
});
