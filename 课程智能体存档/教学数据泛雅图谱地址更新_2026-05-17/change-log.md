# 教学数据泛雅图谱地址更新

- 将 `前端核心/app.js` 中的 `FANYA_KNOWLEDGE_GRAPH_URL` 从旧的 `knowledgeMapTempPage` 地址更新为新的 `knowledgeMap/frameDiagramTeacher` 地址。
- 将 `前端核心/teaching-data.html` 面板中的班级 ID 展示从 `131807556` 更新为 `131807646`。
- 保留现有安全边界：页面打开时 iframe 仍为 `about:blank`，不自动请求泛雅；教师点击后才尝试嵌入。
- 未修改 `teaching-data.html` 的 `body data-page="assets"`，继续保持教学数据页与旧 `assets` 内部状态兼容。
