# 用户请求

在当前 PharmacoPilot 项目中新增“闻道学术服务平台内嵌工作区”，以 React + TypeScript 组件通过 iframe 接入闻道 openAccess 普通对话页。

要求包括：新增 `buildWendaUrl` 工具函数、新增 `WendaEmbedWorkspace` 组件、页面级集成、不假设闻道 API、不实现上传接口、domain 优先从环境变量读取、保留新窗口打开兜底，并保持 PharmacoPilot 克制、学术、工作台风格。
