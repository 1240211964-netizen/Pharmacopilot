# 修改日志

## 变更范围

- 在 `前端核心/teaching-navigation-productized.js` 中，将第 1 站原来的证据图/判断题分栏替换为 `pp-positioning-lab` 区块。
- 第 1 站的新区块包含 Step 1 证据、Step 2 判断、反馈、定位句产物、后续约束和复制按钮。
- 第 1 站隐藏原有独立 `decisionPanel` 与 `feedbackPanel`，避免同一判断出现两套 UI。
- 选择 B/C 时仅显示调整反馈，产物保持隐藏，生成按钮保持禁用；选择 A 后显示定位句并启用生成/保存。
- 复制按钮成功写入剪贴板时提示“已复制定位句”；如果浏览器不支持写入，则选中定位句并提示手动复制。
- 在 `前端核心/teaching-navigation-productized.css` 中补齐 `pp-positioning-*`、`pp-evidence-*`、`pp-option-*`、`pp-feedback-*` 和 `pp-constraints` 样式，并做移动端单列适配。
- 已手动同步本次触碰的 JS/CSS 到 `dist/`、`dist/launch/`、`dist/teaching-navigation/`。

## 留痕

- 修改前源文件保存在 `before/`。
- 修改后源文件保存在 `after/`。
- 初始工作树状态保存在 `initial-status.txt`。
