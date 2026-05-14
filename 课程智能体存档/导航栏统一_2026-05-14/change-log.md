# 导航栏统一

- 以 `前端核心/teaching-navigation.html` 的站点导航栏为基准。
- 统一 `index.html`、`auth.html`、`navigation.html`、`practice.html`、`assets.html`、`interface-review-improved.html` 的 header 结构。
- 将主导航统一为 `首页 / 教学导航 / 教学实践 / 教学资产`。
- 将右侧主操作统一为 `完成训练后进入实践`，指向 `practice.html`。
- 移除 `practice.html` 顶部额外的 `课程资源` 导航项，避免主导航结构不一致。
- 将 `interface-review-improved.html` 从锚点式旧导航改为站点统一导航，并补齐移动端菜单按钮。
- 调整 `app.js` 的导航高亮逻辑，让旧 `navigation.html` 页面也高亮 `教学导航`。
