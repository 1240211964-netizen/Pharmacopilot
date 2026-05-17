# Checks

- `node --check 前端核心/app.js`：通过。
- `npm run build:server`：通过。
- `npm run build:static`：通过。
- `npm run build`：通过。
- `git diff --check`：通过。
- 本地服务 `PORT=5174 npm start`：可启动。
- `GET http://localhost:5174/api/fanya/knowledge-graph/status`：返回 `state=external_only`、`canPreview=false`，并说明缺少 `FANYA_KNOWLEDGE_PROXY_ENABLED=true` 与服务器侧泛雅授权。
- Headless Chrome 烟测 `http://localhost:5174/teaching-data`：页面标题正确，存在 `#fanyaKnowledgeFrame` 与 `#loadFanyaKnowledgeGraph`，iframe 初始 `src=about:blank`，不会自动请求泛雅。
- `GET http://localhost:5174/api/fanya/knowledge-graph/frame`：未配置时返回 424 与本地说明页，不向前端暴露账号、密码、cookie 或授权码。
- 未点击外部泛雅链接，未主动用当前课程参数请求泛雅原站。
