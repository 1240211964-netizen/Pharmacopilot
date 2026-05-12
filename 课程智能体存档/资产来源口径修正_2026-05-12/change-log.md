# Change Log

## Before edits
- Created archive before source edits.
- Copied relevant pre-change files into before/.

## After edits
- Removed `教学导航` from the asset source filter list.
- Reclassified tutorial/training records as `系统示例` instead of a real teaching asset source.
- Updated asset page copy so source summaries refer to 教学实践、教师上传、泛雅同步、系统示例.
- Added a display adapter for old localStorage records so legacy `教学导航` text is shown as `新手教程` in asset cards, evidence tags, graph details, and boundaries.
- Updated the particle graph labels from `导航训练` to `新手教程`.
- Switched particle graph node construction to use normalized workbench assets so graph details do not leak old source labels.
- Added a small timeout fallback for graph rendering so the KPI/filter panel initializes even when `requestAnimationFrame` is delayed.
- Copied post-change files into `after/`.
