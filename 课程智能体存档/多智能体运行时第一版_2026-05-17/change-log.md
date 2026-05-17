# 多智能体运行时第一版

日期：2026-05-17

## 变更

- 新增 `后端核心/src/agent/types.ts`，定义 TeachingModule、CourseContext、TeachingAction、AgentConfig、DirectorState、AgentRunRequest、AgentStreamEvent 等运行时契约。
- 新增 `registry.ts`，注册 context-diagnosis、navigation、practice、rubric、evidence、asset 六个第一版 agent，约束输出 JSON 与 allowedActions。
- 新增 `director.ts`，按 courseContext、module scene、rubric、evidence gap、asset graph 选择 nextAgentId。
- 新增 `runner.ts`，通过 OpenAI Chat Completions 以 `response_format: json_object` 执行 agent，并过滤不允许的 Teaching Action。
- 新增 `stream.ts`，提供最多 3 turn 的 async generator，输出 director_thinking、agent_start、text_delta、action、agent_end、session_state。
- 在 `后端核心/src/server.ts` 新增 `POST /api/agent/run` SSE 路由，不影响已有 `/api/generate/*`、`/api/knowledge/*`、`/api/fanya/*`。
- 在 `后端核心/src/http-utils.ts` 与 `package.json` 中接入 `agent-runtime` 静态资源映射和 build:static 复制。
- 新增 `前端核心/agent-runtime/events.js`、`state-store.js`、`action-engine.js`、`agent-client.js`。
- 在 `前端核心/practice.html` 新增“启动教学实践 Copilot”按钮及 status、message、flow、evidence、rubric 五个运行面板。
- 在 `前端核心/styles.css` 补充 practice agent runtime 响应式样式。

## 边界

- 保留现有 Node/TypeScript 后端、自定义 server 和静态前端结构。
- 未迁移到 Next App Router。
- 未删除旧 practice 页面能力。
- OpenMAIC 仅作为架构参考，未复制源码、样式或组件。
