# Change Log

- 将首页顶部导航改回四个一级入口：首页 / 教学导航 / 教学实践 / 教学数据。
- 将原 `前端核心/assets.html` 重命名为 `前端核心/teaching-data.html`，页面标题与核心文案改为“教学数据”。
- 保留旧 `/assets.html` 与 `/launch/assets.html` 路由兼容，指向教学数据页。
- 更新首页演示、任务预设、账号入口和地图资产入口中的高层页面链接，使其进入 `teaching-data.html`。
- 更新静态构建脚本，输出 `dist/teaching-data.html`、`dist/teaching-data/index.html`，并继续生成兼容的 `dist/assets.html`。
