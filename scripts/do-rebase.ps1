# Rebase script: squashes 722 commits into ~95 clean commits
# Uses git filter-branch approach via cherry-pick onto orphan branch
# Preserves original commit dates

$repo = "c:\Users\pavan\OneDrive\Documents\GitHub\pavanbadempet.github.io"
Set-Location $repo

# Create a new orphan branch to build clean history on
git checkout --orphan clean-history

# Remove all files from index (orphan starts empty)
git rm -rf . --quiet

Write-Host "Starting clean history build..." -ForegroundColor Cyan

# Helper: get the tree of a commit (its file snapshot)
function Get-CommitTree($hash) {
    return (git rev-parse "${hash}^{tree}").Trim()
}

# Helper: create a commit with a specific tree, parent, message, and date
function Make-Commit($tree, $parent, $message, $date, $authorName, $authorEmail) {
    $env:GIT_AUTHOR_NAME = $authorName
    $env:GIT_AUTHOR_EMAIL = $authorEmail
    $env:GIT_AUTHOR_DATE = $date
    $env:GIT_COMMITTER_NAME = $authorName
    $env:GIT_COMMITTER_EMAIL = $authorEmail
    $env:GIT_COMMITTER_DATE = $date
    
    if ($parent -eq "") {
        $hash = git commit-tree $tree -m $message
    } else {
        $hash = git commit-tree $tree -p $parent -m $message
    }
    return $hash.Trim()
}

$authorName = "Pavan Badempet"
$authorEmail = "pavan9b@gmail.com"

# Define groups: (target_hash, message, date)
# target_hash = the commit whose TREE (file state) we want to use
$groups = @(
    @("a0bbe31", "chore: initial site setup and template configuration", "2021-12-24T20:00:00+05:30"),
    @("e39acb3", "feat: configure site navigation, content, footer, and favicon", "2021-12-25T22:00:00+05:30"),
    @("342436b", "feat: add initial portfolio works and site settings", "2021-12-26T23:00:00+05:30"),
    @("03e6da2", "content: update home page copy and portfolio work descriptions", "2022-01-14T21:00:00+05:30"),
    @("201a3d7", "feat: update portfolio layout and footer links", "2022-03-19T20:00:00+05:30"),
    @("a691407", "style: refine layout, testimonials, clients, and team sections", "2022-06-18T22:00:00+05:30"),
    @("30e9fa1", "chore: update content and add .nojekyll for GitHub Pages", "2023-01-24T18:00:00+05:30"),
    @("c12b203", "refactor: revamp home page and restore stable layout", "2023-03-25T21:00:00+05:30"),
    @("66c9c15", "chore: bump tzinfo, optimize images, update content", "2023-04-05T19:00:00+05:30"),
    @("08efebb", "content: update resume and home page content", "2024-03-01T22:00:00+05:30"),
    @("c34e76b", "content: refine portfolio and resume content data", "2024-03-17T20:00:00+05:30"),
    @("d0b24d4", "feat: add portfolio projects and rename work files", "2024-03-19T21:00:00+05:30"),
    @("60b1814", "chore: update site config and metadata", "2024-03-23T19:00:00+05:30"),
    @("692e696", "feat: add and refine AI Healthcare and Martin Ford project content", "2024-03-26T23:00:00+05:30"),
    @("8db716d", "content: add profile photos and update resume content", "2024-03-28T21:00:00+05:30"),
    @("fd61bf6", "content: iterate on resume and portfolio content data", "2024-03-31T22:00:00+05:30"),
    @("55e3a3e", "chore: update site settings and content configuration", "2024-04-02T20:00:00+05:30"),
    @("d1bcbd7", "feat: flesh out Martin Ford project details and description", "2024-04-05T21:00:00+05:30"),
    @("ecfbc1f", "feat: add detailed content for all portfolio projects", "2024-04-06T23:00:00+05:30"),
    @("2c7a485", "content: refine Martin Ford, Dating App, PRABC project pages", "2024-04-09T22:00:00+05:30"),
    @("7309ee9", "content: update all project pages with final descriptions", "2024-04-11T21:00:00+05:30"),
    @("3f51102", "feat: add blog section and first LeetCode post (402 Remove K Digits)", "2024-04-12T22:00:00+05:30"),
    @("3e29926", "style: refine blog post layout and typography", "2024-04-13T21:00:00+05:30"),
    @("45dbc61", "feat: add LeetCode posts for 2176 and 402, fix formatting", "2024-04-15T22:00:00+05:30"),
    @("dbaccb3", "feat: update resume section layout and content alignment", "2024-04-16T23:00:00+05:30"),
    @("ebb3155", "content: update team, volunteering sections and content data", "2024-04-19T21:00:00+05:30"),
    @("7649d97", "feat: add LeetCode post for 819 Most Common Word", "2024-04-20T20:00:00+05:30"),
    @("9be480e", "feat: add LeetCode posts for 2309, 2441, 551; refine SCSS styles", "2024-04-22T23:00:00+05:30"),
    @("adf6d0c", "feat: add LeetCode post for 1859 Sorting the Sentence", "2024-04-24T21:00:00+05:30"),
    @("15bb7da", "feat: add LeetCode post for 748 Shortest Completing Word", "2024-04-27T22:00:00+05:30"),
    @("01f0c25", "feat: add LeetCode posts for 3120, 3121, 1935", "2024-04-30T21:00:00+05:30"),
    @("4ea195d", "feat: add LeetCode posts for 707 Design Linked List, 3131, 3132", "2024-05-06T22:00:00+05:30"),
    @("ea07869", "content: update home page typed lines", "2024-08-17T20:00:00+05:30"),
    @("4d89153", "content: minor site content update", "2024-09-18T19:00:00+05:30"),
    @("02698d4", "content: update home page hero copy", "2024-10-01T21:00:00+05:30"),
    @("3c57d8a", "chore: minor content update", "2025-04-11T20:00:00+05:30"),
    @("59f1c07", "feat: update resume section with new experience and content", "2025-07-01T22:00:00+05:30"),
    @("ae542de", "feat: major resume page overhaul with updated experience data", "2025-11-22T21:00:00+05:30"),
    @("6be21d6", "fix: remove empty services and pricing sections from resume", "2025-11-23T20:00:00+05:30"),
    @("a800e7e", "fix: resume layout, bullet spacing, cover height, link styles, DOB removal", "2025-11-24T23:00:00+05:30"),
    @("0d11f0a", "feat: implement SEO enhancements and modularize site includes", "2025-12-19T21:00:00+05:30"),
    @("c2037cc", "chore: remove Python build scripts and update site content", "2025-12-21T18:00:00+05:30"),
    @("9004b9a", "feat: add GitHub Actions workflow for Jekyll deployment to GitHub Pages", "2025-12-21T19:00:00+05:30"),
    @("ebee3e8", "feat: add initial site structure with PWA, async script loading, and UI components", "2025-12-21T20:00:00+05:30"),
    @("20ec875", "feat: add default Jekyll layout with core structure and component includes", "2025-12-21T20:30:00+05:30"),
    @("bb59ae1", "feat: add home page and content configuration for personal site", "2025-12-21T21:00:00+05:30"),
    @("285accb", "feat: add resume section include with experience and education", "2025-12-21T21:30:00+05:30"),
    @("77b5a7e", "feat: add Konami Code easter egg and centralize PWA script loading", "2025-12-21T22:00:00+05:30"),
    @("6803381", "feat: add modular homepage sections and update resume/portfolio descriptions", "2025-12-21T23:00:00+05:30"),
    @("55fb6d2", "feat: add portfolio layout with filtering and project entries", "2025-12-25T20:00:00+05:30"),
    @("2f58005", "feat: add contact form with Formsubmit.co integration", "2025-12-25T21:00:00+05:30"),
    @("3f0cd1d", "feat: add detailed resume content and refine page sections", "2025-12-25T22:00:00+05:30"),
    @("6b3f135", "feat: add head, header, JSON-LD includes and update site metadata", "2025-12-25T23:00:00+05:30"),
    @("a1c591f", "feat: add dynamic header component with navigation and logo", "2025-12-26T21:00:00+05:30"),
    @("278fd9e", "feat: add scripts.html for PWA service worker and async loading", "2025-12-27T18:00:00+05:30"),
    @("b5e9845", "feat: add Jekyll site includes, layouts, and GitHub Actions workflow", "2025-12-27T19:00:00+05:30"),
    @("fcadbee", "chore: clean up unused template files", "2025-12-27T19:30:00+05:30"),
    @("f3b0889", "feat: add command palette with site navigation, search, and theme selection", "2025-12-27T21:00:00+05:30"),
    @("0b6d0d3", "fix: fix search.json syntax, encoding, and cache busting", "2025-12-27T22:00:00+05:30"),
    @("489d4e6", "feat: enable full-text search, portfolio deep linking, and fix 404s", "2025-12-27T22:30:00+05:30"),
    @("52811d8", "fix: refactor 404 page with flexbox layout and error theme", "2025-12-27T23:00:00+05:30"),
    @("d3b07f8", "style: update 404 page subtitle to Pipeline Failure theme", "2025-12-28T18:00:00+05:30"),
    @("702a9a2", "feat: implement interactive skills knowledge graph on resume page", "2025-12-28T19:00:00+05:30"),
    @("75f481d", "fix: fix JS ReferenceError in knowledge graph and refine visualization", "2025-12-28T20:00:00+05:30"),
    @("7dd66fc", "revert: revert skills section to original list style", "2025-12-28T20:30:00+05:30"),
    @("0999adc", "feat: implement SQL-like terminal filter for portfolio page", "2025-12-28T21:00:00+05:30"),
    @("ec2c2df", "fix: remove SQL terminal artifact and consolidate contact form logic", "2025-12-28T21:30:00+05:30"),
    @("e797ecf", "fix: remove console logs and fix command palette navigation", "2025-12-28T22:00:00+05:30"),
    @("5694c1b", "docs: add README, CHANGELOG, LICENSE, and community templates", "2025-12-28T22:30:00+05:30"),
    @("d65ccad", "refactor: remove theme branding references and establish authorship", "2025-12-28T23:00:00+05:30"),
    @("285bd7a", "feat: add main SCSS file with core styles and Prettier config", "2025-12-28T23:15:00+05:30"),
    @("f08a1a2", "feat: add SCSS-based styling for layout, typography, and animations", "2025-12-28T23:30:00+05:30"),
    @("b4e2257", "feat: add personal portfolio content and interactive skills graph", "2025-12-28T23:45:00+05:30"),
    @("268dd02", "chore: optimize images and update job title to Data Engineer", "2025-12-28T23:55:00+05:30"),
    @("b249428", "docs: refine all content for professionalism and accuracy", "2025-12-29T18:00:00+05:30"),
    @("4555468", "feat: add skills knowledge graph section and comprehensive content data", "2025-12-29T19:00:00+05:30"),
    @("40efb5a", "feat: add resume spacing overrides and Quantum Flux menu animation", "2025-12-29T20:00:00+05:30"),
    @("3255047", "feat: add comprehensive resume layout styles and responsive adjustments", "2025-12-29T21:00:00+05:30"),
    @("aec35de", "feat: add post.html layout for individual blog articles", "2025-12-29T21:30:00+05:30"),
    @("1ee92e9", "feat: add archive and blog layouts with skills graph and config update", "2025-12-29T22:00:00+05:30"),
    @("cdf837a", "feat: implement interactive UI features and refine resume layout", "2025-12-29T22:30:00+05:30"),
    @("cc310fd", "feat: add initial content and footer configuration files", "2025-12-29T23:00:00+05:30"),
    @("9a27d31", "feat: add AI Healthcare and Movie Recommendation project details", "2026-01-01T20:00:00+05:30"),
    @("7de468c", "feat: implement command palette UI with AI project integration", "2026-01-01T22:00:00+05:30"),
    @("c84ab3c", "feat: add BM25 RAG AI copilot with Cloudflare Worker, Ollama, and WebLLM support", "2026-01-15T21:00:00+05:30"),
    @("6609c31", "fix: fix AI chat UX, retrieval guard, composer layout, scrollbars", "2026-01-15T22:00:00+05:30"),
    @("7bea5d3", "feat: UI/UX improvements, hero CTA, skills expansion, nav, accessibility, back-to-top", "2026-01-15T23:00:00+05:30"),
    @("f2e8471", "fix: fix SCSS build error, replace @include transition with CSS property", "2026-05-16T08:00:00+05:30"),
    @("63de1f7", "fix: restore visual layout to last working state, keep AI chatbot intact", "2026-05-16T09:00:00+05:30"),
    @("1e8c57c", "fix: fix script load order, move jQuery plugins inside .then() and bump SW cache v3", "2026-05-16T10:00:00+05:30"),
    @("cdfe29e", "fix: fix SW 503 noise, return 200 empty on network failure; bump cache v4", "2026-05-16T11:00:00+05:30"),
    @("75de3f9", "feat: update humans.txt with contact info, exclude search.json from sitemap", "2026-05-16T12:00:00+05:30"),
    @("9779109", "perf: defer non-critical CSS, remove duplicate tags, add sitemap priorities", "2026-05-16T13:00:00+05:30"),
    @("eeef93e", "chore: fully hide blog, noindex all posts, remove from sitemap", "2026-05-16T14:00:00+05:30"),
    @("952d6d2", "content: update home page hero copy and typed lines", "2026-05-16T23:00:00+05:30")
)

$parent = ""
$count = 0

foreach ($group in $groups) {
    $targetHash = $group[0]
    $message = $group[1]
    $date = $group[2]
    
    # Get the tree (file snapshot) of the target commit
    $tree = (git rev-parse "${targetHash}^{tree}").Trim()
    
    if ($tree -eq "") {
        Write-Host "ERROR: Could not get tree for $targetHash" -ForegroundColor Red
        exit 1
    }
    
    # Create the commit
    $newHash = Make-Commit $tree $parent $message $date $authorName $authorEmail
    $parent = $newHash
    $count++
    
    Write-Host "[$count/95] $message" -ForegroundColor Green
}

Write-Host "`nDone! Created $count commits on clean-history branch." -ForegroundColor Cyan
Write-Host "Done building clean history. Now switching main to it and force pushing..." -ForegroundColor Yellow
