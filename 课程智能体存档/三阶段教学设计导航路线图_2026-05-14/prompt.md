用户要求：

将当前教学导航页改成“三阶段高校教师教学设计导航路线图”。

关键要求：
- 保留路线图结构。
- 移除“地铁图、站点、轨道、线路”等交通隐喻。
- 统一使用“教学设计路线图 / 环节 / 当前环节 / 教学推进路径 / 环节说明”。
- 保留现有 trainingState、localStorage、A-F 方案选择、确认本环节、routeNodeCardMode、renderNodeDetailPanel 等业务逻辑。
- 只在现有 `teaching-navigation.html`、`app.js`、`styles.css` 中就地修改页面源码。
