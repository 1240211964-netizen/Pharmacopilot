# 教学数据泛雅知识图谱跳转

- 在 `前端核心/app.js` 中新增 `FANYA_KNOWLEDGE_GRAPH_URL` 常量，集中保存用户提供的泛雅知识图谱地址。
- 在 `教学数据` 页课程图谱的“建议动作 / 快捷操作”面板中新增“打开泛雅知识图谱”链接按钮。
- 保留原有节点动作复制逻辑和“复制节点上下文”能力。
- 在 `前端核心/styles.css` 中补充动作链接按钮的布局样式，使 `<a>` 链接与原按钮视觉一致。
- 未修改 `body data-page="assets"` 和 `data-nav="assets"`，继续保留 `teaching-data.html` 与旧 `assets` 内部状态兼容关系。
