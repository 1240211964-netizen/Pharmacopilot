# Change Log

- 将首页首屏从登录入口改为“药学管理课程备课任务交给教学智能体”的产品叙事。
- 新增首屏轻量 Agent 工作台，展示 Prompt、课程附件、执行日志、Agent Activity 和 Output Preview。
- 将“三个核心功能”替换为“教师日常教学任务工作台”，提供 5 个可切换任务。
- 在 `initHomePage()` 中追加首页任务 tab 切换逻辑，未触碰 20 环节训练状态机、后端 API 或泛雅业务逻辑。
- 新增样式限定在 `body[data-page="home"]` 下；没有加入 Scheduled、插件体系、手机派发等过度承诺模块。

- 移动端将首屏能力概览压缩为一行小指标，保证 390px 宽度下 Agent 工作台在首屏内可见。
