# 修改记录

- 从 `teaching-navigation-v3-generalized-patch-final.zip` 解包并覆盖 `前端核心/teaching-navigation.html`、`前端核心/teaching-navigation-productized.css`、`前端核心/teaching-navigation-productized.js`。
- 保留第 1 站“教学定位模拟器”。
- 第 2-10 站切换为统一模拟器结构：`01 看证据`、`02 做判断`、`03 生成产物`。
- 第 2-10 站标题分别为：
  - `02 学情诊断模拟器`
  - `03 目标证据生成器`
  - `04 内容问题链生成器`
  - `05 案例证据筛选器`
  - `06 课堂时间编排器`
  - `07 探究任务组织器`
  - `08 即时反馈触发器`
  - `09 评价量规校准器`
  - `10 复盘资产沉淀器`
- 对 zip 内 JS 的一处尾随空白做了非行为性清理，使 `git diff --check` 通过。
- 为本地预览同步了教学导航三文件到 `dist` 对应镜像路径；未修改受限源码文件。
