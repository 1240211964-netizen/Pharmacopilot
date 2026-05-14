# Checks

## 已执行

- `git diff --check -- 前端核心/styles.css`
- `npm run build`
- 本地静态服务：`python3 -m http.server 5183 -d dist`
- 浏览器打开并核验未登录状态账号区：
  - `index.html`: `登录 / 注册`
  - `teaching-navigation.html`: `登录 / 注册`
  - `practice.html`: `登录 / 注册`
  - `assets.html`: `登录 / 注册`
  - `auth.html`: `登录 / 注册`

## 备注

- 本次浏览器截图接口在本地连接中超时，因此使用页面 DOM 文本核验、CSS 差异核验和构建核验确认变更。
- 修改只集中在共享账号按钮样式，不改变页面结构和登录状态数据。
