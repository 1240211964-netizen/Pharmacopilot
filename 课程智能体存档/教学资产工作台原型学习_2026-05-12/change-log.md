# Change Log

## Before edits
- Created this archive folder before source edits.
- Copied pre-change files into `before/`.
- Ran pre-change checks and recorded results in `checks.md`.

## Planned implementation
- Rework `前端核心/assets.html` into a static teaching assets workbench shell.
- Translate the supplied React prototype into existing `app.js` rendering functions and CSS.
- Preserve storage behavior and existing action ids while adding display normalization, filters, relation graph sync, and reusable asset cards.

## After edits
- Converted `教学资产` into a teaching assets workbench with hero CTA, source statistics, asset flow strip, collapsed import panel, filterable asset cards, asset manual, and reuse action band.
- Replaced the particle graph runtime with a DOM-based explainable relation graph centered on the selected asset.
- Added asset display normalization for `source`, `type`, `status`, `stage`, `boundary`, `usage`, `risk`, and `evidence`.
- Added source/type/status/search filtering and synchronized filter results with the graph and detail preview.
- Preserved local storage behavior and existing upload/delete/copy/use actions.
- Copied post-change files into `after/`.
- Ran post-change checks and browser interaction checks.
