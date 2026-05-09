import { z } from "zod";
import { ApiError } from "./errors";

export const idSchema = z.string().min(1).max(128);

export const baseCourseRequestSchema = z.object({
  userId: idSchema,
  courseId: idSchema,
});

export const sourceFileIdsSchema = z.array(idSchema).max(30).optional().default([]);

export const lessonPlanRequestSchema = baseCourseRequestSchema
  .extend({
    topic: z.string().min(1).max(300),
    durationMinutes: z.coerce.number().int().min(15).max(240).optional().default(90),
    learningObjectives: z.array(z.string().min(1).max(300)).max(12).optional().default([]),
    learnerProfile: z.string().max(2000).optional(),
    teachingContext: z.string().max(3000).optional(),
    requirements: z.string().max(3000).optional(),
    sourceFileIds: sourceFileIdsSchema,
  })
  .passthrough();

export const rubricRequestSchema = baseCourseRequestSchema
  .extend({
    title: z.string().min(1).max(200),
    taskDescription: z.string().min(1).max(4000),
    learningObjectives: z.array(z.string().min(1).max(300)).max(12).optional().default([]),
    levels: z.array(z.string().min(1).max(80)).max(8).optional().default(["优秀", "良好", "合格", "需改进"]),
    totalScore: z.coerce.number().int().min(1).max(1000).optional().default(100),
    sourceFileIds: sourceFileIdsSchema,
  })
  .passthrough();

export const assetSummaryRequestSchema = baseCourseRequestSchema
  .extend({
    title: z.string().min(1).max(200),
    assetType: z.string().min(1).max(80).optional().default("teaching_asset"),
    content: z.string().min(1).max(30000),
    intendedUse: z.string().max(2000).optional(),
    sourceFileIds: sourceFileIdsSchema,
  })
  .passthrough();

export const sourceBoundaryRequestSchema = baseCourseRequestSchema
  .extend({
    topic: z.string().min(1).max(300).optional(),
    boundaryIntent: z.string().max(3000).optional(),
    sourceFileIds: sourceFileIdsSchema,
  })
  .passthrough();

export const createAssetRequestSchema = baseCourseRequestSchema
  .extend({
    title: z.string().min(1).max(200),
    assetType: z.string().min(1).max(80),
    payload: z.record(z.string(), z.unknown()),
    sourceFileIds: sourceFileIdsSchema,
    lessonRunId: idSchema.optional(),
    metadata: z.record(z.string(), z.unknown()).optional().default({}),
  })
  .passthrough();

export function readRequiredSearchParam(url: URL, name: string): string {
  const value = url.searchParams.get(name);
  if (!value) throw new ApiError(400, "BAD_REQUEST", `Missing required query parameter: ${name}.`);
  return value;
}

export function readLimit(url: URL, fallback = 20, max = 100) {
  const raw = url.searchParams.get("limit");
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1 || value > max) {
    throw new ApiError(400, "BAD_REQUEST", `Query parameter limit must be an integer between 1 and ${max}.`);
  }
  return value;
}
