# Change Log

- 收缩 `renderMapNode`：节点默认只渲染关卡编号、状态/能力图标、环节短标题；reward 与 progress 只保留在 tooltip 信息中。
- 重写 `renderRouteGameMission` 的默认展示：改为极简 mission brief，本关任务、通关条件和解锁能力一屏可读，教师输入/产出边界进入折叠区。
- 收缩 `renderNodeDetailPanel`：说明态只显示简报与主按钮，细节默认折叠；训练态只显示推荐方案、生成摘要和确认按钮。
- 扩展 `renderTrainingOptionCards(step, choice, { compact, limit })`：教学导航弹层默认展示 3 个推荐方案，其余进入“更多方案”折叠区。
- 将 `renderProgressSummary` 从多卡片复盘改为 summary strip：已完成、当前阶段、下一关和“查看完整复盘”。
- 调整 `teaching-navigation.html` 文案，使首屏说明更短。
- 追加低密度 CSS 覆盖：缩小关卡卡片、减弱阴影和 glow、隐藏 reward/progress 默认显示、压缩 hero 区和复盘区。

