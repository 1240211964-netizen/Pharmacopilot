# 泛雅知识图谱服务端预览

- 新增后端模块 `后端核心/src/fanya-knowledge.ts`，提供知识图谱状态、同源 iframe 入口和资源代理能力。
- 新增接口：`GET /api/fanya/knowledge-graph/status`、`GET /api/fanya/knowledge-graph/frame`、`GET/POST /api/fanya/knowledge-graph/proxy/*`。
- 扩展 `FanyaConfig`，增加 `FANYA_KNOWLEDGE_PROXY_ENABLED`、`FANYA_KNOWLEDGE_GRAPH_URL`、`FANYA_KNOWLEDGE_PROXY_HOSTS`。
- 教学数据页恢复 iframe 和“加载本页预览”按钮，但默认不自动请求泛雅；只有后端状态显示可预览时按钮才启用。
- 前端初始化会读取后端状态，动态显示“服务端预览可用”或“需配置后端通道”，并继续保留新窗口打开入口。
- 更新 `.env.example` 与 `部署、接入说明/docs/fanya-integration.md`，说明服务端 cookie/token 的配置边界和安全注意。
