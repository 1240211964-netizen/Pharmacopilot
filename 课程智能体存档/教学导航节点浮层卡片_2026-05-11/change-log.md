# Change Log

## Before

- `teachingNodeDetail` rendered inside a left-side `route-detail-card` that stayed visible as a fixed workbench column.
- Clicking a map node refreshed the left column rather than creating a contextual card in the map.

## After

- Moved `route-detail-card` into `.route-map-card` and retained `teachingNodeDetail` as the stable detail id.
- Added `routeNodeCardOpen` and `routeNodeCardExpanded` states.
- Initial render hides the node detail card and lets the map occupy the full route stage.
- Clicking a map node opens a map-contained summary popover.
- Added summary-to-expanded flow: summary shows node essentials; expanded view shows A-F options, scoring feedback, training entry, confirmation, and collapse.
- Option selection keeps the popover expanded and refreshes scoring state.
- Confirming a node advances the route and returns the popover to summary mode for the next node.
- Added close button and `Esc` support for the node popover.
- Updated CSS so the popover is positioned inside the map, avoids the status strip, scrolls when expanded, and remains inside the map on mobile.

## Files

- `前端核心/teaching-navigation.html`
- `前端核心/app.js`
- `前端核心/styles.css`
- `package.json` unchanged but archived for traceability.
