import { getAiModelName, getAiProviderName } from "@/lib/ai";
import { databaseError, ok, readJson, withApiHandler } from "@/lib/errors";
import { buildAssetSummary } from "@/lib/generation";
import { assertCourseAccess } from "@/lib/permissions";
import { getSupabaseAdmin } from "@/lib/supabase";
import { loadCourseSources } from "@/lib/sources";
import { assetSummaryRequestSchema } from "@/lib/validation";

export const runtime = "nodejs";

export const POST = withApiHandler(async (request) => {
  const input = assetSummaryRequestSchema.parse(await readJson(request));
  const supabase = getSupabaseAdmin();
  const access = await assertCourseAccess(supabase, input.userId, input.courseId);
  const sources = await loadCourseSources(supabase, input.courseId, input.sourceFileIds);
  const summary = await buildAssetSummary(input, access.course, sources);

  const { data: asset, error } = await supabase
    .from("assets")
    .insert({
      user_id: input.userId,
      course_id: input.courseId,
      title: summary.title || input.title,
      asset_type: "asset_summary",
      payload: summary,
      source_file_ids: input.sourceFileIds,
      model_provider: getAiProviderName(),
      model_name: getAiModelName(),
      metadata: { requestedAssetType: input.assetType, permissionRole: access.role },
    })
    .select("*")
    .single();

  if (error) throw databaseError("Failed to save asset summary.", error);
  return ok({ summary, asset }, 201);
});
