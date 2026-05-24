# 修改日志

## 变更内容

- 将教学导航页顶部旧 `nav-intro` 介绍区、右侧 `context-strip` 课程信息卡、以及 `flow-strip` / `route-panel` 阶段地图替换为用户指定的 `pp-nav-brief` 与 `pp-map-nav` 结构。
- 新增 `pp-nav-brief` / `pp-nav-example` / `pp-map-nav` / `pp-map-stage` / `pp-map-step` 样式，延续当前页面暖纸质、克制专业的视觉方向。
- 将 `teaching-navigation-productized.js` 的阶段与环节导航绑定改到新静态按钮上，支持阶段跳转、10 个环节跳转、活动状态同步和已保存状态标记。
- 更新 `scripts/verify-navigation-focus-v3.cjs`，改为检查新 brief、示例卡、三阶段按钮和 10 环节地图。

## 范围说明

- 保留 `focus-workbench` 以下的当前教学导航工作台主体。
- 未改动课程导航契约、知识定位实验、产物生成、资产保存等业务流程。
