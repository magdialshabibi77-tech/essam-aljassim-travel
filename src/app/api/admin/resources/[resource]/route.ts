import { asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { apiGuard, unauthorized } from "@/lib/auth";
import { getResourceConfig } from "@/lib/admin-resources";
import { autoSlug, buildPayload, serializeRow, serializeRows } from "@/lib/resource-io";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  const session = await apiGuard();
  if (!session) return unauthorized();
  const { resource } = await params;
  const config = getResourceConfig(resource);
  if (!config) return Response.json({ ok: false, error: "مورد غير معروف" }, { status: 404 });

  const query = db.select().from(config.table);
  const rows =
    config.orderMode === "newest"
      ? await query.orderBy(desc(config.table.id))
      : config.orderMode === "oldest"
        ? await query.orderBy(asc(config.table.id))
        : await query.orderBy(asc(config.table.sortOrder), asc(config.table.id));

  return Response.json({ ok: true, rows: serializeRows(rows) });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  const session = await apiGuard();
  if (!session) return unauthorized();
  const { resource } = await params;
  const config = getResourceConfig(resource);
  if (!config) return Response.json({ ok: false, error: "مورد غير معروف" }, { status: 404 });

  const body = (await request.json()) as Record<string, unknown>;
  const built = buildPayload(resource, body);
  if (!built) return Response.json({ ok: false, error: "بيانات غير صالحة" }, { status: 400 });

  try {
    if ("slug" in built.payload) {
      const current = String(built.payload.slug ?? "").trim();
      built.payload.slug = autoSlug(current, String(body[config.titleField] ?? "item"));
    }
    if ("title" in built.payload && !String(built.payload.title).trim()) {
      return Response.json({ ok: false, error: "العنوان مطلوب" }, { status: 400 });
    }
    if (config.name === "sections") {
      built.payload.isVisible = built.payload.isVisible !== false;
    }
    const inserted = (await db
      .insert(config.table)
      .values(built.payload)
      .returning()) as unknown as Record<string, unknown>[];
    return Response.json({ ok: true, row: serializeRow(inserted[0] ?? {}) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "خطأ غير معروف";
    if (message.includes("duplicate key")) {
      return Response.json({ ok: false, error: "المعرف (slug) مستخدم مسبقاً، غيّره وقم بالحفظ" }, { status: 409 });
    }
    return Response.json({ ok: false, error: `تعذر الحفظ: ${message}` }, { status: 500 });
  }
}
