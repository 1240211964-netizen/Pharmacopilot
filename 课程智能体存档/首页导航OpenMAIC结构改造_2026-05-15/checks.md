# 检查记录

- `node --check 前端核心/app.js`：通过。
- `npm run build:static`：通过。
- `npm run build:server`：通过。
- `git diff --check -- 前端核心/index.html 前端核心/app.js 前端核心/styles.css`：通过。
- 首页导航新增样式片段扫描：未出现 `blue`、`purple`、`violet`、`neon`。
- 浏览器烟测：`http://localhost:5173/index.html` 桌面 1440x900 与移动 390x844 均通过；移动端菜单可展开，包含五个导航项和两个操作入口。
- 滚动烟测：滚动后 `.site-header.is-scrolled` 生效，背景加深、边框加深、轻微阴影生效。
- 控制台检查：桌面与移动烟测均无 `Runtime.exceptionThrown` 或 `Log.entryAdded` 错误事件。

浏览器输出：
- `browser-nav-checks.json`
- `browser-desktop-nav.png`
- `browser-mobile-nav-open.png`
