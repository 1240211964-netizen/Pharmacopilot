import { getAiModelName, getAiProviderName } from "@/lib/ai";
import { databaseError, ok, readJson, withApiHandler } from "@/lib/errors";
import { buildRubric } from "@/lib/generation";
import { assertCourseAccess } from "@/lib/permissions";
import { getSupabaseAdmin } from "@/lib/supabase";
import { loadCourseSources } from "@/lib/sources";
import { rubricRequestSchema } from "@/lib/validation";

export const runtime = "nodejs";

export const POST = withApiHandler(async (request) => {
  const input = rubricRequestSchema.parse(await readJson(request));
  const supabase = getSupabaseAdmin();
  const access = await assertCourseAccess(supabase, input.userId, input.courseId);
  const sources = await loadCourseSources(supabase, input.courseId, input.sourceFileIds);
  const rubric = await buildRubric(input, access.course, sources);

  const { data: asset, error } = await supabase
    .from("assets")
    .insert({
      user_id: input.userId,
      course_id: input.courseId,
      title: rubric.title || input.title,
      asset_type: "rubric",
      payload: rubric,
      source_file_ids: input.sourceFileIds,
      model_provider: getAiProviderName(),
      model_name: getAiModelName(),
      metadata: { permissionRole: access.role },
    })
    .select("*")
    .single();

  if (error) throw databaseError("Failed to save rubric asset.", error);
  return ok({ rubric, asset }, 201);
});
