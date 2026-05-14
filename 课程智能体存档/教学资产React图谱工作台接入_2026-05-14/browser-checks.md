# Browser Checks

## After
- 本地预览：`PORT=5184 npm start`，打开 `http://localhost:5184/assets.html`。
- DOM 检查：页面包含“管理学原理课程图谱”“SWOT 分析示例节点”“当前节点概览”“模块边界说明”“课程资产统计 / 质量诊断”“建议动作 / 快捷操作”。
- 点击检查：点击 `SWOT 分析示例节点` 后，当前节点标题、模块边界说明和底部状态条同步更新为 SWOT 示例节点。
- 模块筛选：点击“计划与决策”筛选后，当前选中同步为“计划与决策”，边界说明包含“不把 SWOT 泛化为整门课或整页资产主题”。
- 移动端 CDP 检查：390px 宽度下 `window.innerWidth = 390`，`document.documentElement.scrollWidth = 390`，`document.body.scrollWidth = 390`。
- 移动端图谱区检查：390px 宽度下 `.course-map-stage` left/right 为 30/360，宽度 330，未产生横向溢出。
- Browser 插件截图接口在本机返回 CDP screenshot timeout；已用本机 Chrome headless + CDP 进行截图和布局数值兜底验证。
