# Change Log

## Before

- `teaching-navigation.html` used a darker standalone route-map visual language, separate from the revised homepage Cowork style.
- `renderStageOverview()` existed in `app.js`, but the current teaching navigation page did not expose `teachingStageOverview`, so the three-stage overview was not visible on the route page.

## After

- Updated teaching navigation hero copy to frame the page as a 20-step executable training route.
- Added `teachingStageOverview` to the page and styled it as a homepage-like segmented three-stage control.
- Restyled `route-map-section` as a large Cowork gradient stage.
- Moved the route detail panel visually to the left on desktop and restyled it as a dark task workbench.
- Kept the 2.5D route map as the main right-side preview, preserving all 20 nodes and map interaction.
- Preserved existing ids and did not change 20-step data, training state, backend routes, or old `navigation.html` logic.

## Files

- `前端核心/teaching-navigation.html`
- `前端核心/styles.css`
- `前端核心/app.js` unchanged but archived for traceability.
- `package.json` unchanged but archived for traceability.
