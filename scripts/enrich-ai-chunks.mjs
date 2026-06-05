/**
 * Post-build: split large chunk bodies for finer-grained BM25 retrieval on GitHub Pages.
 * Run after `jekyll build`: node scripts/enrich-ai-chunks.mjs _site/ai_chunks.json
 */
import fs from 'fs';

const path = process.argv[2] || '_site/ai_chunks.json';
if (!fs.existsSync(path)) {
  console.warn('enrich-ai-chunks: file not found, skip:', path);
  process.exit(0);
}

const WIN = 1400;
const STEP = 1000;

const data = JSON.parse(fs.readFileSync(path, 'utf8'));
if (!Array.isArray(data)) {
  console.error('enrich-ai-chunks: expected JSON array');
  process.exit(1);
}

const out = [];
for (const c of data) {
  const body = String(c.body || '');
  if (body.length <= WIN) {
    out.push(c);
    continue;
  }
  let i = 0;
  let part = 0;
  while (i < body.length) {
    const slice = body.slice(i, i + WIN);
    out.push({
      ...c,
      id: `${c.id}__${part}`,
      parent_id: c.id,
      chunk_index: part,
      body: slice,
    });
    i += STEP;
    part += 1;
  }
}

fs.writeFileSync(path, JSON.stringify(out));
console.log('enrich-ai-chunks: wrote', out.length, 'chunks (from', data.length, 'records)');
