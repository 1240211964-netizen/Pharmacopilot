export type JsonSchema = Record<string, unknown>;

const stringArray = {
  type: "array",
  items: { type: "string" },
};

const sourceUseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usedSources: stringArray,
    limitations: stringArray,
  },
  required: ["usedSources", "limitations"],
};

export const lessonPlanJsonSchema: JsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    lessonOverview: { type: "string" },
    durationMinutes: { type: "number" },
    contextAlignment: {
      type: "object",
      additionalProperties: false,
      properties: {
        courseObjectives: stringArray,
        chapterObjectives: stringArray,
        teachingFocus: stringArray,
        learnerAssumptions: stringArray,
      },
      required: ["courseObjectives", "chapterObjectives", "teachingFocus", "learnerAssumptions"],
    },
    timeline: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          phase: { type: "string" },
          minutes: { type: "number" },
          teacherActions: stringArray,
          studentActions: stringArray,
          materials: stringArray,
          checksForUnderstanding: stringArray,
        },
        required: ["phase", "minutes", "teacherActions", "studentActions", "materials", "checksForUnderstanding"],
      },
    },
    activities: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          purpose: { type: "string" },
          instructions: stringArray,
          expectedOutput: { type: "string" },
          pharmacyContext: { type: "string" },
        },
        required: ["name", "purpose", "instructions", "expectedOutput", "pharmacyContext"],
      },
    },
    assessment: {
      type: "object",
      additionalProperties: false,
      properties: {
        formativeChecks: stringArray,
        homework: { type: "string" },
        evidenceOfLearning: stringArray,
      },
      required: ["formativeChecks", "homework", "evidenceOfLearning"],
    },
    teachingNotes: stringArray,
    sourceUse: sourceUseSchema,
  },
  required: [
    "title",
    "lessonOverview",
    "durationMinutes",
    "contextAlignment",
    "timeline",
    "activities",
    "assessment",
    "teachingNotes",
    "sourceUse",
  ],
};

export const rubricJsonSchema: JsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    taskDescription: { type: "string" },
    totalScore: { type: "number" },
    dimensions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          weight: { type: "number" },
          criteria: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                level: { type: "string" },
                scoreRange: { type: "string" },
                descriptor: { type: "string" },
              },
              required: ["level", "scoreRange", "descriptor"],
            },
          },
        },
        required: ["name", "weight", "criteria"],
      },
    },
    scoringGuide: stringArray,
    feedbackTemplates: stringArray,
    alignmentNotes: stringArray,
    sourceUse: sourceUseSchema,
  },
  required: [
    "title",
    "taskDescription",
    "totalScore",
    "dimensions",
    "scoringGuide",
    "feedbackTemplates",
    "alignmentNotes",
    "sourceUse",
  ],
};

export const assetSummaryJsonSchema: JsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    assetType: { type: "string" },
    shortSummary: { type: "string" },
    teachingUseCases: stringArray,
    keyConcepts: stringArray,
    recommendedLessonMoments: stringArray,
    cautions: stringArray,
    sourceBoundary: { type: "string" },
    sourceUse: sourceUseSchema,
  },
  required: [
    "title",
    "assetType",
    "shortSummary",
    "teachingUseCases",
    "keyConcepts",
    "recommendedLessonMoments",
    "cautions",
    "sourceBoundary",
    "sourceUse",
  ],
};

export const sourceBoundaryJsonSchema: JsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    boundaryStatement: { type: "string" },
    allowedSources: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourceId: { type: "string" },
          title: { type: "string" },
          reason: { type: "string" },
        },
        required: ["sourceId", "title", "reason"],
      },
    },
    excludedSources: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourceId: { type: "string" },
          title: { type: "string" },
          reason: { type: "string" },
        },
        required: ["sourceId", "title", "reason"],
      },
    },
    citationRules: stringArray,
    modelGuardrails: stringArray,
    missingInformation: stringArray,
    nextSteps: stringArray,
  },
  required: [
    "boundaryStatement",
    "allowedSources",
    "excludedSources",
    "citationRules",
    "modelGuardrails",
    "missingInformation",
    "nextSteps",
  ],
};
