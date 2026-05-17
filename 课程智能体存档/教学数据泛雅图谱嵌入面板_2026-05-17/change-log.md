# 教学数据泛雅图谱嵌入面板

- 在 `前端核心/teaching-data.html` 新增“泛雅知识图谱面板”区域，位于本地课程图谱之后。
- 新面板默认不加载外部页面，iframe 初始为 `about:blank`，由教师点击“尝试嵌入泛雅面板”后才请求泛雅图谱地址。
- 在 `前端核心/app.js` 中新增泛雅图谱 iframe 状态管理：`idle / loading / loaded / fallback`，并保留“在泛雅打开”原站跳转。
- 在 `前端核心/styles.css` 中补齐面板、iframe 容器、状态卡片、操作按钮和响应式样式。
- 更新 `部署、接入说明/docs/fanya-integration.md`，说明该面板不保存账号密码、token、cookie 或授权码。
- 保留 `teaching-data.html` 显示名与内部 `assets` 状态兼容关系。
