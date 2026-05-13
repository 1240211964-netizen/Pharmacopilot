本轮验证记录：

- `node --check 前端核心/app.js`：通过。
- `git diff --check -- 前端核心/app.js 前端核心/styles.css 前端核心/teaching-navigation.html`：通过。
- `npm run build`：通过，包含 `build:static` 与 `build:server`。
- `curl -I http://localhost:5173/teaching-navigation.html`：返回 `HTTP/1.1 200 OK`。
- 浏览器 DOM 交互烟测：页面渲染 5 个阶段 Tab、20 个站点、右侧默认说明卡；点击“案例任务”Tab 后选中 09；浏览状态未出现 A-F；点击 06 的“开始本环节训练”后出现 A-F 方案区；点击“返回环节说明”后 A-F 消失。
- 备注：本轮 in-app browser 截图捕获接口超时，已用 DOM 快照完成交互验证。
