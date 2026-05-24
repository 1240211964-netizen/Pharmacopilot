# 课程定位功能定位校准器检查记录

## Source Checks

- `node --check 前端核心/teaching-navigation-productized.js` passed.
- `node --check scripts/verify-navigation-focus-v3.cjs` passed.
- `node scripts/verify-navigation-focus-v3.cjs` passed.
- `npm run verify:unified-style` passed.
- `npm run verify:teaching-terminology` passed.
- `npm run build:server` passed.
- `git diff --check -- 前端核心/teaching-navigation.html 前端核心/teaching-navigation-productized.js 前端核心/teaching-navigation-productized.css scripts/verify-navigation-focus-v3.cjs` passed.

## Browser Smoke

- URL: `http://localhost:5173/teaching-navigation.html`
- Station 1 rendered as `知识点教学功能定位校准器`.
- Left panel rendered three evidence cards: `课程目标`, `药事管理任务`, `学生产出`.
- The old `课程定位三角图` and station-1 SVG triangle were absent.
- Decision prompt rendered as `看到这三项证据，本节课的主线更应该是什么？`.
- Selecting B rendered `需要调整主线` with A/B/C explanations.
- Selecting A rendered `主线成立`, auto-generated the positioning sentence, and enabled save while keeping next disabled before saving.
- Checked desktop layout width for horizontal overflow; no overflow detected.

## Limitation

- The in-app browser screenshot command timed out. Verification used DOM, interaction state, and layout measurements.
