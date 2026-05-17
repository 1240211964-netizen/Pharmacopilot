# Checks

- `npm run build:server`：通过。
- `npm run build:static`：通过，确认 `dist/agent-runtime/` 与 `dist/launch/agent-runtime/` 已复制。
- `npm run build`：通过。
- `npm run typecheck`：通过。
- `git diff --check`：通过。
- `curl http://localhost:5187/practice.html`：确认新增脚本、按钮和运行面板存在。
- `curl http://localhost:5187/agent-runtime/agent-client.js`：确认 `startAgentRun` 与 `/api/agent/run` 接入存在。
- `curl -N -X POST http://localhost:5187/api/agent/run`：
  - 有 practice courseContext 且无 practice flow 时，SSE 先返回 `director_thinking`，nextAgentId 为 `practice-agent`。
  - 无 courseContext 时，SSE 先返回 `director_thinking`，nextAgentId 为 `context-diagnosis-agent`。
  - 当前本地未配置 `OPENAI_API_KEY`，SSE 按预期返回 `error` event。
- 浏览器检查 `http://localhost:5187/practice.html`：
  - 新增运行台 DOM 存在。
  - 点击“启动教学实践 Copilot”后，右侧消息面板收到 agent_start 与 error 消息。
  - error 状态不再被流结束覆盖成 complete。
  - 页面无横向溢出。

## 未完成或环境限制

- 当前环境未配置真实 `OPENAI_API_KEY`，因此未执行真实模型 agent turn。
- 浏览器截图调用 `Page.captureScreenshot` 超时；已用 DOM 与交互检查替代视觉确认。
