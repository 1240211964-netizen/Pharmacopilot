# Checks

- `node --check 前端核心/app.js` passed.
- `npm run build:static` passed.
- `npm run build:server` passed.
- `git diff --check -- 前端核心/practice.html 前端核心/app.js 前端核心/styles.css` passed.
- `curl -s http://localhost:5173/practice.html` confirmed target copy is present and old “20 环节自动推进路线 / 3 项待确认” copy is absent from the new main surface.
- Opened `http://localhost:5173/practice.html` in Chrome and verified the top page structure visually.
- Saved Chrome headless screenshots:
  - `screenshots/desktop-practice.png`
  - `screenshots/mobile-practice.png`
  - `screenshots/mobile-tall-practice.png`
