# Change Log

- 暴露 `window.PharmacoPilotStore`，提供 `get/saveAccountSession`、`get/saveCurrentWorkspace`、`get/saveNavigationState`、`get/savePracticeState`、`get/saveAssets`、`addAsset`、`get/saveIntegrationConfig`。
- 将教学导航“开始填写任务单”接入 `openTrainingRouteModal()`，弹窗内支持教师输入、智能体建议区、评价维度区、产物预览、生成本环节产物、保存为教学资产、确认并推进下一环节。
- `saveRouteTaskSheet()` 保存后同步 navigation step state、completedStepIds、currentStepId 和 `trainingReports` 资产。
- settings 重置演示数据现在清空本地账号会话、导航训练、实践流程、资产、泛雅模拟授权和闻道运行记录，同时保留服务配置。
- 闻道空状态统一显示“未配置机构域名”，并引导到 `settings.html`。
- outputs 保存逻辑按输出类型写入 `trainingReports`、`generatedTasks`、`generatedRubrics` 或 `practiceReports`。
- `practice.html` 的旧版泛雅模拟兼容区默认展开，确保列出的必需 id 可直接执行。
