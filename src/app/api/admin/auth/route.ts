import { ensureBootstrap } from "@/lib/seed";
import { authenticate, createSession, destroySession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export async function POST(request: Request) {
  await ensureBootstrap();
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";

  if (rateLimited(ip)) {
    return Response.json(
      { ok: false, error: "عدد محاولات كبير، حاول بعد عشر دقائق" },
      { status: 429 },
    );
  }

  let email = "";
  let password = "";
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    email = String(body.email ?? "");
    password = String(body.password ?? "");
  } catch {
    return Response.json({ ok: false, error: "طلب غير صالح" }, { status: 400 });
  }

  if (!email || !password) {
    return Response.json({ ok: false, error: "أدخل البريد الإلكتروني وكلمة المرور" }, { status: 400 });
  }

  const user = await authenticate(email, password);
  if (!user) {
    return Response.json({ ok: false, error: "بيانات الدخول غير صحيحة" }, { status: 401 });
  }

  await createSession(user);
  return Response.json({ ok: true });
}

export async function DELETE() {
  await destroySession();
  return Response.json({ ok: true });
}
