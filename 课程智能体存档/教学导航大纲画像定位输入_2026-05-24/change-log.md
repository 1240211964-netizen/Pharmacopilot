# Change Log

## 修改范围

- `前端核心/teaching-navigation-productized.js`
- `scripts/verify-navigation-focus-v3.cjs`
- `课程智能体存档/教学导航大纲画像定位输入_2026-05-24/after/`
- `change-records/2026-05-24-navigation-syllabus-profile-positioning.md`

## 关键调整

- 新增 `syllabusMock` 与 `currentSyllabus()`，第 1 站读取大纲上游输入状态。
- 新增 `learnerProfiles` 与对象式 `positioningModes`，按班级画像推荐定位。
- 生成逻辑保留 `canGenerateArtifact()` 的任意选择可生成行为。
- 第 1 站产物文本加入大纲目标、班级画像、系统推荐与补偿提示。
- 顶部输入来源 chips 显示大纲 mock / 已载入状态，避免把页面改成大纲正文阅读页。

## 已知限制

- 未实现真实 PDF / DOCX 解析。
- `npm run build:static` 被当前工作区已缺失的旧 HTML 入口阻断；本次未处理构建脚本与旧入口清理问题。
- 工作区接手前已有大量未提交变更，本归档保存 after 快照，不回滚既有改动。
