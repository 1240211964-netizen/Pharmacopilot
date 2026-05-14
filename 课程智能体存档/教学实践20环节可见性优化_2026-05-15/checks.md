# Checks

- `node --check 前端核心/app.js` passed.
- `npm run build:static` passed.
- `npm run build:server` passed.
- `git diff --check -- 前端核心/practice.html 前端核心/styles.css 前端核心/app.js` passed.
- `curl -s http://localhost:5173/practice.html` confirmed the 20-step route, STEP 12 current state, STEP 14 intervention state, and STEP 17/20 later-confirm states are present.
- Opened `http://localhost:5173/practice.html?v=route-final` in Chrome and verified that the route overview, current step, intervention states, and Copilot work state are visible.
- Saved Chrome headless screenshots:
  - `screenshots/desktop-practice-route.png`
  - `screenshots/mobile-practice-route.png`
