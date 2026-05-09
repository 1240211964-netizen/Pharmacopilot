# Pharmacopilot 课程知识库 RAG

## 数据库

先在 Supabase 执行：

```sql
supabase/migrations/202605060001_knowledge_rag.sql
```

迁移会创建：

- `knowledge_files`：上传文件与来源元数据。
- `knowledge_chunks`：800-1200 中文字符切块、embedding、`file_id`、`course_id`、`user_id`、metadata。
- `knowledge_source_boundaries`：用户/课程维度的来源边界记录。
- `match_knowledge_chunks(...)`：基于 pgvector cosine distance 的检索函数。

## 环境变量

复制 `.env.example` 后配置：

```bash
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_EMBEDDING_DIMENSIONS=1536
```

`OPENAI_EMBEDDING_DIMENSIONS` 必须和迁移中的 `vector(1536)` 一致。

## API

- `POST /api/knowledge/upload`
  - `multipart/form-data`
  - fields: `userId`, `courseId`, `sourceBoundary`
  - files: `files`
  - 解析 txt/md/csv/json/html/pdf/docx/pptx/xlsx，切块、embedding 后写入 `knowledge_chunks`。

- `POST /api/knowledge/search`
  - JSON: `userId`, `courseId`, `topic`, `teachingAction`, `sourceBoundary`, `limit`
  - 永远按 `user_id` 过滤；提供 `courseId` 时按课程过滤。

- `POST /api/generate/lesson-plan`
  - 生成教案前先检索相似 chunks，并把片段注入模型上下文。

- `POST /api/generate/rubric`
  - 与教案同一条 RAG 流程，用于 Rubric。

模型输出会返回 `citations`，包含 `refId`、`fileId`、`fileName`、`chunkId`、`chunkIndex` 和引用摘要。

## 来源边界

示例：

```text
仅使用国家医保局官网和我上传的课程 PPT
```

会解析为严格边界：

- 域名：`nhsa.gov.cn`
- 标签：`国家医保局`、`国家医疗保障局`
- 上传文件类型：`PPT`、`PPTX`

检索时只返回匹配这些来源条件的 chunks。系统不会主动抓取官网；官网内容需要先作为带 `source_uri`/`source_label` 的材料入库，或由后续爬取流程写入同一张表。
