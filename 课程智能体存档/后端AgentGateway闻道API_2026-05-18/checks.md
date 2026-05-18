# 检查记录

- `npm run typecheck`：通过。
- `npm run build:server`：通过。
- `VITE_WENDAO_DOMAIN=cpu.libsp.net WENDAO_DOMAIN=cpu.libsp.net npm run build`：通过；现在包含 `build:static`、`build:server`、`build:next`。
- `npx next build`：通过；输出 `/agent-demo` 静态页面和 `/api/agent/chat` 动态 API。
- `/api/agent/chat` 缺少 WENDAO 配置时返回 HTTP 424，并列出缺失的 `WENDAO_AGENT_API_URL`、`WENDAO_API_KEY`、`WENDAO_AGENT_ID`、`WENDAO_MODEL_ID`。
- `/api/agent/chat` 缺少 `message` 时返回 HTTP 400。
- 使用本地 mock 上游验证 `callWendaoAgent` 成功路径：请求携带 agent/model/message/dataset/file/image 参数，返回统一的 `answer/citations/raw`。
- `npx next start -p 5180` + Headless Chrome 截图：`agent-demo.png`，演示页正常渲染，无 iframe。
