import { getAiModelName, getAiProviderName } from "@/lib/ai";
import { databaseError, ok, readJson, withApiHandler } from "@/lib/errors";
import { buildSourceBoundary } from "@/lib/generation";
import { assertCourseAccess } from "@/lib/permissions";
import { getSupabaseAdmin } from "@/lib/supabase";
import { loadCourseSources } from "@/lib/sources";
import { sourceBoundaryRequestSchema } from "@/lib/validation";

export const runtime = "nodejs";

export const POST = withApiHandler(async (request) => {
  const input = sourceBoundaryRequestSchema.parse(await readJson(request));
  const supabase = getSupabaseAdmin();
  const access = await assertCourseAccess(supabase, input.userId, input.courseId);
  const sources = await loadCourseSources(supabase, input.courseId, input.sourceFileIds);
  const boundary = await buildSourceBoundary(input, access.course, sources);

  const { data: lessonRun, error } = await supabase
    .from("lesson_runs")
    .insert({
      user_id: input.userId,
      course_id: input.courseId,
      run_type: "source_boundary",
      status: "completed",
      input,
      output: boundary,
      source_file_ids: input.sourceFileIds,
      model_provider: getAiProviderName(),
      model_name: getAiModelName(),
      metadata: { permissionRole: access.role },
    })
    .select("*")
    .single();

  if (error) throw databaseError("Failed to save source boundary run.", error);
  return ok({ boundary, lessonRun }, 201);
});
