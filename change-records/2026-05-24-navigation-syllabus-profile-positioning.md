# 教学导航大纲画像定位输入

时间：2026-05-24 14:58 CST

## 变更

- 在第 1 站加入课程大纲 mock 上游输入状态，只保存 `loaded` 与 `fileName`，不展示大纲全文。
- 将班级画像收敛为 `均衡班级 / 考研占优 / 实习就业占优 / 考公监管占优` 四类，并对应推荐定位。
- 将第 1 站定位选项调整为 `综合决策型 / 证据研究型 / 服务运营型 / 政策治理型` 四类。
- 第 1 站任意定位被选择后均可生成产物，反馈区区分“定位匹配”和“可用，但需补偿”。
- 顶部输入来源 chips 同步显示课程、大纲 mock、课程目标、班级画像和推荐定位。
- 更新 `scripts/verify-navigation-focus-v3.cjs`，覆盖新版大纲、画像、定位与导入状态约束。

## 验证

- `node --check 前端核心/teaching-navigation-productized.js` 通过。
- `node scripts/verify-navigation-focus-v3.cjs` 通过。
- `npm run build:server` 通过。
- 浏览器访问 `http://127.0.0.1:5173/teaching-navigation.html`，选择非推荐的“证据研究型定位”后出现“可用，但需补偿”，生成产物包含 mock 大纲输入、课程目标、画像判断、教师判断与补偿提示。
- `npm run build:static` 未通过：当前工作区已缺失 `前端核心/dashboard.html`、`settings.html`、`outputs.html`、`navigation.html`、`interface-review-improved.html`，但构建脚本仍复制这些旧入口。

## 说明

本次只改教学导航前台逻辑和对应验证脚本，不接入真实 PDF / DOCX 解析，不改变四页产品骨架。
