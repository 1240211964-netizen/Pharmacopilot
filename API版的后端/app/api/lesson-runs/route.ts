import { databaseError, ok, withApiHandler } from "@/lib/errors";
import { assertCourseAccess } from "@/lib/permissions";
import { getSupabaseAdmin } from "@/lib/supabase";
import { readLimit, readRequiredSearchParam } from "@/lib/validation";

export const runtime = "nodejs";

export const GET = withApiHandler(async (request) => {
  const url = new URL(request.url);
  const userId = readRequiredSearchParam(url, "userId");
  const courseId = readRequiredSearchParam(url, "courseId");
  const runType = url.searchParams.get("runType");
  const limit = readLimit(url, 20, 100);

  const supabase = getSupabaseAdmin();
  await assertCourseAccess(supabase, userId, courseId);

  let query = supabase
    .from("lesson_runs")
    .select("*")
    .eq("course_id", courseId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (runType) query = query.eq("run_type", runType);

  const { data: lessonRuns, error } = await query;
  if (error) throw databaseError("Failed to load lesson runs.", error);
  return ok({ lessonRuns: lessonRuns || [] });
});
