请在当前 1240211964-netizen/Pharmacopilot 仓库中，仿照 OpenMAIC 的 architecture pattern 实现 PharmacoPilot 的第一版多智能体运行时系统。注意：只借鉴架构思想，不复制 OpenMAIC 代码。

目标不是做多个聊天角色，而是实现：

1. Director 调度器
2. Agent Registry
3. Teaching Action DSL
4. SSE 流式 agent endpoint
5. 前端 ActionEngine
6. practice.html 页面接入第一版 Copilot 运行状态

后端新增 `后端核心/src/agent/`，前端新增 `前端核心/agent-runtime/`，并接入 `POST /api/agent/run` 与 `practice.html`。
