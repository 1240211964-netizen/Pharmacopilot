import { buildLessonPlan } from "@/lib/generation";
import { databaseError, ok, readJson, withApiHandler } from "@/lib/errors";
import { getAiModelName, getAiProviderName } from "@/lib/ai";
import { assertCourseAccess } from "@/lib/permissions";
import { getSupabaseAdmin } from "@/lib/supabase";
import { loadCourseSources } from "@/lib/sources";
import { lessonPlanRequestSchema } from "@/lib/validation";

export const runtime = "nodejs";

export const POST = withApiHandler(async (request) => {
  const input = lessonPlanRequestSchema.parse(await readJson(request));
  const supabase = getSupabaseAdmin();
  const access = await assertCourseAccess(supabase, input.userId, input.courseId);
  const sources = await loadCourseSources(supabase, input.courseId, input.sourceFileIds);
  const lessonPlan = await buildLessonPlan(input, access.course, sources);

  const { data: lessonRun, error } = await supabase
    .from("lesson_runs")
    .insert({
      user_id: input.userId,
      course_id: input.courseId,
      run_type: "lesson_plan",
      status: "completed",
      input,
      output: lessonPlan,
      source_file_ids: input.sourceFileIds,
      model_provider: getAiProviderName(),
      model_name: getAiModelName(),
      metadata: { permissionRole: access.role },
    })
    .select("*")
    .single();

  if (error) throw databaseError("Failed to save lesson plan generation run.", error);
  return ok({ lessonPlan, lessonRun }, 201);
});
