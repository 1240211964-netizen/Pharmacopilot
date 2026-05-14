# 校验记录

- `node --check 前端核心/app.js`：通过。
- `npm run build`：通过，包含 `build:static` 与 `build:server`。
- `git diff --check -- 前端核心/index.html 前端核心/auth.html 前端核心/navigation.html 前端核心/practice.html 前端核心/assets.html 前端核心/interface-review-improved.html 前端核心/app.js`：通过。
- 浏览器检查 `http://127.0.0.1:5179/teaching-navigation.html`：基准导航可见。
- 浏览器检查 `index.html`、`auth.html`、`navigation.html`、`practice.html`、`assets.html`、`interface-review-improved.html`：均存在 `#primaryNav`、`#navMenuToggle`、统一四项导航和统一 CTA。
- 移动端浏览器检查 `390x844` 下 `practice.html`：菜单按钮可见，点击后 `body.nav-open` 生效。
