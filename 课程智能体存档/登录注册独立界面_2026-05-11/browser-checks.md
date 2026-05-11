# Browser Checks

## Local static server
- Server: `python3 -m http.server 4176 --bind 127.0.0.1` from `dist/`.
- `/index.html` opened successfully.
- 首页顶部“登录”链接为 `./auth.html?mode=login`。
- 首页顶部“注册”链接为 `./auth.html?mode=register`。
- 首页主内容未出现可见英文 `Rubric`。

## Auth page interaction
- `/auth.html?mode=login`：登录表单可见，注册表单隐藏。
- 登录测试：输入 `teacher@example.com` 与测试密码后，状态区显示“已登录”，并显示进入教学导航入口。
- `/auth.html?mode=register`：注册表单可见，登录表单隐藏。
- 注册测试：输入教师姓名、学校/院系、邮箱、密码并勾选说明后，状态区显示“已登录：王老师”，学校/院系信息可见。
- 390px 移动端：账号页可见、首屏标题已换行，无明显横向截断；页面主内容未出现可见英文 `Rubric`。

## Backend static routes
- Server: `PORT=4180 npm start`。
- `/auth`、`/login`、`/register`、`/auth.html` 均返回 `Pharmacopilot | 登录与注册` 且 `main` 可见。
- `/login` 默认登录模式；`/register` 默认注册模式；`/auth.html?mode=register` 默认注册模式。
- `/teaching-navigation.html`、`/practice.html`、`/assets.html` 可打开，`main` 可见。
