"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Logo from "@/components/site/logo";

export default function LoginForm({ officeName }: { officeName: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setError(data.error || "تعذر تسجيل الدخول");
        return;
      }
      const next = params.get("next") || "/admin";
      window.location.href = next.startsWith("/admin") ? next : "/admin";
    } catch {
      setError("خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="mb-6 flex justify-center">
        <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-md">
          <Logo name={officeName} tagline="لوحة التحكم الإدارية" variant="light" size="lg" />
        </div>
      </div>

      <div className="rounded-3xl border border-white/15 bg-white/95 p-7 text-navy shadow-2xl">
        <h1 className="font-display text-2xl font-extrabold">تسجيل الدخول</h1>
        <p className="mt-2 text-[13px] text-navy/60">
          هذه اللوحة مخصصة لإدارة المكتب فقط. لا يوجد تسجيل حسابات عامة.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="email">
              البريد الإلكتروني
            </label>
            <input
              id="email"
              type="email"
              className="field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dir="ltr"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="password">
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              className="field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              dir="ltr"
              autoComplete="current-password"
              required
            />
          </div>
          {error ? (
            <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>
          ) : null}
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? "جارٍ التحقق..." : "دخول لوحة التحكم"}
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-navy/10 bg-ivory p-4 text-[12px] leading-relaxed text-navy/65">
          <p className="font-extrabold text-navy">إنشاء حساب المدير الأول</p>
          <p className="mt-1">
            يُنشأ الحساب الأول تلقائياً عند أول تشغيل من متغيرات البيئة
            <code className="mx-1 rounded bg-navy/8 px-1.5 py-0.5" dir="ltr">ADMIN_EMAIL</code>
            و
            <code className="mx-1 rounded bg-navy/8 px-1.5 py-0.5" dir="ltr">ADMIN_PASSWORD</code>
            . إن لم تُحدد فالحساب الافتراضي:
            <span dir="ltr" className="mx-1 font-bold">
              admin@essam-aljassim.com / Essam@2026
            </span>
            — يُنصح بتحديث كلمة المرور بعد الدخول.
          </p>
        </div>
      </div>
    </div>
  );
}
