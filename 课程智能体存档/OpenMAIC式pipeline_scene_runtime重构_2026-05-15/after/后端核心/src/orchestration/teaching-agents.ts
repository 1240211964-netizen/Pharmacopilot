import type { JsonRecord } from "../types";

export function buildTeachingAgentOrchestration(): JsonRecord {
  return {
    orchestration: "pharmacopilot-agent-orchestration",
    version: "0.2.0",
    agents: [
      {
        id: "teaching-design-mentor",
        name: "教学设计导师",
        role: "负责课程目标、教学活动、课堂追问和教学反思的设计一致性。",
        owns: ["course-outline", "design-scenes", "practice-prompts", "reflection-plan"],
        inputRefs: ["input.courseName", "input.topic", "input.studentProfile", "outline.steps"],
        outputRefs: ["outline.objectives", "scene.outputs", "reflection_report"],
        interventionPolicy: "在目标确认、流程确认和反思入库节点请求教师确认。",
        failureMode: "目标泛化、活动与评价脱节、反思缺少证据时降级为教师审阅草案。",
      },
      {
        id: "evidence-rule-assistant",
        name: "评价证据助理",
        role: "负责评价规则、证据链、量规等级描述和表现性评价依据。",
        owns: ["evidence-rules", "rubric", "formative-evaluation", "performance-evaluation"],
        inputRefs: ["scenes.expectedEvidence", "scenes.evaluationFocus", "assetPack.items"],
        outputRefs: ["evidenceRules", "rubric", "evidence_chain"],
        interventionPolicy: "在量规确认、案例证据边界和表现性评价依据节点请求教师确认。",
        failureMode: "evidenceRefs 不完整、证据边界不清或等级描述不可观察时阻断自动导出。",
      },
      {
        id: "simulated-student-agent",
        name: "模拟学生",
        role: "负责模拟学生回应、常见误区、协作讨论和课堂互动反馈。",
        owns: ["student-response-simulation", "misconception-samples", "collaboration-records"],
        inputRefs: ["input.studentProfile", "outline.steps", "practice-scenes"],
        outputRefs: ["simulated-responses", "misconception-list", "discussion-record"],
        interventionPolicy: "仅生成模拟数据，不直接代表真实学生；教师可替换为真实课堂证据。",
        failureMode: "模拟回应与学生画像不匹配时标记为低置信度并等待真实数据替换。",
      },
      {
        id: "course-asset-curator",
        name: "课程资产整理 agent",
        role: "负责把教学设计、课堂活动、评价证据和反思报告整理为可导出资产包。",
        owns: ["asset-pack", "export-manifest", "source-boundary", "review-queue"],
        inputRefs: ["outline", "scenes", "evidenceRules", "actions.export_asset"],
        outputRefs: ["assetPack", "exports", "reviewQueue"],
        interventionPolicy: "所有导出资产进入教师审阅队列，确认后再入库或复用。",
        failureMode: "来源场景或证据规则缺失时暂停导出并生成缺口清单。",
      },
    ],
    handoff: [
      {
        from: "teaching-design-mentor",
        to: "evidence-rule-assistant",
        boundary: "教学目标、活动序列和学生产出定义完成后，交接评价规则与证据链。",
      },
      {
        from: "evidence-rule-assistant",
        to: "simulated-student-agent",
        boundary: "评价证据要求明确后，交接学生回应模拟和误区样例生成。",
      },
      {
        from: "simulated-student-agent",
        to: "teaching-design-mentor",
        boundary: "模拟回应和课堂互动证据生成后，交接教师追问与教学调节。",
      },
      {
        from: "evidence-rule-assistant",
        to: "course-asset-curator",
        boundary: "评价证据和量规确认后，交接资产映射、导出清单和审阅队列。",
      },
      {
        from: "course-asset-curator",
        to: "teaching-design-mentor",
        boundary: "资产入库和反思报告生成后，交接下一轮持续改进建议。",
      },
    ],
    responsibilities: [
      "Course Input 到 Course Outline 的结构化转换由 teaching-design-mentor 牵头。",
      "20 Teaching Steps 到 Teaching Scenes 的颗粒度映射由 scene runtime contract 约束。",
      "Evidence Rules 必须由 evidence-rule-assistant 生成并绑定 sceneId 与 evidenceRefs。",
      "Asset Pack 与 Export Manifest 必须声明 sourceScenes、sourceRules 和教师审阅要求。",
    ],
    approvalPolicy: [
      {
        checkpoint: "scene-03",
        owner: "teaching-design-mentor",
        rule: "确认教学目标后才能锁定后续活动和评价量规。",
      },
      {
        checkpoint: "scene-08",
        owner: "evidence-rule-assistant",
        rule: "确认教学流程与量规后才能进入课中 runtime。",
      },
      {
        checkpoint: "scene-12",
        owner: "evidence-rule-assistant",
        rule: "确认案例证据边界后才能采集学生分析证据。",
      },
      {
        checkpoint: "scene-17",
        owner: "evidence-rule-assistant",
        rule: "确认表现性评价依据后才能生成评价结论。",
      },
      {
        checkpoint: "scene-20",
        owner: "course-asset-curator",
        rule: "确认反思报告与资产入库范围后才能导出最终资产包。",
      },
    ],
    collaborationPattern: [
      "outline-first: 先生成课程骨架和 20 环节，再派生 runtime scene。",
      "scene-boundary: 每个 scene 只负责一个教学环节，asset_graph 仅做总览。",
      "evidence-backed: 评价规则必须引用 scene 证据和教师检查点。",
      "export-first: 所有资产默认进入导出中心和教师审阅队列。",
    ],
  };
}
