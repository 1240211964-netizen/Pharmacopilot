# Browser Checks

参考页面：`https://claude.ai/login`

本地静态服务：`http://127.0.0.1:5174/`

## auth.html

- 页面标题：`Pharmacopilot | 登录与注册`
- 主标题 `进入你的药学教学工作台。` 命中：1
- 账号卡片标题 `继续使用 Pharmacopilot` 命中：1
- 快速入口 `继续使用校内账号` 命中：1
- 快速入口 `继续使用 Google Workspace` 命中：1
- SSO 入口 `继续使用 SSO` 命中：1
- `loginForm` 命中：1
- `registerForm` 命中：1
- 登录表单提交后，会话区出现 `已登录`：true
- 注册表单提交后，会话区出现 `王老师`：true
- 注册模式 URL：`http://127.0.0.1:5174/auth.html?mode=register`

结论：登录/注册页可打开，Claude 式账号入口结构已渲染，模式切换、登录、注册和本地会话状态正常。
