import type { SupabaseClient } from "@supabase/supabase-js";
import { ApiError, databaseError } from "./errors";

export type CourseAccess = {
  user: Record<string, unknown>;
  course: Record<string, unknown>;
  role: string;
};

function ownerIdOf(course: Record<string, unknown>): string | undefined {
  return (
    (course.owner_id as string | undefined) ||
    (course.user_id as string | undefined) ||
    (course.created_by_user_id as string | undefined)
  );
}

export async function assertCourseAccess(
  supabase: SupabaseClient,
  userId: string,
  courseId: string,
): Promise<CourseAccess> {
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id, email, display_name")
    .eq("id", userId)
    .maybeSingle();

  if (userError) throw databaseError("Failed to validate user.", userError);
  if (!user) throw new ApiError(404, "NOT_FOUND", "User was not found.");

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id, owner_id, title, description")
    .eq("id", courseId)
    .maybeSingle();

  if (courseError) throw databaseError("Failed to validate course.", courseError);
  if (!course) throw new ApiError(404, "NOT_FOUND", "Course was not found.");

  if (ownerIdOf(course) === userId) {
    return { user, course, role: "owner" };
  }

  const { data: membership, error: membershipError } = await supabase
    .from("course_members")
    .select("id, role")
    .eq("course_id", courseId)
    .eq("user_id", userId)
    .maybeSingle();

  if (membershipError) throw databaseError("Failed to validate course membership.", membershipError);
  if (!membership) {
    throw new ApiError(403, "FORBIDDEN", "User does not have access to this course.");
  }

  return { user, course, role: (membership.role as string | undefined) || "member" };
}
