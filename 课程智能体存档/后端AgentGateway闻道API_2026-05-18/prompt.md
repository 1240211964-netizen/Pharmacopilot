# 用户需求

将当前 iframe 嵌入外部智能体网页的方案改造为“后端调用外部智能体 API，前端只渲染 PharmacoPilot 自有聊天界面”的架构。

核心约束：
- 前端不使用 iframe。
- 前端只请求 `/api/agent/chat`。
- WENDAO API Key 和外部 URL 只能保存在服务端环境变量。
- 保留已有 iframe 组件作为 fallback，不删除。
- 新增 `src/app/api/agent/chat/route.ts`、`src/server/agents/wendaoAdapter.ts`、`src/components/agent/AgentChatPanel.tsx` 和 `src/app/agent-demo/page.tsx`。
