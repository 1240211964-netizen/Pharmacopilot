# 教学实践 20 环节平台 AI 嵌入

## 变更时间

2026-05-18

## 用户需求

让教学实践页的 20 个环节都可以嵌入超星课程平台可提供的 AI 实践页面：

`https://mooc2-ans.chaoxing.com/mooc2-ans/mycourse/tch?courseid=251769346&clazzid=131807646&cpi=18085305&enc=399a5e53fc07ceeee1367420f088ffd5&t=1778920097391&pageHeader=-1&v=2&hideHead=0&perspectiveType=平台可以提供的ai实践`

## 变更内容

- 将原 `超星 AI 评价编辑器嵌入试验` 调整为 `20 环节平台 AI 实践嵌入`。
- 把 iframe 地址替换为超星课程 `mycourse/tch` 平台 AI 实践地址。
- 为 20 个教学实践状态节点增加点击和键盘触发能力。
- 点击任意 STEP 后，会选中该环节、更新右侧环节上下文，并把超星平台 AI 实践页写入 iframe。
- 保留 `新窗口打开当前环节` 兜底入口，用于处理第三方登录态、第三方 Cookie 或 iframe 白名单限制。
- 同步更新动态渲染节点，确保 Copilot 运行后重绘的 20 环节节点仍具备嵌入入口。

## 回滚说明

本目录保存了 `before/` 与 `after/` 版本。需要回滚时，恢复 `before/前端核心/` 下的 `practice.html`、`app.js`、`styles.css` 和 `agent-runtime/action-engine.js`。
