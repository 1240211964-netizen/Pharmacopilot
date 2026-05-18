# 检查记录

执行时间：2026-05-18

## 命令检查

- `VITE_WENDAO_DOMAIN=cpu.libsp.net npm run build:wenda`：通过。
- `npm run typecheck`：通过。
- `VITE_WENDAO_DOMAIN=cpu.libsp.net npm run build:static`：通过。
- `git diff --check`：通过。
- `rg` 检查当前组件：确认 route 为 `ai_knowledge_base`，源组件不再展示“检索问题”和“启用联网检索”。

## 浏览器检查

- 使用本地静态服务访问 `http://localhost:5191/teaching-data.html#wendaEmbedWorkspaceRoot`。
- 截图保存到 `after/wenda-ai-knowledge-base.png`。
- 可见页面标题、左侧入口、iframe 工具栏和新窗口入口均已切换为 AI 知识库语义。

## 说明

`前端核心/wenda-embed-workspace.js` 中仍包含通用 `buildWendaUrl` 对其他 route 的兼容逻辑，这是共享工具函数的构建结果；当前组件实际传入的是 `ai_knowledge_base`。
