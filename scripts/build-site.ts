import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import * as sass from 'sass';
import matter from 'gray-matter';
import { marked } from 'marked';
import { Liquid } from 'liquidjs';

const ROOT_DIR = process.cwd();
const SITE_DIR = path.join(ROOT_DIR, '_site');
const DATA_DIR = path.join(ROOT_DIR, '_data');
const LAYOUTS_DIR = path.join(ROOT_DIR, '_layouts');
const INCLUDES_DIR = path.join(ROOT_DIR, '_includes');
const WORKS_DIR = path.join(ROOT_DIR, '_works');

console.log('⚡ Starting Pure Bun + Rust Site Build...');
const startTime = performance.now();

// 1. Prepare _site directory
if (!fs.existsSync(SITE_DIR)) {
    fs.mkdirSync(SITE_DIR, { recursive: true });
}

// 2. Load Configuration and Data
let config: any = {};
if (fs.existsSync(path.join(ROOT_DIR, '_config.yml'))) {
    config = yaml.load(fs.readFileSync(path.join(ROOT_DIR, '_config.yml'), 'utf8')) || {};
}

const siteData: Record<string, any> = {};
if (fs.existsSync(DATA_DIR)) {
    for (const file of fs.readdirSync(DATA_DIR)) {
        if (file.endsWith('.yml') || file.endsWith('.yaml')) {
            const key = path.basename(file, path.extname(file));
            try {
                siteData[key] = yaml.load(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
            } catch (e: any) {
                console.warn(`Warning loading data file ${file}:`, e.message);
            }
        }
    }
}

// 3. Load Works (_works)
const works: any[] = [];
if (fs.existsSync(WORKS_DIR)) {
    for (const file of fs.readdirSync(WORKS_DIR)) {
        if (file.endsWith('.md')) {
            const parsed = matter(fs.readFileSync(path.join(WORKS_DIR, file), 'utf8'));
            const workItem = {
                ...parsed.data,
                content: marked.parse(parsed.content),
                id: path.basename(file, '.md'),
                url: `/works/${path.basename(file, '.md')}/`
            };
            works.push(workItem);
        }
    }
}

// Build global site context
const siteContext = {
    ...config,
    data: siteData,
    works: works,
    time: new Date()
};

// 4. Setup LiquidJS Engine
const engine = new Liquid({
    root: [LAYOUTS_DIR, INCLUDES_DIR],
    extname: '.html',
    dynamicPartials: false,
    strictVariables: false,
    strictFilters: false
});

// Register Jekyll compatibility tags
engine.registerTag('seo', {
    render: function (ctx: any) {
        const page = ctx.get(['page']) || {};
        const site = ctx.get(['site']) || {};
        const title = page.title ? `${page.title} | ${site.title || 'Pavan Badempet'}` : (site.title || 'Pavan Badempet');
        const desc = page.description || site.description || '';
        const url = `${(site.url || 'https://pavanbadempet.github.io')}${page.url || '/'}`;
        return `
  <title>${title}</title>
  <meta name="description" content="${desc}" />
  <link rel="canonical" href="${url}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:site_name" content="${site.title || 'Pavan Badempet'}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${desc}" />
        `.trim();
    }
});

engine.registerTag('feed_meta', {
    render: function (ctx: any) {
        return `<link type="application/atom+xml" rel="alternate" href="${(siteContext.url || 'https://pavanbadempet.github.io')}/feed.xml" title="${siteContext.title || 'Pavan Badempet'}" />`;
    }
});

// Register Jekyll compatibility filters
engine.registerFilter('relative_url', (v: any) => {
    if (!v) return siteContext.baseurl || '/';
    const str = String(v);
    const base = siteContext.baseurl || '';
    if (str.startsWith('/')) return `${base}${str}`;
    return `${base}/${str}`;
});

engine.registerFilter('absolute_url', (v: any) => {
    if (!v) return siteContext.url || 'https://pavanbadempet.github.io';
    const str = String(v);
    const url = (siteContext.url || 'https://pavanbadempet.github.io').replace(/\/$/, '');
    if (str.startsWith('/')) return `${url}${str}`;
    return `${url}/${str}`;
});

engine.registerFilter('markdownify', (v: any) => {
    if (!v) return '';
    return marked.parse(String(v));
});

engine.registerFilter('jsonify', (v: any) => JSON.stringify(v));

engine.registerFilter('slugify', (v: any) => {
    if (!v) return '';
    return String(v).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
});

engine.registerFilter('strip_html', (v: any) => {
    if (!v) return '';
    return String(v).replace(/<[^>]*>?/gm, '');
});

engine.registerFilter('date_to_xmlschema', (v: any) => {
    if (!v) return new Date().toISOString();
    return new Date(v).toISOString();
});

engine.registerFilter('url_escape', (v: any) => {
    if (!v) return '';
    return encodeURIComponent(String(v));
});

engine.registerFilter('camelcase', (v: any) => {
    if (!v) return '';
    return String(v).replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
});

// Helper to recursively render layouts
async function renderWithLayouts(content: string, pageData: any): Promise<string> {
    let currentContent = content;
    let currentLayout = pageData.layout;
    const visited = new Set<string>();

    while (currentLayout && currentLayout !== 'none' && !visited.has(currentLayout)) {
        visited.add(currentLayout);
        const layoutPath = path.join(LAYOUTS_DIR, `${currentLayout}.html`);
        if (!fs.existsSync(layoutPath)) break;

        const layoutRaw = fs.readFileSync(layoutPath, 'utf8');
        const parsedLayout = matter(layoutRaw);

        // Render layout template with content injected
        currentContent = await engine.parseAndRender(parsedLayout.content, {
            site: siteContext,
            page: pageData,
            content: currentContent
        });

        currentLayout = parsedLayout.data.layout;
    }

    return currentContent;
}

// 5. Compile Pages
const pagesToCompile = [
    { src: 'index.html', dest: 'index.html' },
    { src: 'classic.html', dest: 'classic/index.html' },
    { src: 'resume.html', dest: 'resume/index.html' },
    { src: 'portfolio.html', dest: 'portfolio/index.html' },
    { src: 'contacts.html', dest: 'contacts/index.html' },
    { src: 'gateway.html', dest: 'gateway/index.html' },
    { src: 'agent.html', dest: 'agent/index.html' },
    { src: '404.html', dest: '404.html' },
    { src: 'about.md', dest: 'about/index.html' },
    { src: 'ai_chunks.json', dest: 'ai_chunks.json' },
    { src: 'search.json', dest: 'search.json' }
];

for (const p of pagesToCompile) {
    const srcPath = path.join(ROOT_DIR, p.src);
    if (!fs.existsSync(srcPath)) continue;

    console.log(`  -> Compiling ${p.src}...`);
    const raw = fs.readFileSync(srcPath, 'utf8');
    const parsed = matter(raw);
    const pageData = {
        ...parsed.data,
        url: '/' + p.dest.replace(/index\.html$/, '')
    };

    let body = parsed.content;
    if (p.src.endsWith('.md')) {
        body = marked.parse(body) as string;
    }

    let rendered = await engine.parseAndRender(body, {
        site: siteContext,
        page: pageData
    });

    if (pageData.layout) {
        rendered = await renderWithLayouts(rendered, pageData);
    }

    const outPath = path.join(SITE_DIR, p.dest);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, rendered, 'utf8');
}

// 6. Compile SCSS
console.log('  -> Compiling SASS stylesheets...');
const cssOutputDir = path.join(SITE_DIR, 'assets', 'css');
fs.mkdirSync(cssOutputDir, { recursive: true });

function compileScss(srcRel: string, destRel: string) {
    const srcPath = path.join(ROOT_DIR, srcRel);
    if (!fs.existsSync(srcPath)) return;
    let raw = fs.readFileSync(srcPath, 'utf8');
    raw = raw.replace(/^---[\s\S]*?---\r?\n/, '');
    const compiled = sass.compileString(raw, {
        loadPaths: [path.join(ROOT_DIR, '_sass'), path.join(ROOT_DIR, 'assets', 'css')]
    });
    fs.writeFileSync(path.join(SITE_DIR, destRel), compiled.css, 'utf8');
}

try {
    compileScss('assets/css/style.scss', 'assets/css/style.css');
    compileScss('assets/css/premium-os.scss', 'assets/css/premium-os.css');
} catch (e: any) {
    console.error('Error compiling SCSS:', e.message);
}

// 7. Copy Static Files
console.log('  -> Copying static assets...');
function copyDir(src: string, dest: string, filter?: (name: string) => boolean) {
    if (!fs.existsSync(src)) return;
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        if (filter && !filter(entry.name)) continue;
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath, filter);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Copy assets (excluding .scss files)
copyDir(path.join(ROOT_DIR, 'assets'), path.join(SITE_DIR, 'assets'), (name) => !name.endsWith('.scss'));

// Copy intro presentation
copyDir(path.join(ROOT_DIR, 'intro'), path.join(SITE_DIR, 'intro'));

// Copy root metadata and manifests
const rootFiles = ['favicon.ico', 'site.webmanifest', 'robots.txt', 'humans.txt', 'llms.txt', 'service-worker.js'];
for (const f of rootFiles) {
    const srcF = path.join(ROOT_DIR, f);
    if (fs.existsSync(srcF)) {
        fs.copyFileSync(srcF, path.join(SITE_DIR, f));
    }
}

const elapsed = (performance.now() - startTime).toFixed(2);
console.log(`🚀 Pure Bun Build Completed in ${elapsed}ms!`);
