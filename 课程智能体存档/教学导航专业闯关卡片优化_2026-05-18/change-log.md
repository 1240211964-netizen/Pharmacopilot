# 变更记录

- 将教学导航页文案从“趣味关卡”收束为“专业化教学设计关卡”和“专业闯关卡片”。
- 强化 `renderMapNode` 的 Level 卡片结构：Level 编号、状态、能力图标、短标题、解锁奖励和进度条。
- 将 `renderRouteGameMission` 改为“关卡任务简报”，覆盖本关挑战、教师输入、智能体生成结果、通关条件、解锁奖励和开始挑战按钮。
- 将 `renderNodeDetailPanel` 的训练模式调整为“方案卡牌选择”，加入主方案卡、辅助方案卡、智能体推荐说明、成熟度评分、低分维度提示和确认通关。
- 补充 `route-level-card`、`route-game-mission`、`route-node-popover`、`route-workbench-card` 的专业化轻游戏视觉样式，并保留移动端横向路线图。
- 未改动 `routeTrainingNodes`、`routeGameMissionConfig`、训练状态 localStorage、已通关状态和当前关卡推进逻辑。
