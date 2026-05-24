# Change Log

## 变更

- 在 `前端核心/teaching-navigation-productized.js` 文件末尾追加 `Pharmacopilot · Compact navigation brief and map` IIFE。
- 追加脚本提供顶部地图阶段/步骤激活、步骤变更事件、目标滚动和示例上下文更新方法。
- 未删除或改写已有 JS 逻辑。
- 已将同一 JS 文件同步到本地 `dist`、`dist/launch`、`dist/teaching-navigation` 对应路径，便于当前静态服务读取最新脚本。

## 假设与限制

- 追加脚本与现有 `renderRoute()` 并存；现有业务状态流仍由原模块负责。
- `npm run build:static` 当前仍受工作区既有缺失入口文件影响，未作为本次变更失败判断。
