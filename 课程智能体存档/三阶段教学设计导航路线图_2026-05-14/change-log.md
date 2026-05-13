## 修改范围

- `前端核心/teaching-navigation.html`
- `前端核心/app.js`
- `前端核心/styles.css`

## 主要变化

- 将教学导航页统一调整为“三阶段教学设计导航路线图”表达，静态文案改为高校教师语境。
- 将阶段结构收敛为三阶段：课前教学设计与准备 01-08、课中教学实施与调控 09-16、课后评价反馈与持续改进 17-20。
- 将 20 个环节按三条横向教学推进路径排布：第一行 01-08、第二行 09-16、第三行 17-20。
- 重写 SVG 路径为三段教学推进路径，并用浅色横向 lane 辅助分区。
- 保留 `routeNodeCardMode = "explain" / "training"` 的两段式交互：浏览态只显示环节说明，点击“进入本环节设计”后才显示 A-F 方案区。
- 优化阶段卡、环节点、右侧环节说明卡和地图模块标题样式，保持 Pharmacopilot 暖米色、焦橙、sage、blue-muted 风格。

## 未改动边界

- 未新建 React 页面。
- 未改变 `trainingState`、`completedStepIds`、`currentSelections`、`stepResults` 和 localStorage key。
- 未改动确认本环节、方案选择、多选辅助方案等训练业务逻辑。
