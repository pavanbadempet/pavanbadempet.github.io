# Testing Strategy

This project uses a **Test-Driven Documentation** approach. We verify that the site meets quality standards using automated testing pipelines.

## 1. Automated Testing (CI/CD)

The GitHub Actions workflow (`.github/workflows/jekyll.yml`) runs the following checks on every push:

### HTML Proofer
We use `html-proofer` to validate the generated site (`_site`). 
It checks for:
- **Broken Internal Links**: Ensures no 404s.
- **Image Accessibility**: Ensures all `<img>` tags have `alt` attributes.
- **HTML Validity**: Checks for basic HTML syntax errors.
- **Unsafe Content**: Warns against HTTP images.

**Command:**
```bash
htmlproofer ./_site --disable-external --check-html --check-img-http --allow-hash-href
```

## 2. Manual Verification Checklist

Before deploying, ensure:

- [ ] **Accessibility**: Use Chrome Lighthouse to check for ARIA labels on all interactive elements.
- [ ] **Performance**: Ensure images are `loading="lazy"`.
- [ ] **Responsiveness**: Check the Mobile Menu behavior.
- [ ] **Security**: Verify `rel="noopener noreferrer"` on external links.
- [ ] **Logic**: Verify JavaScript features like the "Quantum Flux" animation work without console errors.

## 3. Local Testing

To run tests locally:

1. Build the site:
   ```bash
   bundle exec jekyll build
   ```
2. Run HTML Proofer:
   ```bash
   bundle exec htmlproofer ./_site
   ```
