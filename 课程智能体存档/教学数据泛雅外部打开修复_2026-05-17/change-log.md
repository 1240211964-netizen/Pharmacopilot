# 教学数据泛雅外部打开修复

- 移除教学数据页泛雅知识图谱面板里的 iframe 和“本页预览”按钮，避免用户以为可在当前页面直接移植泛雅面板。
- 将泛雅知识图谱面板状态固定为 `data-embed-state="external"`，展示“内嵌预览受限”的本地说明。
- 保留 `#openFanyaKnowledgeGraph` 新窗口打开入口，并继续写入当前 `frameDiagramTeacher` 泛雅地址、`target="_blank"` 与 `rel="noopener noreferrer"`。
- 简化 `前端核心/app.js` 中的泛雅面板初始化逻辑，只负责统一链接地址与新窗口属性，删除 iframe 超时与失败检测代码。
- 更新 `部署、接入说明/docs/fanya-integration.md`，明确泛雅知识图谱依赖原站登录态和课程权限，当前实现不保存账号、密码、cookie 或授权码。
