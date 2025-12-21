import os
import yaml
import shutil
import glob
from datetime import datetime
from jinja2 import Environment, FileSystemLoader, select_autoescape
import markdown
import frontmatter
from urllib.parse import quote, urljoin
from xml.etree import ElementTree as etree

# Configuration
CONFIG_FILE = '_config.yml'
DATA_DIR = '_data'
POSTS_DIR = '_posts'
WORKS_DIR = '_works'
TEMPLATES_DIR = 'templates'
SITE_DIR = '_site'

class SiteBuilder:
    def __init__(self):
        self.config = self.load_config()
        self.data = self.load_data()
        self.config['data'] = self.data # Jekyll compatibility
        self.config['works'] = self.load_collection(WORKS_DIR, 'works')
        self.config['posts'] = self.load_posts()
        self.config['collections'] = {'works': self.config['works']}
        
        self.env = self.setup_jinja()

    def load_config(self):
        with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
            return yaml.safe_load(f)

    def load_data(self):
        data = {}
        if os.path.exists(DATA_DIR):
            for filename in os.listdir(DATA_DIR):
                if filename.endswith(('.yml', '.yaml')):
                    key = os.path.splitext(filename)[0]
                    with open(os.path.join(DATA_DIR, filename), 'r', encoding='utf-8') as f:
                        data[key] = yaml.safe_load(f)
        return data

    def load_collection(self, directory, collection_name):
        items = []
        if os.path.exists(directory):
            for filename in os.listdir(directory):
                if filename.endswith('.md'):
                    path = os.path.join(directory, filename)
                    post = frontmatter.load(path)
                    item = post.metadata
                    item['content'] = markdown.markdown(post.content)
                    item['id'] = f"/{collection_name}/{os.path.splitext(filename)[0]}"
                    # Handle basic type for portfolio
                    if 'type' not in item:
                        item['type'] = 'image' # default
                    items.append(item)
        return items

    def load_posts(self):
        posts = []
        if os.path.exists(POSTS_DIR):
            for filename in os.listdir(POSTS_DIR):
                if filename.endswith('.md'):
                    # Filename format: YYYY-MM-DD-title.md
                    parts = filename.split('-')
                    if len(parts) > 3:
                        date_str = '-'.join(parts[:3])
                        slug = '-'.join(parts[3:]).replace('.md', '')
                        
                        path = os.path.join(POSTS_DIR, filename)
                        post = frontmatter.load(path)
                        item = post.metadata
                        item['content'] = markdown.markdown(post.content)
                        item['excerpt'] = self.create_excerpt(post.content)
                        item['url'] = f"/blog/{slug}.html"
                        item['date'] = datetime.strptime(date_str, '%Y-%m-%d')
                        item['id'] = slug
                        posts.append(item)
        
        # Sort posts by date descending
        posts.sort(key=lambda x: x['date'], reverse=True)
        
        # Add next/previous links
        for i in range(len(posts)):
            if i > 0:
                posts[i]['next'] = posts[i-1]
            if i < len(posts) - 1:
                posts[i]['previous'] = posts[i+1]
                
        return posts

    def create_excerpt(self, content, chars=200):
        # unexpected simple extractor
        text = ''.join(etree.fromstring(f"<div>{markdown.markdown(content)}</div>").itertext()) if content else ""
        # Fallback to simple slice if etree fails or not imported
        if not text:
             # Basic markdown stripping
             text = content.replace('#', '').replace('*', '')
        return text[:chars] + '...'

    def setup_jinja(self):
        env = Environment(
            loader=FileSystemLoader([TEMPLATES_DIR, '.']),
            autoescape=select_autoescape(['html', 'xml'])
        )
        
        # Filters
        env.filters['relative_url'] = self.relative_url
        env.filters['absolute_url'] = self.absolute_url
        env.filters['date'] = self.date_filter
        env.filters['replace'] = lambda s, o, n: str(s).replace(o, n) if s else ""
        env.filters['slugify'] = lambda s: s.lower().replace(' ', '-') if s else ""
        env.filters['url_encode'] = lambda s: quote(str(s)) if s else ""
        env.filters['split'] = lambda s, d: s.split(d) if s else []
        env.filters['jsonify'] = lambda x: yaml.dump(x) # close enough for debugging
        env.filters['where'] = self.where_filter
        env.filters['group_by'] = self.group_by_filter
        
        return env

    def relative_url(self, url):
        if not url: return ""
        if url.startswith('http'): return url
        baseurl = self.config.get('baseurl', '')
        if not url.startswith('/'): url = '/' + url
        return f"{baseurl}{url}"

    def absolute_url(self, url):
        return f"{self.config.get('url', '')}{self.relative_url(url)}"

    def date_filter(self, date_obj, format_str="%b %d, %Y"):
        if isinstance(date_obj, str):
            try:
                date_obj = datetime.strptime(date_obj, "%Y-%m-%d") # Try standard format
            except ValueError:
                return date_obj # Return original string if parse fails
        try:
             # Handle Jekyll date format strings
            format_str = format_str.replace("%B", "%B").replace("%d", "%d").replace("%Y", "%Y") 
            # Simplified mapping, python strftime is mostly compatible
            return date_obj.strftime(format_str)
        except Exception:
            return str(date_obj)

    def where_filter(self, items, key, value):
        return [i for i in items if i.get(key) == value]
    
    def group_by_filter(self, items, key):
        # Implementation skipped for now as not critically used
        return items

    def render_page(self, layout, context, output_path):
        template = self.env.get_template(f"layouts/{layout}.html")
        output = template.render(context)
        
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(output)

    def build_pages(self):
        # 1. Process top-level HTML files
        for filename in os.listdir('.'):
            if filename.endswith('.html') and filename != 'index.html' and not filename.startswith('_'): # Skip index.html for specific handling if needed, but usually it's same
                self.process_file(filename)
        
        # Process index.html separately if not caught above
        if os.path.exists('index.html'):
            self.process_file('index.html')

    def process_file(self, filename):
        path = filename
        if not os.path.exists(path): return

        post = frontmatter.load(path)
        metadata = post.metadata
        content = markdown.markdown(post.content)
        
        layout = metadata.get('layout', 'default')
        
        # Determine output path
        if filename == 'index.html':
            out_path = os.path.join(SITE_DIR, 'index.html')
            url = "/"
        else:
            # Clean URL: filename/index.html
            name = os.path.splitext(filename)[0]
            out_path = os.path.join(SITE_DIR, name, 'index.html')
            url = f"/{name}/"
        
        site_payload = {
            'site': self.config,
            'page': {**metadata, 'url': url},
            'content': content
        }
        
        self.render_page(layout, site_payload, out_path)

    def build_blog(self):
        posts = self.config['posts']
        for post in posts:
            slug = post['id']
            out_path = os.path.join(SITE_DIR, 'blog', f"{slug}.html")
            
            payload = {
                'site': self.config,
                'page': post,
                'content': post['content']
            }
            # Post layout
            self.render_page('post', payload, out_path)
            
        # Pagination (Simple 1 page implementation for now, full pagination requires logic)
        # Assuming index.html or blog.html handles the list
        # If blog is a separate page 'blog.html' in root? No, usually index.html shows posts or a specific blog page.
        # Check if there is a blog page. 'blog.html' layout exists, but is there a 'blog/index.html'?
        pass

    def build_pagination(self):
        # Simulate Paginator for the Blog page (implied by blog.html layout)
        # We need to find which page uses 'blog' layout. Usually specific page or index.
        # Let's assume index.html might use it, or we create a blog/index.html.
        # But wait, looking at file list, `index.html` uses `home` layout.
        # `_layouts/blog.html` exists. 
        # Is there a file using `blog` layout?
        pass

    def build_sitemap(self):
        print("Building sitemap.xml...")
        pages = []
        
        # Add static pages (recursively find html files in _site)
        for root, _, files in os.walk(SITE_DIR):
            for file in files:
                if file.endswith('.html'):
                    rel_path = os.path.relpath(os.path.join(root, file), SITE_DIR)
                    if rel_path == 'index.html':
                        url = self.config['url'] + '/'
                    elif rel_path.endswith('index.html'):
                        url = self.config['url'] + '/' + os.path.dirname(rel_path) + '/'
                    else:
                        url = self.config['url'] + '/' + rel_path
                    
                    pages.append({
                        'url': url,
                        'date': datetime.now().strftime('%Y-%m-%d') # Default to today if no date
                    })
        
        sitemap_content = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
"""
        for page in pages:
            sitemap_content += f"""  <url>
    <loc>{page['url']}</loc>
    <lastmod>{page['date']}</lastmod>
  </url>
"""
        sitemap_content += "</urlset>"
        
        with open(os.path.join(SITE_DIR, 'sitemap.xml'), 'w', encoding='utf-8') as f:
            f.write(sitemap_content)

    def build(self):
        print("Cleaning _site...")
        if os.path.exists(SITE_DIR):
            shutil.rmtree(SITE_DIR)
        os.makedirs(SITE_DIR)

        print("Copying assets...")
        if os.path.exists('assets'):
            shutil.copytree('assets', os.path.join(SITE_DIR, 'assets'))
            
        print("Copying robots.txt...")
        if os.path.exists('robots.txt'):
            shutil.copy('robots.txt', os.path.join(SITE_DIR, 'robots.txt'))

        print("Building Pages...")
        self.build_pages()
        
        print("Building Blog Posts...")
        self.build_blog()
        
        self.build_sitemap()
        
        print("Build Complete.")

if __name__ == "__main__":
    builder = SiteBuilder()
    builder.build()
