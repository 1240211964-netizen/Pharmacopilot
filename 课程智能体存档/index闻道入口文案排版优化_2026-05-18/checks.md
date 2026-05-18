# Checks

- `npm run build:static`：通过。
- `npm run typecheck`：通过。
- `git diff --check -- 前端核心/index.html 前端核心/app.js 前端核心/styles.css`：通过。
- Browser 本地验证 `http://localhost:5173/index.html`：
  - 首页闻道模块可见文本不再包含 `前端只保留`、`openAccess`、`跨站`、`iframe`、`后台运行` 等实现说明词。
  - 桌面视口下标题显示为单行“闻道科学探索”，输入区与状态卡对齐，模块高度约 364px。
