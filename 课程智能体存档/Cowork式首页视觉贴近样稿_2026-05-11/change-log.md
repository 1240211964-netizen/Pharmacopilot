# Change Log

## Before

- 首页 Cowork 演示位于首屏右侧 aside，空间偏窄，弱化了用户样稿中的大舞台感。
- Tab、Prompt、Attachments、Agent Activity、Output Preview 交互已存在，但视觉比例和排版层级不够接近样稿。

## After

- 将首页首屏调整为“居中产品说明 + 主 CTA + 能力概览 + 三功能 Tab + 大幅 Cowork 演示舞台”的纵向结构。
- 将三功能 Tab 改成浅色分段控件，视觉接近用户提供样稿。
- 将 `homeCoworkStage` 调整为大幅渐变舞台：桌面端为 430px 左侧深色输入区 + 右侧浅色 Output Preview。
- 强化 Prompt、Attachments、Agent Activity 的深色卡片质感，附件改为三列材料卡。
- 右侧 Output Preview 增加“预览 / 编辑”胶囊动作、导航阶段切换条和更强的文档预览层级。
- 保留 `HOME_FEATURE_DEMOS` 数据集中管理和原有 tab/附件交互逻辑。
- 保持导航链接、登录/注册链接、主 CTA 路径不变。

## Files

- `前端核心/index.html`
- `前端核心/app.js`
- `前端核心/styles.css`
- `package.json` unchanged but archived for traceability.
