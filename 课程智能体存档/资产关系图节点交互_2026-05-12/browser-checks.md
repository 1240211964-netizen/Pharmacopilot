# Browser Checks

Target: `http://127.0.0.1:5174/assets.html`

## Desktop
- Reloaded `/assets.html`.
- Verified relation graph exposes 5 clickable nodes: center asset, source, stage, boundary, reuse.
- Clicked boundary node: `aria-pressed=true`, inspector changed to the source-boundary text.
- Clicked reuse node: `aria-pressed=true`, inspector changed to the reuse task.
- Clicked center asset node: `aria-pressed=true`, inspector returned to current asset.
- Console error check: no browser console errors.

## Mobile Width
- Set viewport to `390 x 844`.
- Reloaded `/assets.html`.
- Verified 5 relation nodes remain clickable in stacked mobile layout.
- Clicked stage node: `aria-pressed=true`, inspector changed to the teaching stage.
- Console error check: no browser console errors.
- Reset browser viewport after the check.
