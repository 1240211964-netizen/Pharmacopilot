# Change Log

- `前端核心/practice.html`
  - 将右侧 `当前状态` 卡片替换为 `推荐学情分析 Prompt` 卡片。
  - 移除右侧可见的课程 ID、班级 ID、平台页面、显示方式等元信息。
  - 新增 `#chaoxingLearningPromptText` 和 `#copyChaoxingLearningPrompt`。

- `前端核心/app.js`
  - 新增 `buildChaoxingLearningAnalysisPrompt()`，基于当前 STEP 和泛雅模拟课程数据生成学情分析 Prompt。
  - 新增 `updateChaoxingLearningPrompt()`，在 STEP 选择、模拟授权、课程选择时同步右侧 Prompt。
  - 复制按钮会复制当前推荐 Prompt。

- `前端核心/styles.css`
  - 新增右侧 Prompt 面板、Prompt 文本区和复制按钮样式。
