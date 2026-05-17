# Checks

## Static / Code

- Passed: `node --check 前端核心/app.js`
- Passed: `git diff --check`
- Passed: `npm run build:static`
- Passed: `npm run build:server`
- Passed: `npm run build`

## Browser Verification

- Served `前端核心/` locally at `http://127.0.0.1:5188/`.
- Checked pages:
  - `http://127.0.0.1:5188/teaching-navigation.html`
  - `http://127.0.0.1:5188/practice.html`
  - `http://127.0.0.1:5188/teaching-data.html`
- Desktop screenshots generated:
  - `browser/teaching-navigation-desktop-final.png`
  - `browser/practice-desktop-final.png`
  - `browser/teaching-data-desktop-final.png`
- Mobile screenshots generated:
  - `browser/teaching-navigation-mobile-final.png`
  - `browser/practice-mobile-final.png`
  - `browser/teaching-data-mobile-final.png`
- In-app browser mobile check at `390 x 1200`:
  - `teaching-navigation`: document overflow `0`; route-map canvas remains an intentional horizontal-scroll work area.
  - `practice`: document overflow `0`; no visible text overflow.
  - `teaching-data`: document overflow `0`; no visible text overflow.
