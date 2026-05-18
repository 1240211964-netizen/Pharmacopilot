# index 科学探索窗口移植变更记录

## 变更范围
- 在 `前端核心/index.html` 首页一句话对话窗口内加入闻道科学探索挂载点，并加载 `wenda-env.js` / `wenda-embed-workspace.js`。
- 在 `src/wenda-embed-entry.tsx` 支持通过 `data-wenda-variant="home-dialog"` 选择首页紧凑版。
- 在 `src/components/integrations/WendaEmbedWorkspace.tsx` 增加 `home-dialog` 变体，固定承接教学数据工作台中的“科学探索”入口。
- 在 `前端核心/styles.css` 增加首页对话窗口内的科学探索 iframe 样式，避免复用教学数据页完整大工作台样式。
- 重新生成 `前端核心/wenda-embed-workspace.js`。

## 行为边界
- 教学数据页原来的完整闻道工作台保留。
- 首页只展示紧凑版“科学探索”窗口，不把完整左侧功能导航迁入首页。
- iframe 仍保留“新窗口打开”兜底，第三方平台若限制跨站内嵌不会被绕过。
