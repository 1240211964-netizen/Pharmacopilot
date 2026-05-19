# Prompt

用户要求继续完善 PharmacoPilot，只补 V1 产品闭环关键缺口，不做视觉美化。

本轮重点：
- 新增或确认 dashboard.html、settings.html、outputs.html 可用。
- practice.html 必须保留并可执行 app.js 中既有泛雅模拟、任务生成、复制、下载、保存逻辑所需 id。
- teaching-navigation.html / app.js 中“开始填写任务单”和 openTrainingRouteModal 必须改为真实任务单，而不是 toast 或跳转空流程。
- 暴露 window.PharmacoPilotStore，统一 accountSession、workspace、navigation、practice、assets、integrationConfig 读写。
- 闻道未配置必须明确显示“未配置机构域名”，泛雅不得暗示真实写回。
