# Change Log

## Scope

- 按 `设计规范/` 中的 index 首页设计规范，将 `教学导航 / 教学实践 / 教学数据` 三个页面统一到同一套视觉母版。
- 保留现有四页 IA：`首页 / 教学导航 / 教学实践 / 教学数据`。
- 保留 `教学数据` 页面内部 `data-page="assets"` 和 legacy `assets.html` 构建别名。

## Changed Files

- `前端核心/teaching-navigation.html`
- `前端核心/practice.html`
- `前端核心/teaching-data.html`
- `前端核心/styles.css`
- `设计规范/index首页设计规范.md`
- `设计规范/index-design-tokens.css`
- `设计规范/README.md`
- `设计规范/全站网页设计约束.md`

## Design Updates

- 三页统一品牌区：`PharmacoPilot / 课程智能体`，并沿用 index 页登录/注册按钮样式。
- 三页统一导航顶栏：玻璃白底、细边框、胶囊式激活态、移动端折叠菜单。
- 三页统一页面基调：温暖纸张背景、衬线大标题、棕色主按钮、低饱和信息面板。
- `教学导航`：首屏改成 index 规范下的路线图 hero + 当前进度卡，路线图区域保持可横向浏览的 20 环节画布。
- `教学实践`：保留 Copilot 工作台结构，强化“智能体调度”暗色运行面板，主画布和审校面板改为 artifact 纸张面板。
- `教学数据`：改为“教学数据工作台 / 教学数据图谱”表达，统一图谱工作区和课程资产面板的纸张感。
- 移动端增加宽度、换行和内层容器收缩规则，避免长中文标题、说明文字和卡片右侧裁切。

## Archive

- Before snapshot: `课程智能体存档/三页面设计规范统一_2026-05-17/before/`
- After snapshot: `课程智能体存档/三页面设计规范统一_2026-05-17/after/`
- Browser screenshots: `课程智能体存档/三页面设计规范统一_2026-05-17/browser/`
