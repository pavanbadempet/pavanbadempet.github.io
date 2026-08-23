/**
 * High-Performance Rust WebAssembly Engine Bridge
 * Provides zero-latency client-side Vector Similarity, BM25 Scoring, Fuzzy Matching, and Token Counting.
 */
(function (global) {
  'use strict';

  class RustWasmEngine {
    constructor() {
      this.wasm = null;
      this.memory = null;
      this.isReady = false;
      this.encoder = new TextEncoder();
      this.initPromise = this.init();
    }

    async init() {
      try {
        const wasmUrl = (global.site_url || '') + '/assets/wasm/rust_wasm_engine.wasm';
        let response;
        let bytes;

        if (typeof fetch === 'function') {
          response = await fetch(wasmUrl);
          if (response.ok) {
            bytes = await response.arrayBuffer();
          }
        }

        if (!bytes && typeof Bun !== 'undefined') {
          // Bun / Node local file read support for tests
          const fs = await import('fs');
          bytes = fs.readFileSync('assets/wasm/rust_wasm_engine.wasm');
        }

        if (!bytes) {
          console.warn('[Rust Wasm Engine] Could not load .wasm binary; using JS fallback.');
          return false;
        }

        const wasmModule = await WebAssembly.instantiate(bytes, {});
        this.wasm = wasmModule.instance.exports;
        this.memory = this.wasm.memory;
        this.isReady = true;
        console.log('[Rust Wasm Engine] Initialized successfully. High-speed computation active.');
        return true;
      } catch (err) {
        console.warn('[Rust Wasm Engine] Failed to initialize Wasm engine:', err);
        return false;
      }
    }

    /**
     * Compute cosine similarity between two Float32Array vectors using compiled Rust
     */
    cosineSimilarity(vecA, vecB) {
      if (!this.isReady || !this.wasm) {
        // Fallback in JS
        let dot = 0, nA = 0, nB = 0;
        for (let i = 0; i < vecA.length; i++) {
          dot += vecA[i] * vecB[i];
          nA += vecA[i] * vecA[i];
          nB += vecB[i] * vecB[i];
        }
        const denom = Math.sqrt(nA) * Math.sqrt(nB);
        return denom > 1e-8 ? dot / denom : 0;
      }

      const len = Math.min(vecA.length, vecB.length);
      const byteSize = len * 4;

      const ptrA = this.wasm.wasm_alloc(byteSize);
      const ptrB = this.wasm.wasm_alloc(byteSize);

      const memA = new Float32Array(this.memory.buffer, ptrA, len);
      const memB = new Float32Array(this.memory.buffer, ptrB, len);

      memA.set(vecA.subarray(0, len));
      memB.set(vecB.subarray(0, len));

      const score = this.wasm.cosine_similarity(ptrA, ptrB, len);

      this.wasm.wasm_dealloc(ptrA, byteSize);
      this.wasm.wasm_dealloc(ptrB, byteSize);

      return score;
    }

    /**
     * Fast text matching score using Rust
     */
    fastTextScore(query, text) {
      if (!query || !text) return 0;
      if (!this.isReady || !this.wasm) {
        // Fallback in JS
        const q = query.toLowerCase();
        const t = text.toLowerCase();
        if (t.includes(q)) return 1.0;
        const words = q.split(/\s+/).filter(Boolean);
        const matches = words.filter(w => t.includes(w)).length;
        return words.length ? matches / words.length : 0;
      }

      const queryBytes = this.encoder.encode(query);
      const textBytes = this.encoder.encode(text);

      const queryPtr = this.wasm.wasm_alloc(queryBytes.length);
      const textPtr = this.wasm.wasm_alloc(textBytes.length);

      new Uint8Array(this.memory.buffer, queryPtr, queryBytes.length).set(queryBytes);
      new Uint8Array(this.memory.buffer, textPtr, textBytes.length).set(textBytes);

      const score = this.wasm.fast_text_score(queryPtr, queryBytes.length, textPtr, textBytes.length);

      this.wasm.wasm_dealloc(queryPtr, queryBytes.length);
      this.wasm.wasm_dealloc(textPtr, textBytes.length);

      return score;
    }

    /**
     * Fast token count estimator using Rust
     */
    estimateTokens(text) {
      if (!text) return 0;
      if (!this.isReady || !this.wasm) {
        return Math.ceil(text.length / 4);
      }

      const textBytes = this.encoder.encode(text);
      const textPtr = this.wasm.wasm_alloc(textBytes.length);

      new Uint8Array(this.memory.buffer, textPtr, textBytes.length).set(textBytes);
      const count = this.wasm.estimate_tokens(textPtr, textBytes.length);
      this.wasm.wasm_dealloc(textPtr, textBytes.length);

      return count;
    }

    /**
     * Okapi BM25 term score using Rust
     */
    bm25Score(docTf, docLen, avgDocLen, totalDocs, docFreq) {
      if (!this.isReady || !this.wasm) {
        const idf = Math.log(1 + (totalDocs - docFreq + 0.5) / (docFreq + 0.5));
        const k1 = 1.2, b = 0.75;
        const normDocLen = avgDocLen > 0 ? docLen / avgDocLen : 1;
        return idf * ((docTf * (k1 + 1)) / (docTf + k1 * (1 - b + b * normDocLen)));
      }
      return this.wasm.bm25_term_score(docTf, docLen, avgDocLen, totalDocs, docFreq);
    }
  }

  const instance = new RustWasmEngine();
  global.RustWasmEngine = instance;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = instance;
  }
})(typeof window !== 'undefined' ? window : globalThis);
