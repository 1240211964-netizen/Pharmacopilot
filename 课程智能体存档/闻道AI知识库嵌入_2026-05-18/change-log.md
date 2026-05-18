# 改动记录

## 代码改动

- 更新 `src/components/integrations/WendaEmbedWorkspace.tsx`：
  - `buildWorkspaceUrl` 的 route 从 `history` 改为 `ai_knowledge_base`。
  - 不再传入普通对话页使用的 `modelId`、`searchText` 和联网检索状态。
  - 页面标题改为“闻道 AI 知识库内嵌工作区”。
  - 左侧入口改为“AI 知识库”，只保留刷新知识库页面按钮。
  - iframe 标题与新窗口入口改为 AI 知识库语义。
- 重新生成 `前端核心/wenda-embed-workspace.js`。

## 留痕内容

- `before/`：保存修改前相关源码、样式、构建产物和配置脚本。
- `after/`：保存修改后相关源码、样式、构建产物和截图。
- `after/wenda-ai-knowledge-base.png`：AI 知识库内嵌界面截图。
