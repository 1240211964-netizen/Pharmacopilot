# 2026-05-24 Course Positioning Calibrator

## Scope

- Refactored the first teaching-navigation station from a normal choice question into a knowledge-point teaching-function positioning calibrator.
- Replaced the old abstract positioning triangle with three concise evidence cards: course goal, pharmacy administration task, and student output.
- Updated the station decision prompt and options to A/B/C positioning judgments.
- Added explicit feedback for all three options after selection.
- Added an auto-generated positioning sentence and three downstream design constraints.
- Changed the global flow label from `证据图` to the more neutral `依据/图表`, while station 1 uses `定位依据`.
- Kept the page within the existing teaching-navigation shell and aligned the page nav with the shared index-style navigation.

## Files

- `前端核心/teaching-navigation.html`
- `前端核心/teaching-navigation-productized.js`
- `前端核心/teaching-navigation-productized.css`
- `scripts/verify-navigation-focus-v3.cjs`

## Validation

- `node --check 前端核心/teaching-navigation-productized.js`
- `node --check scripts/verify-navigation-focus-v3.cjs`
- `node scripts/verify-navigation-focus-v3.cjs`
- `npm run verify:unified-style`
- `npm run verify:teaching-terminology`
- `npm run build:server`
- `git diff --check -- 前端核心/teaching-navigation.html 前端核心/teaching-navigation-productized.js 前端核心/teaching-navigation-productized.css scripts/verify-navigation-focus-v3.cjs`

## Browser Smoke

- Opened `http://localhost:5173/teaching-navigation.html`.
- Confirmed station 1 title is `知识点教学功能定位校准器`.
- Confirmed the old `课程定位三角图` is absent.
- Confirmed the positioning panel renders three evidence cards and no SVG triangle.
- Confirmed the question is `看到这三项证据，本节课的主线更应该是什么？`.
- Confirmed selecting B shows `需要调整主线` and explains why A is the main line, why B is only a prerequisite explanation, and why C fits review rather than a new lesson.
- Confirmed selecting A auto-generates the required positioning sentence and downstream design constraints.
- Confirmed save is enabled after the positioning draft exists, while next remains disabled before saving.
- Confirmed no horizontal overflow in the checked desktop layout.

## Notes

- The in-app browser screenshot command timed out during this pass, so the smoke check used DOM, text, interaction state, and layout-width verification.
- Static preview mirrors under `dist/` were manually synchronized after source edits for local smoke testing.
