# 验证记录

## 已执行

- `node --check 前端核心/teaching-navigation-productized.js`
  - 结果：通过。
- `git diff --check -- 前端核心/teaching-navigation-productized.js 前端核心/teaching-navigation-productized.css 课程智能体存档/教学导航图表证据化优化_2026-05-21`
  - 结果：通过。
- 本地静态服务：`python3 -m http.server 5191 --bind 127.0.0.1`
  - 页面：`http://127.0.0.1:5191/teaching-navigation.html`
  - 默认桌面视口 DOM 检查：通过。
  - 390px 移动视口 DOM 检查：通过。

## 浏览器烟测要点

- 教学导航页能加载，`body[data-page="teaching-navigation"]` 正确。
- 默认第 02 环节渲染 4 张证据卡、3 个 SVG 图表。
- 第 02 环节可见阈值标签：
  - `60 分进入支架线`
  - `70% 可推进线`
- 切换到第 03 环节后渲染：
  - `Bloom × 学生产出矩阵`
  - `目标—产出—评价证据`
  - `学情障碍继承`
  - `高阶目标比例`
- 第 03 环节能渲染 1 个热图图例和 `及格线 60%` 环形图标记。
- 桌面和 390px 移动视口未检测到 `.visual-card`、`.viz-body`、`svg.chart-svg`、`.chart-panel` 容器溢出。

## 已知限制

- `npm run build:static` 当前失败，原因是当前工作区已有缺失文件仍被构建脚本引用：
  - `前端核心/dashboard.html`
  - `前端核心/navigation.html`
  - `前端核心/interface-review-improved.html`
- 浏览器截图接口连续在 `Page.captureScreenshot` 阶段超时；本轮以 DOM、布局尺寸和交互状态检查替代截图验证。
