# 检查记录

执行时间：2026-05-18

## 命令检查

- `VITE_WENDAO_DOMAIN=cpu.libsp.net npm run build:wenda`：通过。
- `npm run typecheck`：通过。
- `VITE_WENDAO_DOMAIN=cpu.libsp.net npm run build:static`：通过。
- `git diff --check`：通过。
- `rg` 检查源组件和样式中的已删除可见字段：通过。

## 浏览器检查

- 使用本地静态服务访问 `http://localhost:5191/teaching-data.html#wendaEmbedWorkspaceRoot`。
- 截图保存到 `after/wenda-simplified.png`。
- 可见界面只保留左侧任务输入区和中间闻道 iframe 工作区。
- 右侧沉淀区已删除。
- 新窗口打开闻道页面入口仍保留。

## 说明

`前端核心/wenda-embed-workspace.js` 中仍包含底层 `buildWendaUrl` 的参数处理代码，这是构造闻道 URL 所需逻辑，不作为页面字段展示给用户。
