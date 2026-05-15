# Checks

- `npm run typecheck`：通过。
- `npm run build`：通过。
- `node --check 前端核心/app.js && node --check dist/app.js`：通过。
- `git diff --check`（本轮修改文件范围）：通过。
- API smoke：临时端口 `PORT=5183 npm start` 后验证：
  - `POST /api/generate/pipeline` status `200`
  - `ok: true`
  - `outline.steps.length: 20`
  - `scenes.length: 21`
  - `evidenceRules.length: 21`
  - `assetPack.items.length: 6`
  - `runtime.currentSceneId: scene-01`
  - `runtime.takeoverPoints.length: 5`
  - `exports.formats`: `lesson_plan:docx/html`, `ppt:pptx`, `activity_sheet:pdf/html`, `rubric:xlsx/html`, `evidence_chain:html/json`, `reflection_report:docx/html`
- 结构校验：`scene-01` 到 `scene-20` 顺序正确，`scene-asset-graph` 独立存在，`scene-01` 默认 running，其余默认 queued。
- Browser smoke：在 `http://localhost:5183/`、`/practice.html`、`/assets.html` 确认页面有 `main` 内容，实践页存在 `#pipelineRuntimePreview`，未观察到白屏。

备注：默认 5173 端口已被其他进程占用，本轮验证使用 5183 临时端口。
