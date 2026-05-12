# 教学导航聚类轮廓线标记修正计划

## Summary
- 修正上一版理解：不再做“粒子/点云底纹”，改为学习聚类图中的“轮廓线 / 等高线式群组标记”。
- 保留现有 20 个节点坐标、主路线、三阶段叙事、阶段 pill、节点说明态与训练流程。
- 本轮优先 CSS 修正，不改 20 环节数据结构，不新增后端接口。

## Key Changes
- 先创建留痕目录：`课程智能体存档/教学导航聚类轮廓线修正_2026-05-12`；如已存在则加 `_02`。
- 存档 before/after：`前端核心/teaching-navigation.html`、`前端核心/app.js`、`前端核心/styles.css`、`package.json`，并写入 `prompt.md`、`change-log.md`、`before-checks.md`、`after-checks.md`、`browser-checks.md`。
- 在 `styles.css` 中替换上一版 `.route-map-stage-zone::before` 的粒子点云规则：
  - 移除多组小圆点 `radial-gradient(circle ... 1px)`、点云 `background-size`、粒子式分布。
  - 改为每个阶段 2-3 层低透明椭圆轮廓线，类似 UMAP/t-SNE 聚类边界的等高线标记。
  - 三阶段继续使用 terracotta / muted blue / sage 绿，但只作为细轮廓和轻背景，不抢节点。
- 阶段区域保持“轻量聚类轮廓”：
  - 地图内仅保留短标签与轮廓边界。
  - 完整三阶段说明继续放在上方阶段 pill。
  - 轮廓层级低于主路线和节点，不能遮挡节点文字、路线、底部统计和右侧节点卡片。
- 不调整 `routeTrainingNodes.x/y`，不重排路线，不把地图改成真实生信图表，不增加生物学术语。

## Test Plan
- 改造前后运行并写入留痕：
  - `node --check 前端核心/app.js`
  - `npm run build:static`
  - `npm run build:server`
  - `git diff --check`
- 浏览器检查 `teaching-navigation.html`：
  - 地图中不再出现粒子点云效果。
  - 三阶段以低噪音轮廓线呈现，主路线和 20 个节点仍是视觉主角。
  - 三阶段 pill 可点击并定位对应阶段第一个节点。
  - 点击节点后先显示说明态；点击“开始本环节训练”后才进入 A-F、生成、诊断、确认。
  - 桌面、平板、移动端无横向滚动，轮廓线不遮挡节点、统计条和浮层。
- 完成后提交并推送到 `origin main`，commit message：`Refine teaching navigation cluster contour markers`。

## Assumptions
- “聚类图中的轮廓图标记”理解为群组边界/等高线式轮廓，不是粒子点云，也不是给每个节点加图标。
- 本轮只修正视觉底层表达，不改交互逻辑和教学术语。
- 上一版粒子底纹作为 Git 历史保留，本轮用新留痕和新提交覆盖页面当前效果。
