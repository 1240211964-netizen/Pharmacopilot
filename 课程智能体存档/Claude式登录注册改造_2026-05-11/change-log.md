# 修改日志

## 计划

- 归档修改前 `auth.html`、`index.html`、`app.js`、`styles.css`、`package.json`、`后端核心/src/http-utils.ts`。
- 记录改造前检查结果。
- 参考 Claude 登录页的信息层级：短价值标题、账号入口卡片、Google/Email/SSO 式入口、隐私/边界说明。
- 将设计转译为 Pharmacopilot 的高校药学教学账号入口，不复制 Claude 品牌或文案。
- 保留本地账号会话逻辑，不新增真实后端认证。
- 运行改造后检查、浏览器烟测，归档 after 代码并推送 GitHub。

## 结果

- 已将 `前端核心/auth.html` 改为 Claude 式低噪声账号入口：左侧短价值主张，右侧继续方式、邮箱登录/注册、SSO 占位和轻量边界说明。
- 已新增校内账号、Google Workspace、SSO 三个快速入口的本地提示逻辑，不触发真实外部认证。
- 已保留本地账号会话逻辑和既有 `loginForm`、`registerForm`、`authStatusPanel`、`data-auth-mode` 绑定。
- 已重写 `body[data-page="auth"]` 相关样式，使页面更接近 Claude 的暖白、细边框、克制卡片和短表单结构。
- 修改后检查均通过：`node --check 前端核心/app.js`、`npm run build:static`、`npm run build:server`。
- 已用本地浏览器验证 `/auth.html?mode=login`：登录、注册、模式切换和本地会话状态正常。
- 已归档修改前后代码、prompt、修改日志和检查记录。
