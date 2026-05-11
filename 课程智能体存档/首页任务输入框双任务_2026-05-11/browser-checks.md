# Browser Checks

## Local static server
- Server: `python3 -m http.server 4178 --bind 127.0.0.1` from `dist/`.

## 首页任务输入框
- `/index.html` 可打开。
- `#homeTaskEntryForm` 中快捷任务 chip 数量为 2。
- 可见 chip 为“生成教学实践”和“整理教学资产”。
- 输入框区域不再出现“生成教学导航”快捷任务。
- 辅助说明为“系统会按任务进入教学实践或教学资产”。

## 跳转逻辑
- 输入“帮我生成一份 SWOT 分析课的教学导航”后，默认跳转到 `/practice.html?from=home-task`。
- 输入“帮我整理教学资产和反馈模板”后，跳转到 `/assets.html?from=home-task`。
- 输入“帮我设计课堂活动和随堂测验”后，跳转到 `/practice.html?from=home-task`。

## 移动端
- 390px 宽度下，首页任务输入框可见。
- 两个快捷任务 chip 无明显横向溢出或重叠。
