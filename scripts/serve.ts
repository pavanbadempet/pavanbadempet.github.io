import * as path from 'path';

const PORT = Number(process.env.PORT) || 4000;
const SITE_DIR = path.join(process.cwd(), '_site');

console.log(`⚡ Bun Dev Server running at http://localhost:${PORT}`);
console.log(`📁 Serving directory: ${SITE_DIR}`);

Bun.serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);
    let pathname = decodeURIComponent(url.pathname);

    // If root or ends with slash, default to index.html
    if (pathname.endsWith('/')) {
      pathname += 'index.html';
    }

    let filePath = path.join(SITE_DIR, pathname);
    let file = Bun.file(filePath);

    // If file doesn't exist, check if there's a directory index.html
    if (file.size === 0 && !pathname.includes('.')) {
      const cleanPath = pathname.replace(/^\//, '');
      const altPath = path.join(SITE_DIR, cleanPath, 'index.html');
      const altFile = Bun.file(altPath);
      if (altFile.size > 0) {
        return new Response(altFile);
      }
    }

    // Check if original file exists
    if (file.size > 0) {
      return new Response(file);
    }

    // 404 fallback
    const notFound = Bun.file(path.join(SITE_DIR, '404.html'));
    return new Response(notFound, {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
});
