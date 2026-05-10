# Browser Checks

本地静态服务：`http://127.0.0.1:5174/`

## Desktop / index.html

- 页面标题：`Pharmacopilot | 首页`
- 品牌 `Pharmacopilot` 命中：1
- 首页 active 导航命中：1
- 顶部导航链接数量：4
- 登录按钮命中：1
- 注册按钮命中：1
- 旧版首页主标题仍命中：1

## Mobile / index.html

- 390x844 视口下菜单按钮命中：1
- 打开前 `#primaryNav` 可见：false
- 点击菜单后 `#primaryNav` 可见：true
- `body.nav-open` 命中：1
- 移动端菜单内导航链接数量：4

## Route Regression

- `/teaching-navigation.html`：`Pharmacopilot | 教学导航`
- `/practice.html`：`Pharmacopilot | 教学实践`
- `/assets.html`：`Pharmacopilot | 教学资产`
