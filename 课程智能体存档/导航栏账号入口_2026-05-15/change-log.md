# 导航栏账号入口

- 将各页面导航栏右侧统一改为账号入口槽位 `data-account-actions`。
- 未登录时显示 `登录 / 注册`，分别进入 `auth.html?mode=login` 与 `auth.html?mode=register`。
- 新增全局账号区渲染逻辑：读取 `pharmacopilot-account-session`，登录后显示 `欢迎回来，具体用户名`。
- 登录、注册、退出登录后同步刷新导航栏账号区。
- 增加账号欢迎胶囊样式，并补齐首页导航栏下的登录入口样式。
