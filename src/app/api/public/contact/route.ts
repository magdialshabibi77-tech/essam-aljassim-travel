import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { ensureBootstrap } from "@/lib/seed";

export const dynamic = "force-dynamic";

function clean(value: unknown, max = 300) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export async function POST(request: Request) {
  try {
    await ensureBootstrap();
    const body = (await request.json()) as Record<string, unknown>;
    const name = clean(body.name, 120);
    const phone = clean(body.phone, 40);
    const message = clean(body.message, 1500);

    if (name.length < 3 || phone.replace(/[^\d]/g, "").length < 7 || message.length < 5) {
      return Response.json({ ok: false, error: "يرجى إكمال البيانات المطلوبة" }, { status: 400 });
    }

    await db.insert(contactMessages).values({
      name,
      phone,
      subject: clean(body.subject, 120),
      message,
      status: "new",
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("contact error", error);
    return Response.json({ ok: false, error: "تعذر إرسال الرسالة" }, { status: 500 });
  }
}
