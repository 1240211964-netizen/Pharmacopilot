# 检查记录

- `node --check 前端核心/teaching-navigation-productized.js`：通过。
- `node --check scripts/verify-navigation-focus-v3.cjs`：通过。
- `node scripts/verify-navigation-focus-v3.cjs`：通过。
- `npm run verify:unified-style`：通过。
- `npm run verify:teaching-terminology`：通过。
- `npm run build:server`：通过。
- `git diff --check -- ...`：通过。
- Browser：`http://[::1]:5173/teaching-navigation.html` 验证 10 个任务站、结构文案、选项说明、支持工具、无横向溢出、选择后反馈、生成后产物草稿和按钮门槛。
- Browser 导航栏对比：`http://[::1]:5173/index.html` 与 `http://[::1]:5173/teaching-navigation.html` 均为 `site-header`，5 个导航链接一致；topbar 宽 1248、高 68、圆角 999px；教学导航页 active 项为“教学导航”。

## 未运行

- `npm run build:static`：当前工作区已有旧入口文件缺失，完整静态构建会因无关问题失败；本轮已定向同步教学导航相关 `dist` 镜像。
