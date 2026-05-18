# 检查记录

执行时间：2026-05-18

## Word 文件读取

- 读取文件：`/Users/yandilei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/wxid_78typq1d2g0611_14e8/temp/drag/学术服务平台内嵌页面.docx`
- 确认页面类型：对话页面、知识星链、学术追踪、课题页面、AI知识库、闻道首页、历史记录、DeepResearch、AI应用、厚道对话、AI研究员、AI引证网络。

## 命令检查

- `npm run typecheck`：通过。
- `VITE_WENDAO_DOMAIN=cpu.libsp.net npm run build:wenda`：通过。
- `VITE_WENDAO_DOMAIN=cpu.libsp.net npm run build:static`：通过。
- `git diff --check`：通过。

## 浏览器检查

- 使用本地静态服务访问 `http://localhost:5191/teaching-data.html#wendaEmbedWorkspaceRoot`。
- 截图保存到 `after/wenda-full-navigation.png`。
- DOM 检查确认默认 iframe URL 为 `https://cpu.libsp.net/api/openAccess/redirect/home?hd=0%2C1%2C1&select_agent_id=...`。
- DOM 检查确认导航中包含 `AI引证网络`、`DeepResearch` 等入口。

## 说明

iframe 是否最终展示远端页面仍受闻道平台自身 `X-Frame-Options` 或 CSP `frame-ancestors` 限制；当前实现保留“新窗口打开”作为兜底入口。
