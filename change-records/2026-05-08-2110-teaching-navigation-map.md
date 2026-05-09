# 2026-05-08 21:10 Teaching Navigation Map

## Purpose
- Add a dedicated teaching navigation page for the Management Principles SWOT teaching example.
- Preserve the prior version before changing shared frontend files.

## Backup
- `change-records/backups/2026-05-08-2110-teaching-navigation-map/`

## Files Planned
- `前端核心/teaching-navigation.html`
- `前端核心/index.html`
- `前端核心/navigation.html`
- `前端核心/practice.html`
- `前端核心/assets.html`
- `前端核心/interface-review-improved.html`
- `前端核心/app.js`
- `前端核心/styles.css`
- `package.json`
- `tsconfig.json`
- `后端核心/src/http-utils.ts`
- generated `dist/` files after build

## Change Summary
- Added `前端核心/teaching-navigation.html` as the primary teaching navigation route map page.
- Wired `/teaching-navigation`, `/teaching-navigation/`, `/teaching-navigation.html`, and launch HTML serving.
- Added a data-driven 20-node route map in `前端核心/app.js` with status simulation, node switching, tooltip-ready nodes, detail panel updates, modal training task preview, rubric focus, and material-generation toast.
- Added dedicated 2.5D DOM + SVG map styles, desktop two-column layout, and mobile stacked layout with SVG hidden below 760px.
- Updated top navigation and homepage teaching navigation card to point to the new page.
- Replaced outdated frontend copy with the Management Principles SWOT classroom case framing.
- Excluded `change-records` from root TypeScript scanning so backup `.ts` files do not affect type checks.

## Verification
- `node --check 前端核心/app.js` passed.
- `npm run build:static` passed.
- `npm run build:server` passed.
- `npm run build` passed.
- `node --check dist/app.js` passed.
- `node --check dist/launch/app.js` passed.
- Frontend copy scan for outdated route wording and unrelated example noise returned no matches in `前端核心`, `dist`, and `后端核心`.
- Browser smoke test at `http://localhost:5183/teaching-navigation` passed:
  - H1 rendered as `新教师三步上手路径`.
  - 20 map nodes rendered.
  - 3 stage cards and 4 progress cards rendered.
  - Clicking node 10 updated the detail panel to `SWOT 矩阵搭建`.
  - `进入训练` opened the task modal.
  - Console error log check returned no errors.
- Responsive smoke test at 390x844 passed:
  - 20 map nodes remained rendered.
  - SVG route was hidden.
  - Mobile node title remained readable.
- `npm run typecheck` still fails on pre-existing `.next/types` and `API版的后端` alias errors; the new backup-directory error from this round was fixed by excluding `change-records`.
