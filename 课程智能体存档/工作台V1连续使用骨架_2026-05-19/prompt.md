用户要求接手 PharmacoPilot 项目，不继续局部美化页面，而是完成可连续使用的 V1 课程智能体工作台骨架：

- 保留首页、登录、教学导航、教学实践、教学数据的产品逻辑。
- 新增登录后的 Dashboard、配置服务页、输出汇总页。
- 保留教学导航 20 环节三阶段结构，不改成 20 个独立智能体。
- 教学导航节点需能填写任务单并保存为教学资产。
- 教学实践需读取当前课程和导航产物，生成课堂任务、评价量规、最终实践方案，并明确泛雅只支持复制和新窗口打开。
- 教学数据页需读取真实保存产物，SWOT 只作为“计划与决策”模块示例节点。
- 统一 client-side store，先基于 localStorage，但结构包含 accountSession、currentWorkspace、courseMaterials、navigationStepStates、practiceRuns、teachingAssets、integrationConfig、agentRuns。
- 闻道和泛雅必须有未配置、模拟中、新窗口打开、后端代理未启用等清楚边界。
