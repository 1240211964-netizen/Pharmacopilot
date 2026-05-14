# 校验记录

- `node --check 前端核心/app.js`：通过。
- `npm run build`：通过，包含 `build:static` 与 `build:server`。
- `git diff --check -- 前端核心/index.html 前端核心/auth.html 前端核心/navigation.html 前端核心/practice.html 前端核心/assets.html 前端核心/teaching-navigation.html 前端核心/interface-review-improved.html 前端核心/app.js 前端核心/styles.css`：通过。
- 浏览器检查 `index.html` 未登录状态：右侧显示 `登录 / 注册`。
- 浏览器通过 `auth.html?mode=login` 登录测试账号 `yandilei@example.edu`：右侧显示 `欢迎回来，yandilei`。
- 浏览器检查 `teaching-navigation.html` 登录态：右侧继续显示 `欢迎回来，yandilei`。
