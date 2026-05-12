# Change Log

## Before edits
- Created archive before source edits.
- Copied relevant pre-change files into before/.

## After edits
- Removed the particle graph's node repulsion force, link spring force, and pointer repulsion force that caused dragged/hovered graphs to stretch.
- Kept the visual motion by constraining each node to a small orbit around a stable anchor point.
- Added resize-aware relayout: when canvas dimensions change, node positions reset to their anchors instead of reusing stale coordinates.
- Changed pointer movement to hover-only highlighting and tooltip behavior; it no longer pushes nodes away.
- Limited persistent canvas labels to the core node and the current hover target, avoiding selected-node label overlap after clicks.
- Preserved node clicking, asset-card graph sync, KPI/filter/legend rendering, and mobile responsiveness.
- Copied post-change files into `after/`.
