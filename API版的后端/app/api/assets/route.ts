import { ApiError, databaseError, ok, readJson, withApiHandler } from "@/lib/errors";
import { assertCourseAccess } from "@/lib/permissions";
import { getSupabaseAdmin } from "@/lib/supabase";
import { loadCourseSources } from "@/lib/sources";
import { createAssetRequestSchema, readLimit, readRequiredSearchParam } from "@/lib/validation";

export const runtime = "nodejs";

export const GET = withApiHandler(async (request) => {
  const url = new URL(request.url);
  const userId = readRequiredSearchParam(url, "userId");
  const courseId = readRequiredSearchParam(url, "courseId");
  const assetType = url.searchParams.get("assetType");
  const limit = readLimit(url, 20, 100);

  const supabase = getSupabaseAdmin();
  await assertCourseAccess(supabase, userId, courseId);

  let query = supabase
    .from("assets")
    .select("*")
    .eq("course_id", courseId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (assetType) query = query.eq("asset_type", assetType);

  const { data: assets, error } = await query;
  if (error) throw databaseError("Failed to load assets.", error);
  return ok({ assets: assets || [] });
});

export const POST = withApiHandler(async (request) => {
  const input = createAssetRequestSchema.parse(await readJson(request));
  const supabase = getSupabaseAdmin();
  const access = await assertCourseAccess(supabase, input.userId, input.courseId);
  if (input.sourceFileIds.length) {
    await loadCourseSources(supabase, input.courseId, input.sourceFileIds);
  }
  if (input.lessonRunId) {
    const { data: lessonRun, error: lessonRunError } = await supabase
      .from("lesson_runs")
      .select("id")
      .eq("id", input.lessonRunId)
      .eq("course_id", input.courseId)
      .maybeSingle();

    if (lessonRunError) throw databaseError("Failed to validate lesson run ownership.", lessonRunError);
    if (!lessonRun) {
      throw new ApiError(404, "NOT_FOUND", "lessonRunId was not found in this course.");
    }
  }

  const { data: asset, error } = await supabase
    .from("assets")
    .insert({
      user_id: input.userId,
      course_id: input.courseId,
      title: input.title,
      asset_type: input.assetType,
      payload: input.payload,
      source_file_ids: input.sourceFileIds,
      lesson_run_id: input.lessonRunId,
      metadata: {
        ...input.metadata,
        permissionRole: access.role,
        createdVia: "api",
      },
    })
    .select("*")
    .single();

  if (error) throw databaseError("Failed to create asset.", error);
  return ok({ asset }, 201);
});
