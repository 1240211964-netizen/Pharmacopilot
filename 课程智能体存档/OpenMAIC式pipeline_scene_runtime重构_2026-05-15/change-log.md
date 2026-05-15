# Change Log

## Backend

- 扩展 `pipeline-types.ts`：新增 `TeachingRuntimeState`、`CourseStage`、`TeachingStep`、`TeacherInterventionPoint`、scene progress、evidence level descriptors、asset source rules、action manifest 和 pipeline summary。
- 将 `course-outline-generator.ts` 改为生成 3 阶段 + 20 教学环节，保留默认课程 `管理学原理 / SWOT 分析 / 药事管理本科生`。
- 将 `teaching-scene-generator.ts` 改为从 `outline.steps` 自动生成 `scene-01` 到 `scene-20`，并额外生成独立 `scene-asset-graph`。
- 将 `teaching-scene-runtime.ts` 升级为 runtime manifest，包含 progress、transitions、takeoverPoints、playbackQueue 和 sceneIndex。
- 将 `teaching-action-engine.ts` 升级为 8 类可追溯 action manifest，包含 inputRefs、outputRefs、sceneIds 和 status。
- 将 `teaching-agents.ts` 升级为 orchestration manifest，补充 agent role、owns、input/output refs、interventionPolicy、failureMode、handoff、responsibilities、approvalPolicy 和 collaborationPattern。
- 将 `evidence-rule-generator.ts` 改为每个 scene 至少一条 evidence rule，并补充四级 levelDescriptors。
- 将 `asset-pack-generator.ts` 改为根据 scenes 和 evidenceRules 映射 sourceScenes/sourceRules。
- 将 `teaching-export-manifest.ts` 升级为 export center 结构，包含 formats、reviewQueue 和 exportOrder。
- `pipeline-runner.ts` 返回完整新版 pipeline result 和 summary。
- `server.ts` 保持既有 API 路由不变，并在子路由返回中附带新版 summary。

## Frontend

- `前端核心/app.js` 新增 `callTeachingPipeline`、`savePipelineResult`、`getPipelineResult`、`renderPipelineRuntimePreview`。
- 首页生成任务继续调用 `/api/generate/pipeline`，并统一保存到 `HOME_PIPELINE_RESULT_KEY`。
- `practice.html` 新增一个轻量 runtime preview 面板。
- `styles.css` 为 runtime preview 增加响应式最小样式。

## Clean-room note

本次只复刻工程抽象和数据契约，没有复制 OpenMAIC 源码。
