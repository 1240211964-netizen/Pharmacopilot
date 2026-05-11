# Browser Checks

## Local static server
- Server: `python3 -m http.server 4177 --bind 127.0.0.1` from `dist/`.

## 首页任务输入框
- `/index.html` 可打开，`#homeTaskEntryForm` 可见，`#homeTaskInput` 唯一。
- 首页主内容未出现 `ChatGPT` / `chatgpt`。
- 首页主内容未出现可见英文 `Rubric`。

## 跳转逻辑
- 输入“帮我生成一份 SWOT 分析课的教学导航”后，跳转到 `/teaching-navigation.html?from=home-task`。
- 输入“帮我整理教学资产和反馈模板”后，跳转到 `/assets.html?from=home-task`。
- 输入“帮我设计课堂活动和随堂测验”后，跳转到 `/practice.html?from=home-task`。

## 移动端
- 390px 宽度下，首页任务输入框可见。
- 输入框、开始生成按钮、三个快捷任务 chip 无明显横向溢出或重叠。
