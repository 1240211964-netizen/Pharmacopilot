本轮验证记录：

- `node --check 前端核心/app.js`：通过。
- `git diff --check -- 前端核心/app.js 前端核心/styles.css 前端核心/teaching-navigation.html`：通过。
- `npm run build`：通过，包含 `build:static` 与 `build:server`。
- `curl -I http://localhost:5173/teaching-navigation.html`：返回 `HTTP/1.1 200 OK`。
- 浏览器 DOM 烟测：首屏显示 `06 / 20`，当前阶段为 `目标设计`，06 当前站点和右侧说明卡仍正常渲染。
