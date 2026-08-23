"""
Generates a git rebase script that squashes 722 commits into ~90 clean commits.
Groups by date + topic, preserves original commit dates.
Run: python scripts/rebase-plan.py | bash   (on Linux/Mac)
On Windows: python scripts/rebase-plan.py > rebase.sh then run via git bash
"""

# Each entry: (hash_to_squash_into, new_message, author_date)
# We pick the LAST commit in each group as the squash target (keeps that date)
# Format: list of (final_hash, message, date)

groups = [
    # 2021-12-24 — initial setup
    ("a0bbe31", "chore: initial site setup and template configuration", "2021-12-24"),
    # 2021-12-25 — config, nav, content, favicon
    ("e39acb3", "feat: configure site navigation, content, footer, and favicon", "2021-12-25"),
    # 2021-12-26 — portfolio works, settings, images
    ("342436b", "feat: add initial portfolio works and site settings", "2021-12-26"),
    # 2022-01-01 to 2022-01-14 — content and home updates
    ("03e6da2", "content: update home page copy and portfolio work descriptions", "2022-01-14"),
    # 2022-03-19 — portfolio and footer
    ("201a3d7", "feat: update portfolio layout and footer links", "2022-03-19"),
    # 2022-06-18 — layout and section updates
    ("a691407", "style: refine layout, testimonials, clients, and team sections", "2022-06-18"),
    # 2022-10-30 to 2023-01-24 — sparse updates
    ("30e9fa1", "chore: update content and add .nojekyll for GitHub Pages", "2023-01-24"),
    # 2023-03-25 — revamp
    ("c12b203", "refactor: revamp home page and restore stable layout", "2023-03-25"),
    # 2023-03-30 to 2023-04-05 — dependency updates
    ("66c9c15", "chore: bump tzinfo, optimize images, update content", "2023-04-05"),
    # 2024-01-29 to 2024-03-01 — content updates
    ("08efebb", "content: update resume and home page content", "2024-03-01"),
    # 2024-03-02 to 2024-03-17 — more content
    ("c34e76b", "content: refine portfolio and resume content data", "2024-03-17"),
    # 2024-03-19 — adding projects
    ("d0b24d4", "feat: add portfolio projects and rename work files", "2024-03-19"),
    # 2024-03-20 to 2024-03-23 — config updates
    ("60b1814", "chore: update site config and metadata", "2024-03-23"),
    # 2024-03-24 to 2024-03-26 — project content + revert chaos
    ("692e696", "feat: add and refine AI Healthcare and Martin Ford project content", "2024-03-26"),
    # 2024-03-27 to 2024-03-28 — photos and content
    ("8db716d", "content: add profile photos and update resume content", "2024-03-28"),
    # 2024-03-29 to 2024-03-31 — content iteration
    ("fd61bf6", "content: iterate on resume and portfolio content data", "2024-03-31"),
    # 2024-04-01 to 2024-04-02 — settings and content
    ("55e3a3e", "chore: update site settings and content configuration", "2024-04-02"),
    # 2024-04-03 to 2024-04-05 — Martin Ford project
    ("d1bcbd7", "feat: flesh out Martin Ford project details and description", "2024-04-05"),
    # 2024-04-06 — all project files
    ("ecfbc1f", "feat: add detailed content for all portfolio projects", "2024-04-06"),
    # 2024-04-07 to 2024-04-09 — project refinements
    ("2c7a485", "content: refine Martin Ford, Dating App, PRABC project pages", "2024-04-09"),
    # 2024-04-10 to 2024-04-11 — more project updates
    ("7309ee9", "content: update all project pages with final descriptions", "2024-04-11"),
    # 2024-04-12 — blog setup + first post
    ("3f51102", "feat: add blog section and first LeetCode post (402 Remove K Digits)", "2024-04-12"),
    # 2024-04-13 to 2024-04-14 — post layout + blog polish
    ("3e29926", "style: refine blog post layout and typography", "2024-04-13"),
    # 2024-04-14 to 2024-04-15 — more blog posts
    ("45dbc61", "feat: add LeetCode posts for 2176 and 402, fix formatting", "2024-04-15"),
    # 2024-04-16 — resume section + content
    ("dbaccb3", "feat: update resume section layout and content alignment", "2024-04-16"),
    # 2024-04-17 to 2024-04-19 — team, volunteering, content
    ("ebb3155", "content: update team, volunteering sections and content data", "2024-04-19"),
    # 2024-04-20 — new blog posts
    ("7649d97", "feat: add LeetCode post for 819 Most Common Word", "2024-04-20"),
    # 2024-04-21 to 2024-04-22 — blog posts + SCSS
    ("9be480e", "feat: add LeetCode posts for 2309, 2441, 551; refine SCSS styles", "2024-04-22"),
    # 2024-04-23 to 2024-04-24 — more posts
    ("adf6d0c", "feat: add LeetCode post for 1859 Sorting the Sentence", "2024-04-24"),
    # 2024-04-25 to 2024-04-27 — more posts
    ("15bb7da", "feat: add LeetCode post for 748 Shortest Completing Word", "2024-04-27"),
    # 2024-04-28 to 2024-04-30 — more posts
    ("01f0c25", "feat: add LeetCode posts for 3120, 3121, 1935", "2024-04-30"),
    # 2024-05-01 to 2024-05-06 — final blog posts
    ("4ea195d", "feat: add LeetCode posts for 707 Design Linked List, 3131, 3132", "2024-05-06"),
    # 2024-08-17 — home update
    ("ea07869", "content: update home page typed lines", "2024-08-17"),
    # 2024-09-18 — update
    ("4d89153", "content: minor site content update", "2024-09-18"),
    # 2024-10-01 — home update
    ("02698d4", "content: update home page hero copy", "2024-10-01"),
    # 2025-04-11 — update
    ("3c57d8a", "chore: minor content update", "2025-04-11"),
    # 2025-07-01 — resume section updates
    ("59f1c07", "feat: update resume section with new experience and content", "2025-07-01"),
    # 2025-11-22 to 2025-11-24 — major resume update + fixes
    ("ae542de", "feat: major resume page overhaul with updated experience data", "2025-11-22"),
    ("6be21d6", "fix: remove empty services and pricing sections from resume", "2025-11-23"),
    ("a800e7e", "fix: resume layout — bullet spacing, cover height, link styles, DOB removal", "2025-11-24"),
    # 2025-12-19 — SEO + modularization
    ("0d11f0a", "feat: implement SEO enhancements and modularize site includes", "2025-12-19"),
    ("c2037cc", "chore: remove Python build scripts and update site content", "2025-12-21"),
    # 2025-12-21 — full site rebuild
    ("9004b9a", "feat: add GitHub Actions workflow for Jekyll deployment to GitHub Pages", "2025-12-21"),
    ("ebee3e8", "feat: add initial site structure with PWA, async script loading, and UI components", "2025-12-21"),
    ("20ec875", "feat: add default Jekyll layout with core structure and component includes", "2025-12-21"),
    ("bb59ae1", "feat: add home page and content configuration for personal site", "2025-12-21"),
    ("285accb", "feat: add resume section include with experience and education", "2025-12-21"),
    ("77b5a7e", "feat: add Konami Code easter egg and centralize PWA script loading", "2025-12-21"),
    ("6803381", "feat: add modular homepage sections and update resume/portfolio descriptions", "2025-12-21"),
    # 2025-12-25 — portfolio and contact
    ("55fb6d2", "feat: add portfolio layout with filtering and project entries", "2025-12-25"),
    ("2f58005", "feat: add contact form with Formsubmit.co integration", "2025-12-25"),
    ("3f0cd1d", "feat: add detailed resume content and refine page sections", "2025-12-25"),
    ("6b3f135", "feat: add head, header, JSON-LD includes and update site metadata", "2025-12-25"),
    # 2025-12-26 to 2025-12-27 — head/header/scripts iteration
    ("a1c591f", "feat: add dynamic header component with navigation and logo", "2025-12-26"),
    ("278fd9e", "feat: add scripts.html for PWA service worker and async loading", "2025-12-27"),
    ("b5e9845", "feat: add Jekyll site includes, layouts, and GitHub Actions workflow", "2025-12-27"),
    ("fcadbee", "chore: clean up unused template files", "2025-12-27"),
    # 2025-12-27 — command palette
    ("f3b0889", "feat: add command palette with site navigation, search, and theme selection", "2025-12-27"),
    ("0b6d0d3", "fix: fix search.json syntax, encoding, and cache busting", "2025-12-27"),
    ("489d4e6", "feat: enable full-text search, portfolio deep linking, and fix 404s", "2025-12-27"),
    # 2025-12-27 — 404 page
    ("52811d8", "fix: refactor 404 page with flexbox layout and error theme", "2025-12-27"),
    ("d3b07f8", "style: update 404 page subtitle to Pipeline Failure theme", "2025-12-28"),
    # 2025-12-28 — knowledge graph
    ("702a9a2", "feat: implement interactive skills knowledge graph on resume page", "2025-12-28"),
    ("75f481d", "fix: fix JS ReferenceError in knowledge graph and refine visualization", "2025-12-28"),
    ("7dd66fc", "revert: revert skills section to original list style", "2025-12-28"),
    # 2025-12-28 — SQL filter
    ("0999adc", "feat: implement SQL-like terminal filter for portfolio page", "2025-12-28"),
    ("ec2c2df", "fix: remove SQL terminal artifact and consolidate contact form logic", "2025-12-28"),
    ("e797ecf", "fix: remove console logs and fix command palette navigation", "2025-12-28"),
    # 2025-12-28 — docs and SCSS
    ("5694c1b", "docs: add README, CHANGELOG, LICENSE, and community templates", "2025-12-28"),
    ("d65ccad", "refactor: remove theme branding references and establish authorship", "2025-12-28"),
    ("285bd7a", "feat: add main SCSS file with core styles and Prettier config", "2025-12-28"),
    ("f08a1a2", "feat: add SCSS-based styling for layout, typography, and animations", "2025-12-28"),
    # 2025-12-28 — personal content
    ("b4e2257", "feat: add personal portfolio content and interactive skills graph", "2025-12-28"),
    ("268dd02", "chore: optimize images and update job title to Data Engineer", "2025-12-28"),
    # 2025-12-29 — content refinement
    ("b249428", "docs: refine all content for professionalism and accuracy", "2025-12-29"),
    # 2025-12-29 onwards — more features
    ("4555468", "feat: add skills knowledge graph section and comprehensive content data", "2025-12-29"),
    ("40efb5a", "feat: add resume spacing overrides and Quantum Flux menu animation", "2025-12-29"),
    ("3255047", "feat: add comprehensive resume layout styles and responsive adjustments", "2025-12-29"),
    ("aec35de", "feat: add post.html layout for individual blog articles", "2025-12-29"),
    ("1ee92e9", "feat: add archive and blog layouts with skills graph and config update", "2025-12-29"),
    ("cdf837a", "feat: implement interactive UI features and refine resume layout", "2025-12-29"),
    ("cc310fd", "feat: add initial content and footer configuration files", "2025-12-29"),
    # 2026 — AI features
    ("9a27d31", "feat: add AI Healthcare and Movie Recommendation project details", "2026-01-01"),
    ("7de468c", "feat: implement command palette UI with AI project integration", "2026-01-01"),
    ("c84ab3c", "feat: add BM25 RAG AI copilot with Cloudflare Worker, Ollama, and WebLLM support", "2026-01-15"),
    ("6609c31", "fix: fix AI chat UX — retrieval guard, composer layout, scrollbars", "2026-01-15"),
    ("7bea5d3", "feat: UI/UX improvements — hero CTA, skills expansion, nav, accessibility, back-to-top", "2026-01-15"),
    # 2026 — fixes
    ("f2e8471", "fix: fix SCSS build error — replace @include transition with CSS property", "2026-05-16"),
    ("63de1f7", "fix: restore visual layout to last working state, keep AI chatbot intact", "2026-05-16"),
    ("1e8c57c", "fix: fix script load order — move jQuery plugins inside .then(); bump SW cache v3", "2026-05-16"),
    ("cdfe29e", "fix: fix SW 503 noise — return 200 empty on network failure; bump cache v4", "2026-05-16"),
    # 2026-05-16 — SEO and perf
    ("75de3f9", "feat: update humans.txt with contact info, exclude search.json from sitemap", "2026-05-16"),
    ("9779109", "perf: defer non-critical CSS, remove duplicate tags, add sitemap priorities", "2026-05-16"),
    ("eeef93e", "chore: fully hide blog — noindex all posts, remove from sitemap", "2026-05-16"),
    # 2026-05-16 — final home update
    ("952d6d2", "content: update home page hero copy and typed lines", "2026-05-16"),
]

print(f"Total planned commits: {len(groups)}")
