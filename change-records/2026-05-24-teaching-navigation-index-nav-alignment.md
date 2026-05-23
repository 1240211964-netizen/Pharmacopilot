# 教学导航导航栏对齐首页

## 目标

将 `teaching-navigation.html` 的顶部导航栏继续向 `index.html` 对齐，避免教学导航页因专用静态 bundle 产生独立导航样式。

## 修改

- 将教学导航页 header 从 `site-header app-header` 改为与首页一致的 `site-header`。
- 在 `teaching-navigation-productized.js` 中增加 `sharedNavItems` 与 `renderSharedPrimaryNav()`，按首页同一组导航项渲染 `primaryNav`。
- 将教学导航页专用导航 CSS 改为首页同款胶囊 topbar、导航胶囊、账号操作区、移动端固定下拉菜单。
- 同步 `dist/`、`dist/launch/`、`dist/teaching-navigation/` 的教学导航预览镜像。
- 更新 `verify-navigation-focus-v3.cjs`，校验 `site-header` 标记、共享导航渲染函数和不再使用 `app-header`。

## 验证

- `node --check 前端核心/teaching-navigation-productized.js`：通过。
- `node --check scripts/verify-navigation-focus-v3.cjs`：通过。
- `node scripts/verify-navigation-focus-v3.cjs`：通过。
- `npm run verify:unified-style`：通过。
- `npm run verify:teaching-terminology`：通过。
- `npm run build:server`：通过。
- `git diff --check -- ...`：通过。
- Browser 对比 `http://[::1]:5173/index.html` 与 `http://[::1]:5173/teaching-navigation.html`：两页均为 `site-header`，5 个导航链接一致，topbar 宽 1248、高 68、圆角 999px，nav 背景/高度一致，无横向溢出；教学导航页 active 项为“教学导航”。
