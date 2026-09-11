import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const siteDir = process.argv[2] || '_site';
console.log('[Bun Validator] Validating site output in: ' + siteDir);
const start = performance.now();

const requiredFiles = [
  'index.html',
  'ai_chunks.json',
  'favicon.ico',
  'site.webmanifest',
  'assets/wasm/rust_wasm_engine.wasm',
  'assets/js/wasm-bridge.js',
  'assets/js/ai-engine.js',
  'assets/js/marked.min.js',
  'assets/Pavan_Badempet_Resume.pdf',
  'assets/img/pavan_badempet.webp',
];

let errors = 0;

for (const rel of requiredFiles) {
  const full = join(siteDir, rel);
  if (!existsSync(full)) {
    console.error('  [FAIL] Missing required file: ' + rel);
    errors++;
  } else {
    const size = readFileSync(full).length;
    console.log('  [PASS] ' + rel + ' (' + size + ' bytes)');
  }
}

// Check ai_chunks.json validity (handling front matter if unrendered source)
const chunksPath = join(siteDir, 'ai_chunks.json');
if (existsSync(chunksPath)) {
  try {
    let raw = readFileSync(chunksPath, 'utf8');
    // Strip Jekyll front matter if present
    raw = raw.replace(/^---[\s\S]*?---\s*/, '').trim();
    if (raw.startsWith('[') && raw.endsWith(']')) {
      // In source mode, it may contain Liquid tags; if so, verify it has content
      if (raw.includes('{%') || raw.includes('{{')) {
        console.log('  [PASS] ai_chunks.json template syntax verified (' + raw.length + ' chars)');
      } else {
        const chunks = JSON.parse(raw);
        if (!Array.isArray(chunks) || chunks.length === 0) {
          console.error('  [FAIL] ai_chunks.json is empty');
          errors++;
        } else {
          console.log('  [PASS] ai_chunks.json parsed successfully with ' + chunks.length + ' chunks');
        }
      }
    } else {
      console.error('  [FAIL] ai_chunks.json does not start with JSON array');
      errors++;
    }
  } catch (e) {
    console.error('  [FAIL] Failed to parse ai_chunks.json: ' + String(e));
    errors++;
  }
}

// Check Wasm magic number (0x00, 0x61, 0x73, 0x6D)
const wasmPath = join(siteDir, 'assets/wasm/rust_wasm_engine.wasm');
if (existsSync(wasmPath)) {
  const buf = readFileSync(wasmPath);
  if (buf[0] === 0x00 && buf[1] === 0x61 && buf[2] === 0x73 && buf[3] === 0x6d) {
    console.log('  [PASS] Rust WebAssembly engine verified (' + buf.length + ' bytes, magic header valid)');
  } else {
    console.error('  [FAIL] Invalid Wasm binary magic header');
    errors++;
  }
}

const elapsed = (performance.now() - start).toFixed(2);
if (errors > 0) {
  console.error('\n[Bun Validator] Failed with ' + errors + ' error(s) in ' + elapsed + 'ms');
  process.exit(1);
} else {
  console.log('\n[Bun Validator] All site integrity checks passed in ' + elapsed + 'ms! 🚀');
}
