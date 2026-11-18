"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import Logo from "@/components/site/logo";

const NAV_GROUPS: { title: string; items: { href: string; label: string; icon: string }[] }[] = [
  {
    title: "الرئيسية",
    items: [
      { href: "/admin", label: "لوحة المعلومات", icon: "📊" },
      { href: "/admin/requests", label: "طلبات العملاء", icon: "📥" },
      { href: "/admin/media", label: "مكتبة الوسائط", icon: "🖼️" },
    ],
  },
  {
    title: "المحتوى",
    items: [
      { href: "/admin/sections", label: "أقسام الصفحة الرئيسية", icon: "🧩" },
      { href: "/admin/services", label: "الخدمات", icon: "🛎️" },
      { href: "/admin/offers", label: "العروض والبرامج", icon: "🎁" },
      { href: "/admin/bus-companies", label: "شركات الباصات", icon: "🚌" },
      { href: "/admin/bus-routes", label: "خطوط السير", icon: "🛣️" },
    ],
  },
  {
    title: "الثقة والمحتوى التفاعلي",
    items: [
      { href: "/admin/benefits", label: "أسباب الاختيار", icon: "⭐" },
      { href: "/admin/stats", label: "المعلومات السريعة", icon: "🔢" },
      { href: "/admin/testimonials", label: "آراء العملاء", icon: "💬" },
      { href: "/admin/faqs", label: "الأسئلة الشائعة", icon: "❓" },
    ],
  },
  {
    title: "الإعدادات",
    items: [
      { href: "/admin/settings", label: "معلومات المكتب والألوان", icon: "⚙️" },
      { href: "/admin/settings#seo", label: "إعدادات SEO", icon: "🔍" },
    ],
  },
];

export default function AdminShell({
  children,
  userName,
  officeName,
  newCount,
}: {
  children: ReactNode;
  userName: string;
  officeName: string;
  newCount: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  return (
    <div className="min-h-screen bg-ivory lg:flex">
      {/* الشريط العلوي للجوال */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-navy/10 bg-white px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-navy/15 bg-white text-navy"
          aria-label="قائمة لوحة التحكم"
          aria-expanded={open}
        >
          ☰
        </button>
        <p className="font-display text-sm font-extrabold text-navy">لوحة التحكم</p>
        <Link href="/" className="text-xs font-bold text-primary">
          الموقع ↗
        </Link>
      </div>

      <aside
        className={`fixed inset-y-0 right-0 z-50 w-[270px] overflow-y-auto navy-mesh p-5 text-white transition-transform duration-300 lg:static lg:z-0 lg:translate-x-0 ${
          open ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="absolute inset-0 pattern-arabesque opacity-25" aria-hidden="true" />
        <div className="relative">
          <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
            <Logo name={officeName} tagline="لوحة التحكم" variant="light" size="sm" />
          </div>

          <nav className="mt-6 space-y-6" aria-label="قائمة لوحة التحكم">
            {NAV_GROUPS.map((group) => (
              <div key={group.title}>
                <p className="mb-2 px-2 text-[10px] font-extrabold uppercase tracking-wider text-white/40">
                  {group.title}
                </p>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const active = pathname === item.href.split("#")[0];
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-[13px] font-bold transition ${
                            active
                              ? "bg-gold text-navy shadow-lg"
                              : "text-white/80 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{item.icon}</span>
                            {item.label}
                          </span>
                          {item.href === "/admin/requests" && newCount > 0 ? (
                            <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-extrabold text-white">
                              {newCount}
                            </span>
                          ) : null}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <div className="mt-8 rounded-2xl border border-white/15 bg-white/10 p-4">
            <p className="text-[11px] text-white/60">مسجّل الدخول</p>
            <p className="mt-0.5 text-sm font-extrabold">{userName}</p>
            <button
              type="button"
              onClick={logout}
              className="mt-3 w-full rounded-xl bg-rose-500/90 px-3 py-2 text-xs font-extrabold text-white transition hover:bg-rose-600"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </aside>

      {open ? (
        <div
          className="fixed inset-0 z-40 bg-navy/50 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      <div className="flex-1 lg:min-w-0">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">{children}</div>
      </div>
    </div>
  );
}
