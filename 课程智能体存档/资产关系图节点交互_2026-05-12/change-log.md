# Change Log

## Before edits
- Created this archive folder before source edits.
- Copied pre-change files into `before/`.
- Ran pre-change checks and recorded results in `checks.md`.

## Planned implementation
- Add click and keyboard handlers to the DOM-based relation graph.
- Make the current asset node and four surrounding relation nodes focusable buttons.
- Add selected-node visual state and contextual inspector content.

## After edits
- Added `selectedAssetRelationNode` state to track the active graph node.
- Converted the center asset node and four relation nodes into clickable buttons with `aria-pressed`.
- Added click handlers that update selected styling and the `assetGraphDetail` inspector without changing the asset card flow.
- Added hover, focus-visible, and selected styles so node interactivity is visible.
- Verified desktop and mobile graph node clicks in the browser.
