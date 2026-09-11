import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";

/**
 * Ultra-Fast Bun Post-Build Optimizer
 * Minifies HTML, strips redundant comments/whitespace, and enforces modern Web Vitals attributes.
 */

const targetDir = process.argv[2] || "_site";
const startTime = performance.now();

let totalFiles = 0;
let originalBytes = 0;
let optimizedBytes = 0;

async function* getHtmlFiles(dir: string): AsyncGenerator<string> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* getHtmlFiles(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      yield fullPath;
    }
  }
}

function minifyHtml(html: string): string {
  // Preserve pre, code, script, style blocks
  const preservedBlocks: string[] = [];
  let processed = html.replace(/<(pre|code|script|style)[\s\S]*?<\/\1>/gi, (match) => {
    preservedBlocks.push(match);
    return `___PRESERVED_BLOCK_${preservedBlocks.length - 1}___`;
  });

  // Remove standard HTML comments (exclude conditional comments)
  processed = processed.replace(/<!--(?!\[if)[\s\S]*?-->/g, "");

  // Collapse consecutive whitespaces and empty lines
  processed = processed.replace(/[ \t]+/g, " ");
  processed = processed.replace(/^\s*[\r\n]/gm, "");

  // Ensure decoding="async" on all images that lack it
  processed = processed.replace(/<img\b([^>]*?)>/gi, (match, attrs) => {
    let updatedAttrs = attrs;
    if (!/decoding=/i.test(updatedAttrs)) {
      updatedAttrs += ' decoding="async"';
    }
    return `<img ${updatedAttrs.trim()}>`;
  });

  // Restore preserved blocks
  processed = processed.replace(/___PRESERVED_BLOCK_(\d+)___/g, (_, index) => {
    return preservedBlocks[Number(index)];
  });

  return processed;
}

try {
  const dirStats = await stat(targetDir);
  if (!dirStats.isDirectory()) {
    console.error(`[Bun Optimizer] Error: '${targetDir}' is not a directory.`);
    process.exit(1);
  }

  for await (const filePath of getHtmlFiles(targetDir)) {
    const file = Bun.file(filePath);
    const originalText = await file.text();
    const originalSize = originalText.length;

    const optimizedText = minifyHtml(originalText);
    const optimizedSize = optimizedText.length;

    await Bun.write(filePath, optimizedText);

    totalFiles++;
    originalBytes += originalSize;
    optimizedBytes += optimizedSize;
  }

  const duration = (performance.now() - startTime).toFixed(2);
  const savedBytes = originalBytes - optimizedBytes;
  const savedPercent = originalBytes > 0 ? ((savedBytes / originalBytes) * 100).toFixed(1) : "0";

  console.log(`[Bun Optimizer] Completed in ${duration}ms:`);
  console.log(`  Processed:       ${totalFiles} HTML files`);
  console.log(`  Original Size:   ${(originalBytes / 1024).toFixed(1)} KB`);
  console.log(`  Optimized Size:  ${(optimizedBytes / 1024).toFixed(1)} KB`);
  console.log(`  Saved:           ${(savedBytes / 1024).toFixed(1)} KB (${savedPercent}%)`);
} catch (err: any) {
  console.error(`[Bun Optimizer] Error during optimization:`, err.message);
  process.exit(1);
}
