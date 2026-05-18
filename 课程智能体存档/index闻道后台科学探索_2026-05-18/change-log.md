# 改动记录

- `前端核心/index.html`：将首页原来的完整闻道内嵌工作区替换为轻量“闻道科学探索后台运行”输入区，保留新窗口打开结果入口。
- `前端核心/app.js`：新增首页闻道运行器，使用 `URL` 和 `URLSearchParams` 构造 `/api/openAccess/redirect/history` 链接，提交后写入隐藏 iframe 并保存最近一次探索记录。
- `前端核心/styles.css`：新增首页闻道输入区、状态面板、预设问题和隐藏 iframe 样式，保持现有首页工作台视觉。
- `前端核心/index.html`：移除首页对 `wenda-embed-workspace.js` 的加载，避免在首页渲染完整闻道工作区；教学数据页完整嵌入不受影响。
