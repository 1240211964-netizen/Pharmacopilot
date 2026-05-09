# Pharmacopilot Next.js API

## Run

1. Apply `supabase/schema.sql` in Supabase SQL editor.
2. Copy `.env.example` to `.env` and fill `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `OPENAI_API_KEY`.
3. For local smoke tests without an LLM key, set `AI_PROVIDER=mock`.
4. Run `npm run dev`.

## Endpoints

All routes return either `{ "ok": true, "data": ... }` or:

```json
{
  "ok": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Request validation failed.",
    "details": []
  }
}
```

Every endpoint validates `userId` and `courseId` against `users`, `courses`, and `course_members`.

- `POST /api/generate/lesson-plan` saves structured output to `lesson_runs`.
- `POST /api/generate/rubric` saves structured output to `assets`.
- `POST /api/generate/asset-summary` saves structured output to `assets`.
- `POST /api/files/upload` saves the file to Supabase Storage and a row to `files`; parsing and embedding are marked `pending`.
- `POST /api/knowledge/source-boundary` saves structured output to `lesson_runs`.
- `GET /api/assets?userId=...&courseId=...`
- `POST /api/assets`
- `GET /api/lesson-runs?userId=...&courseId=...`

## Example

```bash
curl -X POST http://localhost:3000/api/generate/lesson-plan \
  -H 'content-type: application/json' \
  -d '{
    "userId": "00000000-0000-0000-0000-000000000001",
    "courseId": "00000000-0000-0000-0000-000000000002",
    "topic": "药品供应链中的库存管理",
    "durationMinutes": 90,
    "learningObjectives": ["解释库存管理核心概念", "分析药品短缺情境中的管理决策"]
  }'
```
