import { eq } from "drizzle-orm";
import { db } from "@/db";
import { bookingRequests, contactMessages } from "@/db/schema";
import { apiGuard, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

const STATUSES = new Set(["new", "in_progress", "contacted", "completed", "cancelled"]);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await apiGuard();
  if (!session) return unauthorized();
  const { id } = await params;
  const rowId = Number(id);
  if (!Number.isFinite(rowId)) {
    return Response.json({ ok: false, error: "معرّف غير صالح" }, { status: 400 });
  }

  const body = (await request.json()) as { status?: string; adminNotes?: string };
  const payload: Record<string, unknown> = { updatedAt: new Date() };
  if (body.status) {
    if (!STATUSES.has(body.status)) {
      return Response.json({ ok: false, error: "حالة غير صالحة" }, { status: 400 });
    }
    payload.status = body.status;
  }
  if (typeof body.adminNotes === "string") {
    payload.adminNotes = body.adminNotes.slice(0, 2000);
  }

  const [row] = await db
    .update(bookingRequests)
    .set(payload)
    .where(eq(bookingRequests.id, rowId))
    .returning();
  if (!row) return Response.json({ ok: false, error: "الطلب غير موجود" }, { status: 404 });
  return Response.json({ ok: true, row });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await apiGuard();
  if (!session) return unauthorized();
  const { id } = await params;
  const rowId = Number(id);
  if (!Number.isFinite(rowId)) {
    return Response.json({ ok: false, error: "معرّف غير صالح" }, { status: 400 });
  }
  await db.delete(bookingRequests).where(eq(bookingRequests.id, rowId));
  return Response.json({ ok: true });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // تحديث حالة رسالة تواصل
  const session = await apiGuard();
  if (!session) return unauthorized();
  const { id } = await params;
  const rowId = Number(id);
  if (!Number.isFinite(rowId)) {
    return Response.json({ ok: false, error: "معرّف غير صالح" }, { status: 400 });
  }
  const body = (await request.json()) as { status?: string; adminNotes?: string };
  const payload: Record<string, unknown> = {};
  if (body.status && STATUSES.has(body.status)) payload.status = body.status;
  if (typeof body.adminNotes === "string") payload.adminNotes = body.adminNotes.slice(0, 2000);

  const [row] = await db
    .update(contactMessages)
    .set(payload)
    .where(eq(contactMessages.id, rowId))
    .returning();
  if (!row) return Response.json({ ok: false, error: "الرسالة غير موجودة" }, { status: 404 });
  return Response.json({ ok: true, row });
}
