import { randomUUID } from "node:crypto";
import { ApiError, databaseError, ok, storageError, withApiHandler } from "@/lib/errors";
import { assertCourseAccess } from "@/lib/permissions";
import { getStorageBucket, getSupabaseAdmin } from "@/lib/supabase";
import { baseCourseRequestSchema } from "@/lib/validation";

export const runtime = "nodejs";

function fieldAsString(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === "string" ? value : "";
}

function sanitizeFilename(name: string) {
  return name.replace(/[^\w.\-\u4e00-\u9fa5]+/g, "_").slice(0, 160) || "upload.bin";
}

function ingestionPlan(fileId: string) {
  return {
    fileId,
    textParsing: {
      status: "pending",
      note: "Hook a document parser here and write extracted_text plus knowledge_chunks rows.",
    },
    embeddings: {
      status: "pending",
      note: "After parsing, split text into chunks and create embeddings for retrieval.",
    },
  };
}

export const POST = withApiHandler(async (request) => {
  const form = await request.formData();
  const input = baseCourseRequestSchema.parse({
    userId: fieldAsString(form, "userId"),
    courseId: fieldAsString(form, "courseId"),
  });

  const uploaded = form.get("file");
  if (!(uploaded instanceof File)) {
    throw new ApiError(400, "BAD_REQUEST", "Upload must include a file field named file.");
  }

  const maxUploadBytes = Number(process.env.MAX_UPLOAD_BYTES || 50 * 1024 * 1024);
  if (uploaded.size <= 0) throw new ApiError(400, "BAD_REQUEST", "Uploaded file is empty.");
  if (uploaded.size > maxUploadBytes) {
    throw new ApiError(400, "BAD_REQUEST", `Uploaded file exceeds MAX_UPLOAD_BYTES (${maxUploadBytes}).`);
  }

  const supabase = getSupabaseAdmin();
  const access = await assertCourseAccess(supabase, input.userId, input.courseId);
  const bucket = getStorageBucket();
  const fileId = randomUUID();
  const safeName = sanitizeFilename(uploaded.name);
  const storagePath = `${input.userId}/${input.courseId}/${fileId}-${safeName}`;
  const buffer = Buffer.from(await uploaded.arrayBuffer());

  const { error: uploadError } = await supabase.storage.from(bucket).upload(storagePath, buffer, {
    contentType: uploaded.type || "application/octet-stream",
    upsert: false,
  });
  if (uploadError) throw storageError("Failed to upload file to Supabase Storage.", uploadError);

  const plan = ingestionPlan(fileId);
  const { data: fileRecord, error: insertError } = await supabase
    .from("files")
    .insert({
      id: fileId,
      user_id: input.userId,
      uploaded_by_user_id: input.userId,
      course_id: input.courseId,
      title: fieldAsString(form, "title") || uploaded.name,
      file_name: uploaded.name,
      storage_bucket: bucket,
      storage_path: storagePath,
      mime_type: uploaded.type || "application/octet-stream",
      size_bytes: uploaded.size,
      status: "uploaded",
      parse_status: "pending",
      embedding_status: "pending",
      metadata: {
        permissionRole: access.role,
        ingestionPlan: plan,
      },
    })
    .select("*")
    .single();

  if (insertError) {
    await supabase.storage.from(bucket).remove([storagePath]);
    throw databaseError("Failed to save uploaded file record.", insertError);
  }

  return ok({ file: fileRecord, ingestion: plan }, 201);
});
