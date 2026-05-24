# Checks

## RED

- `node --check 前端核心/teaching-navigation-productized.js`: passed before the edit.
- Positioning-lab token check: failed before the edit because the requested module was not present.

## GREEN

- `node --check 前端核心/teaching-navigation-productized.js`: passed.
- Positioning-lab token check: passed.
- VM behavior check for the appended module: passed; wrong answer keeps output hidden, correct answer reveals output and dispatches `pharmacopilot:positioning-complete`.
- `node scripts/verify-navigation-focus-v3.cjs`: passed.
- `node scripts/verify-teaching-terminology.cjs`: passed.
- `npm run build:server`: passed.
- `npm run build:static`: failed because these pre-existing source files are missing from `前端核心`: `dashboard.html`, `settings.html`, `outputs.html`, `navigation.html`, `interface-review-improved.html`.
- Manual static sync completed for:
  - `dist/teaching-navigation-productized.js`
  - `dist/launch/teaching-navigation-productized.js`
  - `dist/teaching-navigation/teaching-navigation-productized.js`
- Source and all three `dist` JS copies were rechecked for the requested module tokens after manual sync: passed.
