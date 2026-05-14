# Change Log

## 修改范围

- 修改 `前端核心/styles.css`。
- 未修改各页面导航栏 HTML。
- 未修改登录后欢迎用户的渲染逻辑。

## 具体变更

- 为 `.top-actions[data-account-actions] .nav-outline-action` 和 `.top-actions[data-account-actions] .nav-primary-action` 增加共享按钮样式。
- 将 `登录` 明确渲染为 `inline-flex` 圆角描边按钮，并移除链接下划线。
- 将 `注册` 在账号区固定为 index 页同款棕色实心圆角按钮。
- 保留 hover 位移和阴影反馈，使其他页面与 index 页交互表现一致。

## 影响页面

- `index.html`
- `teaching-navigation.html`
- `practice.html`
- `assets.html`
- `auth.html`
- `navigation.html`
- `interface-review-improved.html`
