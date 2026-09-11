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
    "assets/js/instant-prefetch.js",
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

test("Interview Pitch presentation deck controls and timer verification", () => {
  const introHtml = readFileSync("intro/index.html", "utf8");
  
  // Floating controls removed to prevent covering bottom content
  expect(introHtml.includes('id="floating-deck-controls"')).toBeFalse();
  expect(introHtml.includes('id="deck-prev-btn"')).toBeFalse();
  expect(introHtml.includes('id="deck-next-btn"')).toBeFalse();

  // Top HUD controls
  expect(introHtml.includes('class="hud-deck-nav"')).toBeTrue();
  expect(introHtml.includes('id="hud-prev-btn"')).toBeTrue();
  expect(introHtml.includes('id="hud-next-btn"')).toBeTrue();
  expect(introHtml.includes('class="hud-exit-btn"')).toBeTrue();
  expect(introHtml.includes('href="/classic/"')).toBeTrue();

  // Timer controls
  expect(introHtml.includes('id="timer-reset-btn"')).toBeTrue();
  expect(introHtml.includes('id="timer-status"')).toBeTrue();

  // Act advance buttons
  expect(introHtml.includes('class="act-advance-bar"')).toBeTrue();
  expect(introHtml.includes('navigateToAct(2)')).toBeTrue();
  expect(introHtml.includes('navigateToAct(7)')).toBeTrue();

  // Scroll offset styling
  expect(introHtml.includes('scroll-margin-top: calc(var(--hud-height) + 24px);')).toBeTrue();

  // Keyboard navigation & functions
  expect(introHtml.includes('window.navigateToAct = function')).toBeTrue();
  expect(introHtml.includes('window.navigateToNextAct = function')).toBeTrue();
  expect(introHtml.includes('resetTimer')).toBeTrue();
  expect(introHtml.includes('ArrowRight')).toBeTrue();
  expect(introHtml.includes('ArrowLeft')).toBeTrue();
});
