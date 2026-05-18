# 改动记录

- 新增 `src/server/agents/types.ts` 与 `src/server/agents/wendaoAdapter.ts`，建立服务端 Agent Gateway 抽象和闻道适配器。
- 新增 `src/app/api/agent/chat/route.ts`，提供 Next App Router 版本的 `/api/agent/chat`。
- 新增 `后端核心/src/agent/wendao-chat.ts`，并在 `后端核心/src/server.ts` 接入当前可运行 Node 后端的 `/api/agent/chat`。
- 扩展 `后端核心/src/config.ts`、`后端核心/src/types.ts` 和 `.env.example`，读取 `WENDAO_AGENT_API_URL`、`WENDAO_API_KEY`、`WENDAO_AGENT_ID`、`WENDAO_MODEL_ID`。
- 新增 `src/components/agent/AgentChatPanel.tsx` 与 CSS Module，前端仅显示自有聊天、状态、错误和 citations 预留区，不使用 iframe。
- 新增 `src/app/agent-demo/page.tsx`、`src/app/layout.tsx` 和页面样式，提供教学智能体演示页。
- 新增 `src/package.json` 让 `src/app` 以 ESM 方式被 Next 编译；更新 `next.config.mjs` 固定 Turbopack root。
- 更新 `package.json`，使 `npm run build` 同时覆盖静态构建、Node 后端和 Next App Router。
