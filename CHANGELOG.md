# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-28

### Added
- **Command Palette**: Introduced `Ctrl+K` global navigation.
- **Tags**: Added metadata tags (Python, AI, AWS) to portfolio items for better SEO and future filtering.
- **Architecture**: Added Mermaid.js support for architecture diagrams.

### Changed
- **Contact Form**: Refactored to use AJAX for smoother submission without page reload.
- **Performance**: Removed legacy IE9 fallback scripts (`googlecode.com`) to improve load times.
- **Cleanup**: Consolidated CSS and removed unused layouts (`section-testimonials`, `section-pricing`).

### Fixed
- **Navigation**: Fixed keyboard navigation bug in Command Palette where search results were unreachable.
- **Console**: Silenced verbose debug logs for Service Workers.
- **Search**: Fixed Deep Search logic to correctly index new content.

### Removed
- **SQL Terminal**: Removed experimental SQL-based filter interface in favor of clean UI.
