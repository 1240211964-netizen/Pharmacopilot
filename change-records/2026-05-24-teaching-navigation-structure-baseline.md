# 教学导航结构基准融合

## 目标

以上一轮提供的教学导航预览结构为基准，在当前 `teaching-navigation` 专用静态 bundle 内做窄范围融合，不新建脱离项目的独立 HTML。

## 修改

- 首屏说明区增加 `intro-card`，文案明确“环节地图保留为本页核心导航”。
- 阶段卡片改为展示课前、课中、课后三阶段标题、说明和阶段产物进度。
- 10 个任务站地图补充短标签：定位、学情、目标、内容、案例、时间、探究、反馈、评价、复盘。
- 判断题选项补回短说明；系统反馈仍只在教师选择后出现。
- `本站依据` 折叠区增加具体支持工具名：导学问题、判断流程卡、案例阅读提示、证据提取模板、概念边界卡、分层帮助卡、课堂任务单、示例与反例、追问提示等。
- 移除前台脚本中的“支架”可见术语，课堂时间线改用“导学”，并补入“导学支持线”“需帮助卡”术语。
- 同步 `dist/`、`dist/launch/`、`dist/teaching-navigation/` 三处教学导航预览镜像。

## 验证

- `node --check 前端核心/teaching-navigation-productized.js`：通过。
- `node --check scripts/verify-navigation-focus-v3.cjs`：通过。
- `node scripts/verify-navigation-focus-v3.cjs`：通过。
- `npm run verify:unified-style`：通过。
- `npm run verify:teaching-terminology`：通过。
- `npm run build:server`：通过。
- `git diff --check -- ...`：通过。
- Browser：`http://[::1]:5173/teaching-navigation.html` 干净状态下确认 10 个任务站、选项短说明、支持工具、无横向溢出；选择判断后显示反馈；点击生成后产物抽屉打开且五段产物结构完整；保存按钮解锁，下一站按钮仍要求先保存资产。

## 归档

本轮 after 文件已归档到：

`课程智能体存档/教学导航结构基准融合_2026-05-24/after/`

## 已知限制

- 本轮只融合教学导航结构与前台术语，不改 `teaching-navigation-contract.js` 的 10 站契约内容。
- 未运行完整 `npm run build:static`，因为当前工作区已有旧兼容入口缺失会导致该命令失败；本轮采用定向 dist 同步与页面级验证。
