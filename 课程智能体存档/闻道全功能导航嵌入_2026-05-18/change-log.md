# 改动记录

## 代码改动

- 扩展 `src/lib/wenda.ts`：
  - `agentId` 改为按页面类型条件必填。
  - 增加 `selectAgentId`、DeepResearch 参数、检索源、模板 ID 等 Word 文档中出现的参数。
  - 增加各 route 默认 `hd`：如 `home=0,1,1`、`search_history=1,1,1`、`deep_research_history=0,1,1`。
  - 保留普通对话页和厚道对话页的 agent/model/searchText 校验。
- 重写 `src/components/integrations/WendaEmbedWorkspace.tsx`：
  - 左侧新增“问道 / 求索”分组导航。
  - 接入科学探索、对话页面、AI研究员、学术追踪、AI知识库、AI应用、AI引证网络、知识星链、课题/任务、DeepResearch、厚道对话、历史记录。
  - 右侧 iframe 根据当前导航项切换 URL。
  - 新窗口打开和刷新按钮保留。
- 更新 `前端核心/styles.css`：
  - 将原参数面板改成左侧导航栏样式。
  - 右侧 iframe 工作区改为独立内容区域。
  - 增加移动端堆叠与导航自适应。
- 重新生成 `前端核心/wenda-embed-workspace.js`。

## 留痕内容

- `before/`：保存修改前相关源码、样式、构建产物和配置脚本。
- `after/`：保存修改后相关源码、样式、构建产物和截图。
- `after/wenda-full-navigation.png`：左侧导航 + 右侧嵌入界面的浏览器截图。
