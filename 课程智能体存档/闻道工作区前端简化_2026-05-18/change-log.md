# 改动记录

## 代码改动

- 简化 `src/components/integrations/WendaEmbedWorkspace.tsx`：
  - 移除右侧结果沉淀区、localStorage 草稿保存逻辑和相关状态。
  - 移除 domain、模型、知识库 ID、图片 ID、文件 ID、Explore ID、URL 预览等可见字段。
  - 保留默认智能体配置、检索问题、联网检索开关、刷新按钮和新窗口兜底链接。
  - 清空问题时显示“请先填写检索问题。”，避免出现已隐藏的文件或图片 ID 提示。
- 更新 `前端核心/styles.css`：
  - 闻道工作区从三栏改为两栏布局。
  - 删除已不使用的 `wenda-id-grid`、`wenda-url-preview` 样式。
  - 为锚点跳转增加 `scroll-margin-top`，避免固定导航遮挡标题。
- 重新生成 `前端核心/wenda-embed-workspace.js`。

## 留痕内容

- `before/`：保存修改前相关源码、样式、构建产物和配置脚本。
- `after/`：保存修改后相关源码、样式、构建产物和截图。
- `after/wenda-simplified.png`：本次简化后的浏览器验证截图。
