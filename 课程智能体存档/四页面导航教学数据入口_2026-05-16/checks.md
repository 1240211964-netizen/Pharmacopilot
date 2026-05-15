# Checks

- `node --check 前端核心/app.js`：通过。
- `npm run build:static`：通过。
- `npm run build:server`：通过。
- `npm run build`：通过。
- Browser 本地烟测 `http://127.0.0.1:5174/index.html`：导航为 首页 / 教学导航 / 教学实践 / 教学数据，首页高亮，控制台错误 0。
- Browser 本地烟测 `http://127.0.0.1:5174/teaching-navigation.html`：同四项导航，教学导航高亮，控制台错误 0。
- Browser 本地烟测 `http://127.0.0.1:5174/practice.html`：同四项导航，教学实践高亮，控制台错误 0。
- Browser 本地烟测 `http://127.0.0.1:5174/teaching-data.html`：同四项导航，教学数据高亮，标题为“管理学原理教学数据图谱”，控制台错误 0。
- Browser 本地烟测 `http://127.0.0.1:5174/assets.html`：旧入口兼容到同一教学数据页，控制台错误 0。
- `git diff --check`：通过。
