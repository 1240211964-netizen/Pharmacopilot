# Change Log

## 目标
把首页“登录 / 注册”从 `practice.html#fanyaAuthForm` 改为独立账号入口，形成真实的登录与注册界面骨架。

## 改动
- 新增 `前端核心/auth.html`：独立登录/注册页，支持 `?mode=login`、`?mode=register`，并提供本地账号会话状态区。
- 修改 `前端核心/index.html`：顶部“登录”指向 `./auth.html?mode=login`，“注册”指向 `./auth.html?mode=register`。
- 修改 `前端核心/app.js`：新增账号本地会话读写、登录提交、注册提交、退出登录和模式切换逻辑；`/register` 路径默认注册模式；同时把首页演示中重新出现的可见英文 `Rubric` 改为中文“评价量规”。
- 修改 `前端核心/styles.css`：新增 `body[data-page="auth"]` 范围内的账号页布局、表单、会话状态和移动端样式；修复 390px 下标题英文品牌词溢出。
- 修改 `package.json`：`build:static` 复制 `auth.html` 到 `dist/` 与 `dist/launch/`。
- 修改 `后端核心/src/http-utils.ts`：新增 `/auth`、`/auth.html`、`/login`、`/register` 及 launch 对应静态路由。
- 保留本轮开始时已经存在的 `teaching-navigation.html` 与 `app.js` 中教学导航节点卡片相关未提交改动，不做回退。

## 边界
- 当前账号会话仅保存在本机浏览器 `localStorage`。
- 本轮不新增后端账号库、不接入学校统一身份认证、不写入真实泛雅平台。
