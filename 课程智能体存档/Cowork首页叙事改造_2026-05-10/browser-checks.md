# Browser Checks

本地静态服务：`http://127.0.0.1:5174/`

## Desktop / index.html

- 页面标题：`Pharmacopilot | 首页`
- 首屏标题命中：1
- `Prompt` 命中：1
- `Attachments` 命中：1
- `Agent Activity` 命中：1
- `Output Preview` 命中：1
- `教师日常教学任务工作台` 命中：1
- `7个核心环节` 命中：0
- `practice.html#fanyaAuthForm` 登录/注册链接命中：3

## Task Switch

- 点击 `配置评价量规` 后，预览区输出 `评价量规、低分维度诊断、教师反馈建议。` 命中：1
- 活跃任务 tab 数量：1

## Mobile / index.html

- 390x844 视口下首屏标题命中：1
- `Pharmacopilot Cowork` 命中：1
- `教师日常教学任务工作台` 命中：1
- `智能体执行任务，教师保留关键判断` 命中：1
- `7个核心环节` 命中：0

## Route Regression

- `/teaching-navigation.html`：`Pharmacopilot | 教学导航`
- `/practice.html`：`Pharmacopilot | 教学实践`
- `/assets.html`：`Pharmacopilot | 教学资产`

说明：截图采集在一次移动端检查中超时，因此以浏览器 DOM 命中和路由标题作为本次烟测记录。
