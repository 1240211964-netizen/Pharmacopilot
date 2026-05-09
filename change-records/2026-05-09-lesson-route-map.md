# 2026-05-09 lesson-route-map

## 目的
- 基于用户提供的 React 规格稿，继续改造现有静态教学导航页。
- 保持当前纯前端架构，不引入 React/Tailwind/framer-motion 依赖。
- 强化页面定位：以《管理学原理》中的 SWOT 分析为例，帮助新教师从零设计一节课。

## 修改前备份
- change-records/backups/2026-05-09-lesson-route-map/

## 计划修改文件
- 前端核心/teaching-navigation.html
- 前端核心/app.js
- 前端核心/styles.css

## 已记录变更
- `前端核心/teaching-navigation.html`
  - 更新缓存版本号为 `lesson-route-map-20260509`。
  - 将 Hero 叙事收束为：以《管理学原理》中的 SWOT 分析为例，帮助新教师从零设计一节可实施、可评价、可复盘的课。
  - 为地图区增加课程设计地图标识、动态 SVG 挂载点和节点状态统计容器。
- `前端核心/app.js`
  - 迁移用户提供规格稿中的 20 个路线节点坐标，形成更清晰的从左下到右上的路径。
  - 新增 `getRouteSegmentPath()` 与 `renderRouteMapPaths()`，路线改为按节点数据分段渲染，不再依赖单条静态 path。
  - 新增地图状态统计渲染：已完成、进行中、可进入、待解锁。
  - 当前阶段文案改为当前节点焦点，例如“案例入口与课堂导入”。
  - 复盘区百分比改为基于当前节点状态计算。
  - 训练弹窗增加“开始填写任务单”和“先返回地图”操作。
- `前端核心/styles.css`
  - 增加课程设计地图标识、分段路线、地图统计卡、弹窗操作区样式。
  - 调整移动端地图高度和节点纵向排列，避免标题、节点和状态统计互相遮挡。
- `dist/`
  - 通过 `npm run build:static` 与 `npm run build` 同步生成。

## 验证
- `node --check 前端核心/app.js` 通过。
- 禁用文案扫描通过：源文件无命中。
- `npm run build:static` 通过。
- `npm run build:server` 通过。
- `npm run build` 通过。
- `node --check dist/app.js && node --check dist/launch/app.js` 通过。
- 构建后禁用文案扫描通过：`dist/` 与源文件无命中。
- 本地服务 `PORT=5184 npm start` 通过，页面地址：`http://localhost:5184/teaching-navigation`。
- 浏览器烟测通过：
  - 桌面端 H1 为“新教师三步上手路径”。
  - 当前阶段为“案例入口与课堂导入”。
  - 20 个节点、19 条分段路线、4 个状态统计正常渲染。
  - 点击节点 10 后，详情面板切换为“SWOT 矩阵搭建”。
  - “进入训练”弹窗可打开并关闭。
  - 移动端 SVG 路线隐藏，20 个节点保留，页面宽度不溢出。
- 视觉检查截图：
  - `change-records/2026-05-09-lesson-route-map-desktop.png`
  - `change-records/2026-05-09-lesson-route-map-mobile.png`
