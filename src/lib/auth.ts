import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { eq, or } from "drizzle-orm";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";

export const SESSION_COOKIE = "ej_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 أيام

function getSecret(): Uint8Array {
  const raw =
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "essam-aljassim-travel-local-dev-secret-change-me";
  return new TextEncoder().encode(raw.padEnd(32, "*"));
}

export type AdminSession = {
  sub: string;
  email: string;
  name: string;
  role: string;
};

export async function createSession(user: AdminSession) {
  const token = await new SignJWT({ email: user.email, name: user.name, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<AdminSession | null> {
  try {
    const store = await cookies();
    const token = store.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, getSecret());
    return {
      sub: String(payload.sub ?? ""),
      email: String(payload.email ?? ""),
      name: String(payload.name ?? ""),
      role: String(payload.role ?? "admin"),
    };
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

/** تحقق من صلاحية الجلسة داخل مسارات الـ API */
export async function apiGuard(): Promise<AdminSession | null> {
  return getSession();
}

export function unauthorized() {
  return Response.json({ ok: false, error: "غير مصرح بالوصول" }, { status: 401 });
}

export async function authenticate(email: string, password: string) {
  const clean = email.trim().toLowerCase();
  const rows = await db
    .select()
    .from(adminUsers)
    .where(
      clean.includes("@")
        ? eq(adminUsers.email, clean)
        : or(eq(adminUsers.email, clean), eq(adminUsers.email, `${clean}@essam-aljassim.com`)),
    )
    .limit(1);
  const user = rows[0];
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;
  await db
    .update(adminUsers)
    .set({ lastLoginAt: new Date() })
    .where(eq(adminUsers.id, user.id));
  return { sub: String(user.id), email: user.email, name: user.name, role: user.role } as AdminSession;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}
