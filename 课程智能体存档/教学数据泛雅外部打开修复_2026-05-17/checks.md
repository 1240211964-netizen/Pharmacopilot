# Checks

- `node --check 前端核心/app.js`：通过。
- `npm run build:static`：通过。
- `npm run build:server`：通过。
- `npm run build`：通过。
- `git diff --check`：通过。
- 本地服务 `PORT=5174 npm start`：可启动。
- 浏览器烟测 `http://localhost:5174/teaching-data.html`：页面标题为 `Pharmacopilot | 教学数据`。
- 浏览器烟测确认：泛雅面板主入口 `#openFanyaKnowledgeGraph` 的 `target="_blank"`、`rel="noopener noreferrer"` 和新 `frameDiagramTeacher` 地址均存在。
- 浏览器烟测确认：课程图谱动作面板 `.course-action-external` 的 `target="_blank"`、`rel="noopener noreferrer"` 和新 `frameDiagramTeacher` 地址均存在。
- 浏览器烟测确认：iframe 初始 `src` 仍为 `about:blank`，不会在页面打开时自动请求泛雅。
- 浏览器控制台错误：0 条。
- 未点击外部泛雅链接，避免在验证过程中主动把带课程参数的 URL 发往第三方。
