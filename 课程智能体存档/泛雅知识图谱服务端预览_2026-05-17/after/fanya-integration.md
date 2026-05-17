# 超星泛雅真实接入说明

这个项目已经从纯前端页面升级为“前端页面 + 本地后端 Connector”。前端不再直接保存密钥，所有超星泛雅请求都通过 `后端核心/启动入口/server.cjs` 转发。

## 当前已实现

- 前端教学实践页提供“测试账号模式”：使用内置测试账号和假 token，把模拟登录、课程选择、20 环节实践、复制发布稿、保存教学资产流程先跑通。
- `GET /api/fanya/status`：检查本地 Connector 配置是否完整。
- `POST /api/fanya/connect`：使用学校提供的接口进行真实连通性验证。
- `GET /api/fanya/courses`：读取课程列表或课程数据。
- `POST /api/fanya/sync-assignment`：把网站生成或教师确认后的作业/任务同步到泛雅指定课程。
- `GET /api/fanya/knowledge-graph/status`：检查泛雅知识图谱服务端预览通道是否可用。
- `GET /api/fanya/knowledge-graph/frame`：在服务端授权配置完整时，向教学数据页提供同源 iframe 预览入口。
- `GET/POST /api/fanya/knowledge-graph/proxy/*`：代理知识图谱页面所需的泛雅静态资源或接口请求。
- 教学数据页提供“泛雅知识图谱面板”：优先尝试服务端预览通道；如果服务器侧 cookie/token 未配置或会话失效，则保留新窗口打开泛雅原站。

## 需要向学校或超星技术支持确认的参数

- 学校授权的 API 网关或开放平台地址。
- 鉴权方式：Bearer Token、应用签名、统一身份认证票据、接口网关密钥，或其他方式。
- 课程列表接口路径、请求参数和响应字段。
- 班级名单接口路径、请求参数和响应字段。
- 作业/任务创建接口路径、请求体字段、附件上传方式。
- 资源上传接口路径和文件大小限制。
- 学习数据或作业结果读取接口路径。
- 是否允许第三方系统写入泛雅课程内容、题库、作业和学习分析数据。
- 是否允许通过学校授权账号或接口网关在本系统内服务端代理预览知识图谱。

## 配置方式

1. 复制 `.env.example` 为 `.env`。
2. 将学校或超星提供的真实参数填入 `.env`。
3. 启动服务：

```bash
npm start
```

4. 打开：

```text
http://localhost:5173
```

## 教学数据页内嵌预览配置

如果希望点击“加载本页预览”后在教学数据页内显示泛雅知识图谱，需要在 `.env` 中启用服务端预览通道：

```bash
FANYA_AUTH_MODE=session-cookie
FANYA_COOKIE=从已授权教师浏览器或学校网关获取的服务端会话
FANYA_KNOWLEDGE_PROXY_ENABLED=true
FANYA_KNOWLEDGE_GRAPH_URL=https://mooc2-ans.chaoxing.com/topic-ans/knowgraph/index.html#/knowledgeMap/frameDiagramTeacher?courseid=251769346&clazzid=131807646
FANYA_KNOWLEDGE_PROXY_HOSTS=mooc2-ans.chaoxing.com
```

这一路径的边界是：前端 iframe 只加载本系统的 `/api/fanya/knowledge-graph/frame`，不会保存或拼接账号、密码、cookie、授权码；实际访问泛雅由后端 Connector 代发。若泛雅会话过期、接口要求验证码/二次认证，或超星侧禁止代理访问，页面会继续提供新窗口打开作为兜底。

## 安全注意

- 不要把 `.env` 发给学生或提交到代码仓库。
- 不要在前端 `app.js` 中写入 token、cookie、app secret。
- 不要在教学数据页 iframe 或跳转链接中拼接真实账号、密码、cookie、授权码。
- 不要把个人浏览器 cookie 放入公开部署环境；生产环境应改用学校授权的接口网关或专用服务账号。
- 当前测试账号模式只保存脱敏账号、模拟会话和数据边界，不保存输入的授权码或真实密码。
- 如果接入学生学习数据，建议由学校信息中心提供接口网关和审计日志。
- 作业、题库、成绩等写入动作应保留教师确认步骤，避免自动覆盖正式课程内容。
