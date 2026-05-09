# 2026-05-09 map-proportion-fix

## 目的
- 修复 `teaching-navigation.html` 中路线地图被右侧测评工作台内容拉伸、压缩和失真的问题。
- 保持上轮路线节点与 20 环节测评系统合流逻辑不变。

## 修改前备份
- `change-records/backups/2026-05-09-map-proportion-fix/`

## 修改文件
- `前端核心/styles.css`
- `前端核心/teaching-navigation.html`

## 变更记录
- 调整 `.route-map-layout` 为左侧地图优先的固定比例布局：桌面端使用 `minmax(760px, 1fr)` 承载地图，右侧测评面板限制在 `400px-460px`。
- 将 `.route-map-card` 改为固定高度区间 `clamp(560px, 43vw, 660px)`，避免被右侧长内容拉伸。
- 将 `.route-detail-card` 改为与地图等高并内部滚动，避免右侧测评内容改变地图画布比例。
- 为右侧面板补充滚动条样式，保持轻量视觉反馈。
- 在 1120px 以下恢复单列布局，右侧面板取消固定高度和内部滚动；在 760px 以下将地图高度设为 1250px，保证节点纵向排布不拥挤。
- 更新 `teaching-navigation.html` 静态资源版本号为 `map-proportion-fix-20260509`，避免浏览器缓存旧样式。

## 验证
- `node --check 前端核心/app.js` 通过。
- `npm run build:static` 通过。
- `npm run build:server` 通过。
- `npm run build` 通过。
- `node --check dist/app.js && node --check dist/launch/app.js` 通过。
- 桌面浏览器烟测：`teaching-navigation.html` 无 console error，地图尺寸约 `832 x 619`，右侧面板尺寸约 `460 x 619` 且内部滚动正常。
- 移动端烟测：视口 `390 x 844` 下无横向溢出，地图保持单列可浏览。

## 视觉截图
- `change-records/2026-05-09-map-proportion-fix-desktop.png`
- `change-records/2026-05-09-map-proportion-fix-desktop-after-wait.png`
- `change-records/2026-05-09-map-proportion-fix-mobile.png`
