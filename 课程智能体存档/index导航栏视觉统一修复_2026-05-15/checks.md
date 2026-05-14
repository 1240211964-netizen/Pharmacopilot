# 校验记录

- `npm run build`：通过，包含 `build:static` 与 `build:server`。
- `git diff --check -- 前端核心/styles.css`：通过。
- 浏览器检查 `http://127.0.0.1:5181/index.html`：首页 header 已与 `teaching-navigation.html` 同一视觉样式。
- 浏览器检查 `http://127.0.0.1:5181/teaching-navigation.html`：基准导航仍正常。
- 移动端浏览器检查 `390x844` 下 `index.html`：菜单按钮可见，点击后 `body.nav-open` 生效，导航项为 `首页 / 教学导航 / 教学实践 / 教学资产`。
