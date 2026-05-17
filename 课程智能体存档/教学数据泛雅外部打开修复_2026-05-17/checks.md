# Checks

- `node --check 前端核心/app.js`：通过。
- `rg -n "loadFanyaKnowledgeGraph|fanyaKnowledgeFrame|fanyaKnowledgeEmbedTimer|FANYA_KNOWLEDGE_GRAPH_TIMEOUT|尝试在本页预览|重新预览" 前端核心 部署、接入说明/docs/fanya-integration.md`：无遗留命中。
- `npm run build:static`：通过。
- `npm run build:server`：通过。
- `npm run build`：通过。
- `git diff --check`：通过。
- 本地服务 `PORT=5174 npm start`：可启动。
- Headless Chrome 烟测 `http://localhost:5174/teaching-data`：页面标题为 `Pharmacopilot | 教学数据`。
- Headless Chrome 烟测确认：`#fanyaKnowledgeGraphPanel` 的 `data-embed-state` 为 `external`。
- Headless Chrome 烟测确认：页面已不存在 `#fanyaKnowledgeFrame` 与 `#loadFanyaKnowledgeGraph`。
- Headless Chrome 烟测确认：页面显示“内嵌预览受限”提示。
- 浏览器烟测确认：泛雅面板主入口 `#openFanyaKnowledgeGraph` 的 `target="_blank"`、`rel="noopener noreferrer"` 和新 `frameDiagramTeacher` 地址均存在。
- 浏览器烟测确认：课程图谱动作面板 `.course-action-external` 的 `target="_blank"`、`rel="noopener noreferrer"` 和新 `frameDiagramTeacher` 地址均存在。
- Headless Chrome `stderr`：空。
- 未点击外部泛雅链接，避免在验证过程中主动把带课程参数的 URL 发往第三方。
