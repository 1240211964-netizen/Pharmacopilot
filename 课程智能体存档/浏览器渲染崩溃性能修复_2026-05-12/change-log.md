# 浏览器渲染崩溃性能修复

## 修改文件

- `前端核心/app.js`
  - 新增 `prefersReducedMotion()`，在页面初始化时同步系统减少动态效果偏好。
  - 为旧版资产 Canvas 图谱补充 `disposeAssetGraphState()`，取消 `requestAnimationFrame`、移除 `resize` 监听并释放状态。
  - 将教学资产关系图渲染改为 `requestAnimationFrame` 调度，避免筛选、搜索连续触发时同步重绘。
  - 将工作流 SVG 拖拽时的边线重绘改为帧级节流，并在拖拽结束时补一次最终绘制。
  - 工作流页不再为每条边生成流动动画路径，仅保留运行、选中或回流边的流线，降低 SVG DOM 和动画数量。
  - 增加 `pagehide` 清理，离开页面时释放待执行动画帧和定时器。
- `前端核心/styles.css`
  - 追加 Chrome renderer safety layer，保留布局和色彩风格，统一关闭 `backdrop-filter`。
  - 降级大面积阴影，关闭首页、路线节点、工作流节点、工作流流线等无限动画。
  - 关闭高风险 `filter`/`drop-shadow` 场景，并补充 JS 检测到的 `prefers-reduced-motion` 兜底规则。

## 排查结论

- React 入口 `API版的后端/app/page.tsx` 只是静态说明页，未发现 `useEffect`、`useState`、`setState` 循环风险。
- 当前依赖中没有 `framer-motion`，源码也未发现 `repeat: Infinity`、`whileHover`、`layout` 动画用法。
- 前端目录未发现背景视频、大图、Three.js 或 WebGL 资源。
- 高风险主要来自静态前端的无限 CSS 动画、旧 Canvas 图谱动画清理缺失、工作流 SVG 大量持续流线动画，以及拖拽时同步重绘整张 SVG。
