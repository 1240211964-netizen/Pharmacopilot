# Checks

- `node --check 前端核心/app.js`：通过。
- `npm run build:static`：通过。
- `npm run build:server`：通过。
- `npm run build`：通过。
- 本地服务 `PORT=5174 npm start`：可启动。
- 浏览器烟测 `http://localhost:5174/teaching-data.html`：页面标题为 `Pharmacopilot | 教学数据`，存在“打开泛雅知识图谱”链接。
- 浏览器读取到的链接 `href` 与用户提供的泛雅知识图谱地址一致。
- 浏览器控制台错误：0 条。
- 未实际点击外部泛雅链接，避免把带课程参数的 URL 主动发送到第三方。
