import { db } from "@/db";
import { bookingRequests } from "@/db/schema";
import { ensureBootstrap } from "@/lib/seed";
import { makeReference } from "@/lib/utils";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = new Set(["bus", "flight", "visa", "umrah", "service", "contact"]);

function clean(value: unknown, max = 300) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export async function POST(request: Request) {
  try {
    await ensureBootstrap();
    const body = (await request.json()) as Record<string, unknown>;

    const customerName = clean(body.customerName, 120);
    const phone = clean(body.phone, 40);
    if (customerName.length < 3) {
      return Response.json({ ok: false, error: "يرجى إدخال الاسم بشكل صحيح" }, { status: 400 });
    }
    if (phone.replace(/[^\d]/g, "").length < 7) {
      return Response.json({ ok: false, error: "يرجى إدخال رقم هاتف صحيح" }, { status: 400 });
    }

    const type = ALLOWED_TYPES.has(String(body.type)) ? String(body.type) : "service";

    const [record] = await db
      .insert(bookingRequests)
      .values({
        reference: makeReference(),
        type,
        serviceTitle: clean(body.serviceTitle, 120) || "طلب خدمة",
        customerName,
        phone,
        city: clean(body.city, 60),
        originCity: clean(body.originCity, 60),
        destinationCity: clean(body.destinationCity, 60),
        preferredCompany: clean(body.preferredCompany, 80),
        travelDate: clean(body.travelDate, 20),
        passengers: Math.min(Math.max(Number(body.passengers) || 1, 1), 50),
        details: clean(body.details, 1200),
        status: "new",
      })
      .returning({ reference: bookingRequests.reference, id: bookingRequests.id });

    return Response.json({ ok: true, reference: record.reference, id: record.id });
  } catch (error) {
    console.error("booking error", error);
    return Response.json({ ok: false, error: "تعذر حفظ الطلب، حاول مرة أخرى" }, { status: 500 });
  }
}
