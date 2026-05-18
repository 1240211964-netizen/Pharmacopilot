# 变更记录

- 新增 `src/lib/wenda.ts`，实现 `buildWendaUrl`、闻道 route 类型、默认参数和运行时 domain 读取。
- 新增 `src/components/integrations/WendaEmbedWorkspace.tsx`，实现三栏闻道内嵌工作台。
- 新增 `src/wenda-embed-entry.tsx` 和 `scripts/build-wenda-embed.cjs`，为当前静态站点生成可运行的 React 浏览器脚本。
- 将 `teaching-data.html` 接入 React 挂载点，并移除旧的静态学术服务平台面板和暂不需要的泛雅知识图谱面板。
- 新增 `前端核心/wenda-env.js` 和 `前端核心/wenda-embed-workspace.js` 静态产物，并让 `build:static` 自动生成和复制它们。
- 更新 `后端核心/src/http-utils.ts`，让本地 Node 服务能够返回闻道工作区脚本。
- 更新 `.env.example`，增加 `VITE_WENDAO_DOMAIN=cpu.libsp.net` 配置示例。
