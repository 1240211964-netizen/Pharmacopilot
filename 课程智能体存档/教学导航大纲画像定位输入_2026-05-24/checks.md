# Checks

- `node --check 前端核心/teaching-navigation-productized.js`
  - 结果：通过。
- `node scripts/verify-navigation-focus-v3.cjs`
  - 结果：通过，覆盖新版 mock 大纲、班级画像、定位模式与导入状态。
- `npm run build:server`
  - 结果：通过。
- `npm run build:static`
  - 结果：失败。
  - 原因：构建脚本仍复制当前工作区已缺失的旧入口文件：`dashboard.html`、`settings.html`、`outputs.html`、`navigation.html`、`interface-review-improved.html`。
- 浏览器烟测
  - URL：`http://127.0.0.1:5173/teaching-navigation.html`
  - 结果：页面加载无 console error；选择“证据研究型定位”后出现“可用，但需补偿”；生成产物包含 mock 大纲输入、课程目标、画像判断和补偿提示。
