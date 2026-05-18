# 本次需求

用户提出“ai知识库，嵌入”。

执行目标：

- 将闻道内嵌入口从普通对话页切换为 AI 知识库页。
- 使用已有 `buildWendaUrl`，route 改为 `ai_knowledge_base`。
- 移除与普通对话不匹配的检索问题、联网检索等前端控件。
- 保留 iframe 内嵌和新窗口打开兜底入口。
- 保持 PharmacoPilot 当前克制、学术、工作台风格。
