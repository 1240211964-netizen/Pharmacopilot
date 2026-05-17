# Checks

- `node --check 前端核心/app.js`：通过。
- `npm run build:static`：通过。
- `npm run build:server`：通过。
- `npm run build`：通过。
- `git diff --check`：通过。
- 本地服务 `PORT=5174 npm start`：可启动。
- 浏览器烟测 `http://localhost:5174/teaching-data.html`：页面标题为 `Pharmacopilot | 教学数据`，`#fanyaKnowledgeGraphPanel` 存在。
- 浏览器烟测确认：`#fanyaKnowledgeFrame` 初始 `src` 为 `about:blank`，不会在页面打开时自动请求泛雅。
- 浏览器烟测确认：“在泛雅打开”的 `href` 与用户提供的泛雅知识图谱地址一致。
- 浏览器控制台错误：0 条。
- 未点击“尝试嵌入泛雅面板”，避免在验证过程中主动把带课程参数的 URL 发往第三方。
