import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { apiGuard, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

const ALLOWED_KEYS = [
  "officeName",
  "officeShortName",
  "tagline",
  "logoUrl",
  "faviconUrl",
  "phone",
  "phoneSecondary",
  "whatsappNumber",
  "whatsappLink",
  "email",
  "address",
  "mapsLink",
  "facebookUrl",
  "tiktokUrl",
  "workingHours",
  "workingHoursNote",
  "availabilityStatus",
  "aboutText",
  "colorPrimary",
  "colorNavy",
  "colorAccent",
  "colorBackground",
  "colorSurface",
  "seoTitle",
  "seoDescription",
  "seoKeywords",
  "ogImage",
  "whatsappPopupEnabled",
  "whatsappPopupTitle",
  "whatsappPopupMessage",
  "whatsappPopupButton",
  "whatsappPopupDelay",
  "copyrightText",
  "footerNote",
] as const;

const STRING_KEYS = new Set<string>(
  ALLOWED_KEYS.filter((k) => k !== "whatsappPopupEnabled" && k !== "whatsappPopupDelay"),
);
const NUMBER_KEYS = new Set<string>(["whatsappPopupDelay"]);

export async function GET() {
  const session = await apiGuard();
  if (!session) return unauthorized();
  const rows = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);
  return Response.json({ ok: true, settings: rows[0] });
}

export async function PATCH(request: Request) {
  const session = await apiGuard();
  if (!session) return unauthorized();

  const body = (await request.json()) as Record<string, unknown>;
  const payload: Record<string, unknown> = {};

  for (const key of ALLOWED_KEYS) {
    if (!(key in body)) continue;
    const value = body[key];
    if (NUMBER_KEYS.has(key)) {
      payload[key] = Math.min(Math.max(Number(value) || 0, 3000), 120000);
    } else if (key === "whatsappPopupEnabled") {
      payload[key] = value === true || value === "true" || value === 1;
    } else if (STRING_KEYS.has(key)) {
      payload[key] = String(value ?? "").slice(0, 4000);
    }
  }

  if (Object.keys(payload).length === 0) {
    return Response.json({ ok: false, error: "لا توجد تغييرات للحفظ" }, { status: 400 });
  }
  payload.updatedAt = new Date();

  await db.update(siteSettings).set(payload).where(eq(siteSettings.id, 1));
  const rows = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);
  return Response.json({ ok: true, settings: rows[0] });
}
