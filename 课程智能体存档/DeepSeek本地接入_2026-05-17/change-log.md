# DeepSeek 本地接入

日期：2026-05-17

## 变更

- `.env` 本地写入 `DEEPSEEK_API_KEY`、`DEEPSEEK_BASE_URL`、`DEEPSEEK_MODEL`，文件权限设为 `600`；`.env` 已由 `.gitignore` 忽略。
- `后端核心/src/config.ts` 支持 `DEEPSEEK_API_KEY` 自动切换 chat model 到 `deepseek-chat`，并支持 `OPENAI_BASE_URL` / `DEEPSEEK_BASE_URL`。
- `OpenAiConfig` 增加 chat baseURL 与 embedding 独立 key/baseURL 字段。
- `generation.ts` 与 `agent/runner.ts` 初始化 OpenAI SDK 时传入可配置 `baseURL`，并设置合理 `max_tokens`。
- `rag.ts` 改为只使用 `OPENAI_EMBEDDING_API_KEY` 或 `OPENAI_API_KEY` 做 embedding，避免 DeepSeek chat key 被用于 OpenAI embedding。
- `.env.example` 增加 DeepSeek 与 embedding 独立配置占位。
- agent JSON 提示词补充小写 `json`，符合 DeepSeek JSON Output 要求。
- Director 增加保护：rubric-agent 已标记证据缺口后转交 evidence-agent，避免重复调度 rubric-agent。

## 安全边界

- 未提交真实 API key。
- 留痕 prompt 使用 `[redacted]`。
- 当前真实 key 只存在本地 `.env`。
