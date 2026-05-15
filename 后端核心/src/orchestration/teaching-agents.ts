import type { JsonRecord } from "../types";

export function buildTeachingAgentOrchestration(): JsonRecord {
  return {
    agents: [
      {
        id: "teaching-design-mentor",
        name: "教学设计导师",
        owns: ["course-outline-generator", "teaching-scene-generator", "ReflectionSceneRenderer"],
      },
      {
        id: "evidence-rule-assistant",
        name: "评价证据助理",
        owns: ["evidence-rule-generator", "EvaluationSceneRenderer", "collect_evidence"],
      },
      {
        id: "simulated-student-agent",
        name: "模拟学生",
        owns: ["simulate_student_response", "PracticeSceneRenderer"],
      },
      {
        id: "course-asset-curator",
        name: "课程资产整理 agent",
        owns: ["asset-pack-generator", "AssetGraphRenderer", "export_asset"],
      },
    ],
    handoff: [
      ["teaching-design-mentor", "simulated-student-agent"],
      ["simulated-student-agent", "evidence-rule-assistant"],
      ["evidence-rule-assistant", "course-asset-curator"],
      ["course-asset-curator", "teaching-design-mentor"],
    ],
  };
}
