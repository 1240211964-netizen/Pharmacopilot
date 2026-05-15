# Prompt

用户要求对当前 PharmacoPilot 仓库做一次工程结构重构，将“静态页面 + 简单生成接口”升级为 clean-room 的 OpenMAIC 式 pipeline + scene runtime 架构。

约束：
- 不复制 OpenMAIC 源码，仅学习 generation pipeline、scene runtime、orchestration、action engine、export manifest 等工程抽象。
- 保持当前技术栈：静态前端 + 后端核心 TypeScript + 自定义 Node server，不改为 Next.js。
- 不破坏现有页面、构建脚本和 API。
- 优先完成工程骨架与数据契约，前端只新增最小 runtime 测试入口。
- 提交信息使用：`refactor: introduce teaching scene runtime pipeline`。

核心目标链路：

`Course Input -> Course Outline -> 20 Teaching Steps -> Teaching Scenes -> Agent Orchestration -> Scene Runtime -> Teaching Actions -> Evidence Rules -> Asset Pack -> Export Manifest`
