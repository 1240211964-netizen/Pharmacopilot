# Change Log

## Clean-room reference

- Read OpenMAIC public repository structure only for architecture ideas.
- Stored architecture notes in `reference/openmaic-clean-room-notes.md`.
- Did not copy OpenMAIC source code, styles, components, prompts, or implementation details.

## Frontend

- Reframed `前端核心/index.html` as a course generation console instead of a normal homepage.
- Changed the primary navigation flow to `课程生成 / 实践运行 / 教学资产 / 评价证据`.
- Kept right-side header actions as `查看样例 / 进入工作台`.
- Added generation-mode controls for teaching outline, runtime scene, evaluation evidence, and asset pack.
- Wired homepage submit to call `/api/generate/pipeline` first, then route to the appropriate workbench with local fallback.
- Reworked homepage demo tabs and output preview around PharmacoPilot pipeline concepts.
- Kept the visual language in warm academic colors and removed homepage blue/violet accent usage.

## Backend

- Added clean-room PharmacoPilot generation modules:
  - `course-outline-generator`
  - `teaching-scene-generator`
  - `evidence-rule-generator`
  - `asset-pack-generator`
  - `pipeline-runner`
- Added teaching orchestration, runtime, action engine, and export manifest modules.
- Added local API endpoints:
  - `/api/generate/course-outline`
  - `/api/generate/teaching-scene`
  - `/api/generate/evidence-rule`
  - `/api/generate/asset-pack`
  - `/api/generate/pipeline`
  - `/api/generate-classroom`

## Archive

- Before and after source copies are stored under this folder.
- Browser screenshots are stored as `browser-home-desktop.png` and `browser-home-mobile.png`.
