import { eq } from "drizzle-orm";
import { db } from "@/db";
import { apiGuard, unauthorized } from "@/lib/auth";
import { getResourceConfig } from "@/lib/admin-resources";
import { buildPayload, serializeRow } from "@/lib/resource-io";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ resource: string; id: string }> },
) {
  const session = await apiGuard();
  if (!session) return unauthorized();
  const { resource, id } = await params;
  const config = getResourceConfig(resource);
  if (!config) return Response.json({ ok: false, error: "مورد غير معروف" }, { status: 404 });
  const rowId = Number(id);
  if (!Number.isFinite(rowId)) {
    return Response.json({ ok: false, error: "معرّف غير صالح" }, { status: 400 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const built = buildPayload(resource, body, true);
  if (!built) return Response.json({ ok: false, error: "بيانات غير صالحة" }, { status: 400 });

  try {
    if ("slug" in built.payload) {
      const current = String(built.payload.slug ?? "").trim();
      if (current) {
        built.payload.slug = current
          .toLowerCase()
          .replace(/[^\p{L}\p{N}]+/gu, "-")
          .replace(/^-+|-+$/g, "");
      } else {
        delete built.payload.slug;
      }
    }
    if (config.name === "services" || config.name === "offers") {
      built.payload.updatedAt = new Date();
    }
    const updated = (await db
      .update(config.table)
      .set(built.payload)
      .where(eq(config.table.id, rowId))
      .returning()) as unknown as Record<string, unknown>[];
    const row = updated[0];
    if (!row) return Response.json({ ok: false, error: "العنصر غير موجود" }, { status: 404 });
    return Response.json({ ok: true, row: serializeRow(row) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "خطأ غير معروف";
    if (message.includes("duplicate key")) {
      return Response.json({ ok: false, error: "المعرف (slug) مستخدم مسبقاً" }, { status: 409 });
    }
    return Response.json({ ok: false, error: `تعذر التحديث: ${message}` }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ resource: string; id: string }> },
) {
  const session = await apiGuard();
  if (!session) return unauthorized();
  const { resource, id } = await params;
  const config = getResourceConfig(resource);
  if (!config) return Response.json({ ok: false, error: "مورد غير معروف" }, { status: 404 });
  const rowId = Number(id);
  if (!Number.isFinite(rowId)) {
    return Response.json({ ok: false, error: "معرّف غير صالح" }, { status: 400 });
  }
  await db.delete(config.table).where(eq(config.table.id, rowId));
  return Response.json({ ok: true });
}
