import os
import shutil
import yaml
import frontmatter
import sass
import click
from liquid import Environment, FileSystemLoader
from datetime import datetime
import glob
import re
import json
import math

# Configuration
CONFIG_FILE = '_config.yml'
OUTPUT_DIR = '_site'
LAYOUTS_DIR = '_layouts'
INCLUDES_DIR = '_includes'
POSTS_DIR = '_posts'
SASS_DIR = '_sass'
ASSETS_DIR = 'assets'
DATA_DIR = '_data'

def load_config():
    with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
        config = yaml.safe_load(f)
    return config

def load_data():
    data = {}
    if os.path.exists(DATA_DIR):
        for filename in os.listdir(DATA_DIR):
            if filename.endswith('.yml') or filename.endswith('.yaml'):
                key = os.path.splitext(filename)[0]
                with open(os.path.join(DATA_DIR, filename), 'r', encoding='utf-8') as f:
                    data[key] = yaml.safe_load(f)
    return data

def relative_url(url, context):
    baseurl = context.resolve('site.baseurl') or ''
    if url.startswith('/'):
        return f"{baseurl}{url}"
    return f"{baseurl}/{url}"

def absolute_url(url, context):
    site_url = context.resolve('site.url') or ''
    baseurl = context.resolve('site.baseurl') or ''
    return f"{site_url}{baseurl}{url}"

def date_filter(value, format="%b %d, %Y"):
    if isinstance(value, str):
        try:
            value = datetime.strptime(value, '%Y-%m-%d %H:%M:%S')
        except ValueError:
            try:
                value = datetime.strptime(value, '%Y-%m-%d')
            except ValueError:
                return value
    return value.strftime(format)

def xml_escape(value):
    return str(value).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;').replace("'", '&apos;')

def setup_environment(config, data):
    env = Environment(loader=FileSystemLoader([INCLUDES_DIR, LAYOUTS_DIR]))
    
    # Register filters
    env.add_filter('relative_url', relative_url)
    env.add_filter('absolute_url', absolute_url)
    env.add_filter('date', date_filter)
    env.add_filter('jsonify', json.dumps)
    env.add_filter('xml_escape', xml_escape)
    
    # Mock seo tag (basic implementation)
    def seo_tag(context):
        # Minimal SEO tag replacement
        site = context.resolve('site')
        page = context.resolve('page')
        title = page.get('title', site.get('title', ''))
        desc = page.get('description', site.get('description', ''))
        return f'<title>{title}</title><meta name="description" content="{desc}">'
    env.add_tag('seo', seo_tag)

    return env

def render_markdown(content):
    import markdown
    return markdown.markdown(content, extensions=['extra', 'codehilite', 'toc'])

def process_scss(config):
    print("Processing SCSS...")
    scss_entry = os.path.join(ASSETS_DIR, 'css', 'style.scss')
    if not os.path.exists(scss_entry):
        print(f"Warning: {scss_entry} not found.")
        return

    with open(scss_entry, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            content = parts[2]
    
    try:
        css_output = sass.compile(
            string=content,
            include_paths=[SASS_DIR, os.path.join(ASSETS_DIR, 'css')],
            output_style='compressed' if config.get('sass', {}).get('style') == 'compressed' else 'nested'
        )
        
        out_path = os.path.join(OUTPUT_DIR, 'assets', 'css', 'style.css')
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(css_output)
        print(f"Compiled {scss_entry} to {out_path}")
    except Exception as e:
        print(f"SCSS Compilation Error: {e}")

def render_layout(content, layout_name, context, env):
    if not layout_name:
        return content
    
    try:
        template = env.get_template(f"{layout_name}.html")
        layout_path = os.path.join(LAYOUTS_DIR, f"{layout_name}.html")
        if os.path.exists(layout_path):
            with open(layout_path, 'r', encoding='utf-8') as f:
                layout_post = frontmatter.load(f)
                parent_layout = layout_post.metadata.get('layout')
        else:
            parent_layout = None

        context['content'] = content
        rendered = template.render(**context)
        
        if parent_layout:
            return render_layout(rendered, parent_layout, context, env)
        
        return rendered
    except Exception as e:
        print(f"Error rendering layout {layout_name}: {e}")
        return content

def paginate(posts, config, context, env):
    per_page = config.get('paginate', 10)
    paginate_path = config.get('paginate_path', '/blog/page:num/')
    
    total_pages = math.ceil(len(posts) / per_page)
    
    for i in range(total_pages):
        page_num = i + 1
        start = i * per_page
        end = start + per_page
        page_posts = posts[start:end]
        
        paginator = {
            'page': page_num,
            'per_page': per_page,
            'posts': [p.metadata for p in page_posts],
            'total_posts': len(posts),
            'total_pages': total_pages,
            'previous_page': page_num - 1 if page_num > 1 else None,
            'next_page': page_num + 1 if page_num < total_pages else None,
            'previous_page_path': paginate_path.replace(':num', str(page_num - 1)) if page_num > 1 else None,
            'next_page_path': paginate_path.replace(':num', str(page_num + 1)) if page_num < total_pages else None
        }
        
        if page_num == 1:
            # Usually page 1 is the blog index
            out_path = os.path.join(OUTPUT_DIR, 'blog', 'index.html') # Assuming /blog/ is the main feed
            # Check if there is a blog.html page that should be rendered
            # If not, we might need to synthesize one or use index.html if it's the home
            # For this theme, let's look for a page with layout: blog or similar
            pass
        else:
            path_str = paginate_path.replace(':num', str(page_num))
            out_path = os.path.join(OUTPUT_DIR, path_str.strip('/'), 'index.html')
            
            # We need a template to render this. Usually it's the same as the blog index.
            # Let's assume 'blog.html' layout or page exists.
            # For now, we'll skip complex pagination rendering if we can't find the source page easily
            # But we can inject the paginator into the context of the page that requested pagination.
            pass

    return paginator # Return the first page paginator for the main loop

def generate_feed(posts, config, context, env):
    print("Generating Feed...")
    feed_xml = f"""<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>{config.get('title', '')}</title>
  <link href="{config.get('url', '')}/feed.xml" rel="self"/>
  <link href="{config.get('url', '')}/"/>
  <updated>{datetime.now().isoformat()}</updated>
  <id>{config.get('url', '')}/</id>
  <author>
    <name>{config.get('author', '')}</name>
  </author>
"""
    for post in posts[:10]:
        feed_xml += f"""
  <entry>
    <title>{post.metadata.get('title', '')}</title>
    <link href="{config.get('url', '')}{post.metadata.get('url', '')}"/>
    <updated>{post.metadata.get('date').isoformat()}</updated>
    <id>{config.get('url', '')}{post.metadata.get('url', '')}</id>
    <content type="html">{xml_escape(render_markdown(post.content))}</content>
  </entry>
"""
    feed_xml += "</feed>"
    
    with open(os.path.join(OUTPUT_DIR, 'feed.xml'), 'w', encoding='utf-8') as f:
        f.write(feed_xml)

def build_site():
    config = load_config()
    data = load_data()
    env = setup_environment(config, data)
    
    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)
    os.makedirs(OUTPUT_DIR)

    site_context = config.copy()
    site_context['data'] = data
    site_context['time'] = datetime.now()
    site_context['posts'] = []
    site_context['pages'] = []
    site_context['categories'] = {}
    site_context['tags'] = {}

    # 1. Collect Posts
    posts = []
    for filepath in glob.glob(os.path.join(POSTS_DIR, '*.md')):
        post = frontmatter.load(filepath)
        filename = os.path.basename(filepath)
        match = re.match(r'(\d{4}-\d{2}-\d{2})-(.*)\.md', filename)
        if match:
            date_str, slug = match.groups()
            date = datetime.strptime(date_str, '%Y-%m-%d')
        else:
            date = datetime.now()
            slug = filename.replace('.md', '')
        
        post.metadata['date'] = date
        post.metadata['url'] = f"/blog/{date.strftime('%Y/%m/%d')}/{slug}/"
        post.metadata['slug'] = slug
        
        cats = post.metadata.get('categories', [])
        if isinstance(cats, str): cats = [cats]
        for cat in cats:
            if cat not in site_context['categories']: site_context['categories'][cat] = []
            site_context['categories'][cat].append(post)
            
        tags = post.metadata.get('tags', [])
        if isinstance(tags, str): tags = [tags]
        for tag in tags:
            if tag not in site_context['tags']: site_context['tags'][tag] = []
            site_context['tags'][tag].append(post)

        posts.append(post)
    
    posts.sort(key=lambda x: x.metadata['date'], reverse=True)
    site_context['posts'] = [p.metadata for p in posts]
    
    # 2. Process Posts
    for post in posts:
        context = {
            'site': site_context,
            'page': post.metadata
        }
        content = render_markdown(post.content)
        final_output = render_layout(content, post.metadata.get('layout'), context, env)
        out_path = os.path.join(OUTPUT_DIR, post.metadata['url'].strip('/'), 'index.html')
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(final_output)

    # 3. Process Pages
    for root, dirs, files in os.walk('.'):
        if any(part.startswith('_') for part in root.split(os.sep)) or root.startswith(f'.{os.sep}.'):
            continue
        if OUTPUT_DIR in root:
            continue

        for file in files:
            if file.endswith(('.md', '.html')):
                filepath = os.path.join(root, file)
                if filepath == f'.{os.sep}build.py' or filepath == f'.{os.sep}requirements.txt':
                    continue
                
                print(f"Processing {filepath}")
                page = frontmatter.load(filepath)
                
                rel_path = os.path.relpath(filepath, '.')
                if 'permalink' in page.metadata:
                    perm = page.metadata['permalink']
                    if perm.endswith('/'):
                        out_path = os.path.join(OUTPUT_DIR, perm.strip('/'), 'index.html')
                    else:
                        out_path = os.path.join(OUTPUT_DIR, perm.strip('/'))
                else:
                    if file.endswith('.md'):
                        out_path = os.path.join(OUTPUT_DIR, rel_path[:-3] + '.html')
                    else:
                        out_path = os.path.join(OUTPUT_DIR, rel_path)

                os.makedirs(os.path.dirname(out_path), exist_ok=True)

                page.metadata['url'] = out_path.replace(OUTPUT_DIR, '').replace('\\', '/')
                context = {
                    'site': site_context,
                    'page': page.metadata
                }

                # Inject Paginator if needed
                # If the page uses 'paginator' variable, we should provide it.
                # We'll provide a default paginator for the first page of posts
                context['paginator'] = paginate(posts, config, context, env)

                content = page.content
                if file.endswith('.md'):
                    content = render_markdown(content)
                else:
                    template = env.from_string(content)
                    content = template.render(**context)
                
                final_output = render_layout(content, page.metadata.get('layout'), context, env)

                with open(out_path, 'w', encoding='utf-8') as f:
                    f.write(final_output)

    # 4. Generate Archives (Categories/Tags)
    # Basic implementation: generate index pages for each category/tag
    # This requires a layout for archives, usually 'archive.html'
    for cat, cat_posts in site_context['categories'].items():
        out_path = os.path.join(OUTPUT_DIR, 'categories', cat.lower().replace(' ', '-'), 'index.html')
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        # We need to render this using a layout. 
        # Let's assume 'archive' layout exists or fallback to default
        context = {
            'site': site_context,
            'page': {'title': f"Category: {cat}", 'layout': 'archive', 'posts': [p.metadata for p in cat_posts]}
        }
        # Render empty content with archive layout
        final_output = render_layout('', 'archive', context, env)
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(final_output)

    # 5. Copy Assets
    if os.path.exists(ASSETS_DIR):
        for root, dirs, files in os.walk(ASSETS_DIR):
            rel_root = os.path.relpath(root, ASSETS_DIR)
            dest_root = os.path.join(OUTPUT_DIR, ASSETS_DIR, rel_root)
            os.makedirs(dest_root, exist_ok=True)
            for file in files:
                src_file = os.path.join(root, file)
                dest_file = os.path.join(dest_root, file)
                if not os.path.exists(dest_file):
                    shutil.copy2(src_file, dest_file)

    # 6. Process SCSS
    process_scss(config)
    
    # 7. Generate Feed
    generate_feed(posts, config, site_context, env)

    print("Build complete.")

if __name__ == '__main__':
    build_site()

