import type {
  AgentRunRequest,
  CourseContext,
  DirectorDecision,
  DirectorState,
  TeachingArtifacts,
  TeachingModule,
  TeachingStoreState,
} from "./types";
import type { JsonRecord } from "../types";

interface DirectorInput {
  module: TeachingModule;
  storeState: TeachingStoreState;
  courseContext?: CourseContext;
  artifacts: TeachingArtifacts;
  evidenceLedger: JsonRecord[];
  directorState: DirectorState;
}

export function decideNextAgent(input: DirectorInput): DirectorDecision {
  const courseContext = input.courseContext || input.storeState.courseContext;
  const artifacts = mergeArtifacts(input.storeState.artifacts, input.artifacts);
  const module = input.module || input.storeState.currentModule || "practice";

  if (!hasCourseContext(courseContext)) {
    return {
      nextAgentId: "context-diagnosis-agent",
      shouldEnd: false,
      reason: "缺少 courseContext，需要先诊断课程、班级、主题和来源边界。",
    };
  }

  if (module === "navigation" && !hasNavigationScene(input.storeState, artifacts)) {
    return {
      nextAgentId: "navigation-agent",
      shouldEnd: false,
      reason: "当前模块是教学导航，但还没有 navigation scene 或路径。",
    };
  }

  if (module === "practice" && !hasPracticeFlow(input.storeState, artifacts)) {
    return {
      nextAgentId: "practice-agent",
      shouldEnd: false,
      reason: "当前模块是教学实践，但还没有 practice flow。",
    };
  }

  if (!hasRubric(artifacts)) {
    return {
      nextAgentId: "rubric-agent",
      shouldEnd: false,
      reason: "运行状态中还没有评价量规，需要生成可审校的 rubric。",
    };
  }

  if (hasEvidenceGap(input.storeState, artifacts, input.evidenceLedger) || lacksRequiredReferences(artifacts)) {
    return {
      nextAgentId: "evidence-agent",
      shouldEnd: false,
      reason: "发现证据缺口或 artifacts 缺少 evidenceRefs，需要补齐证据链。",
    };
  }

  if (!hasAssetGraph(artifacts)) {
    return {
      nextAgentId: "asset-agent",
      shouldEnd: false,
      reason: "导航、实践、量规和证据已具备，但还没有教学资产图谱。",
    };
  }

  return {
    shouldEnd: true,
    reason: "课程上下文、模块场景、量规、证据链和资产图谱均已具备，可以结束本轮 agent session。",
  };
}

export function buildDirectorInput(request: AgentRunRequest): DirectorInput {
  const storeState = request.storeState || {};
  const artifacts = mergeArtifacts(storeState.artifacts, request.artifacts);
  const courseContext = request.courseContext || storeState.courseContext;
  return {
    module: request.module || storeState.currentModule || "practice",
    storeState: {
      ...storeState,
      currentModule: request.module || storeState.currentModule || "practice",
      courseContext,
      artifacts,
    },
    courseContext,
    artifacts,
    evidenceLedger: [...(request.evidenceLedger || []), ...(Array.isArray(artifacts.evidenceLedger) ? artifacts.evidenceLedger : [])],
    directorState: request.directorState || {},
  };
}

function mergeArtifacts(base?: TeachingArtifacts, override?: TeachingArtifacts): TeachingArtifacts {
  return {
    ...(base || {}),
    ...(override || {}),
  };
}

function hasCourseContext(context?: CourseContext): boolean {
  if (!context) return false;
  return Boolean(context.courseName || context.lessonTitle || context.className || context.program || context.courseId);
}

function hasNavigationScene(storeState: TeachingStoreState, artifacts: TeachingArtifacts): boolean {
  return Boolean(
    artifacts.navigationScene ||
      artifacts.navigationPath ||
      findScene(storeState, "navigation") ||
      getNestedObject(artifacts, ["navigation", "scene"]) ||
      getNestedObject(artifacts, ["navigation", "path"]),
  );
}

function hasPracticeFlow(storeState: TeachingStoreState, artifacts: TeachingArtifacts): boolean {
  return Boolean(
    artifacts.practiceFlow ||
      findScene(storeState, "practice") ||
      getNestedObject(artifacts, ["practice", "flow"]) ||
      getNestedObject(artifacts, ["practice", "scene"]),
  );
}

function hasRubric(artifacts: TeachingArtifacts): boolean {
  return Boolean(artifacts.rubric || getNestedObject(artifacts, ["assessment", "rubric"]));
}

function hasAssetGraph(artifacts: TeachingArtifacts): boolean {
  const graph = artifacts.assetGraph || getNestedObject(artifacts, ["assets", "graph"]);
  if (!graph || typeof graph !== "object") return false;
  const record = graph as { nodes?: unknown; edges?: unknown };
  return Array.isArray(record.nodes) && record.nodes.length > 0;
}

function hasEvidenceGap(storeState: TeachingStoreState, artifacts: TeachingArtifacts, ledger: JsonRecord[]): boolean {
  if (Array.isArray(storeState.evidenceGaps) && storeState.evidenceGaps.length > 0) return true;
  const artifactGaps = getNestedObject(artifacts, ["evidence", "gaps"]);
  if (Array.isArray(artifactGaps) && artifactGaps.length > 0) return true;
  return ledger.some((item) => {
    const status = stringValue(item.status || item.state || item.type);
    return status.includes("gap") || status.includes("缺口") || status.includes("missing") || status.includes("待补充");
  });
}

function lacksRequiredReferences(artifacts: TeachingArtifacts): boolean {
  const rubric = artifacts.rubric as JsonRecord | undefined;
  if (rubric && !hasRefs(rubric)) return true;
  const practiceFlow = artifacts.practiceFlow as unknown as JsonRecord | undefined;
  if (practiceFlow && !hasRefs(practiceFlow)) return true;
  const navigationScene = artifacts.navigationScene as unknown as JsonRecord | undefined;
  if (navigationScene && !hasRefs(navigationScene)) return true;
  return false;
}

function hasRefs(value: JsonRecord): boolean {
  if (Array.isArray(value.evidenceRefs) && value.evidenceRefs.length > 0) return true;
  if (Array.isArray(value.citations) && value.citations.length > 0) return true;
  if (Array.isArray(value.sourceRefs) && value.sourceRefs.length > 0) return true;
  return false;
}

function findScene(storeState: TeachingStoreState, module: TeachingModule): boolean {
  return Array.isArray(storeState.scenes) && storeState.scenes.some((scene) => scene.module === module);
}

function getNestedObject(value: unknown, keys: string[]): unknown {
  let current = value;
  for (const key of keys) {
    if (!current || typeof current !== "object" || Array.isArray(current)) return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.toLowerCase() : "";
}
