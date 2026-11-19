import { eq } from "drizzle-orm";
import { db } from "@/db";
import { mediaFiles } from "@/db/schema";
import { apiGuard, unauthorized } from "@/lib/auth";
import { listMedia, saveUpload } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await apiGuard();
  if (!session) return unauthorized();
  const rows = await listMedia(400);
  return Response.json({ ok: true, rows: rows.reverse() });
}

export async function POST(request: Request) {
  const session = await apiGuard();
  if (!session) return unauthorized();

  try {
    const formData = await request.formData();
    const entries = formData.getAll("file");
    const alt = String(formData.get("alt") ?? "");
    const saved = [];

    for (const entry of entries) {
      if (!(entry instanceof File)) continue;
      const result = await saveUpload(entry, { alt });
      if (!result.ok) {
        return Response.json({ ok: false, error: result.error }, { status: 400 });
      }
      saved.push(result.file);
    }

    if (saved.length === 0) {
      return Response.json({ ok: false, error: "لم يتم اختيار أي ملف" }, { status: 400 });
    }
    return Response.json({ ok: true, files: saved, file: saved[0] });
  } catch (error) {
    console.error("upload error", error);
    const detail = error instanceof Error ? error.message : String(error);
    return Response.json({ ok: false, error: `خطأ في معالجة الملف: ${detail}` }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await apiGuard();
  if (!session) return unauthorized();
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  if (!Number.isFinite(id)) {
    return Response.json({ ok: false, error: "معرّف غير صالح" }, { status: 400 });
  }
  await db.delete(mediaFiles).where(eq(mediaFiles.id, id));
  return Response.json({ ok: true });
}
