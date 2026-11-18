"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/components/site/logo";
import { telLink, waLink } from "@/lib/utils";

type NavItem = { href: string; label: string };

type NavbarProps = {
  officeName: string;
  tagline: string;
  logoUrl: string;
  phone: string;
  whatsapp: string;
  availabilityLabel?: string;
};

export default function Navbar({
  officeName,
  tagline,
  logoUrl,
  phone,
  whatsapp,
  availabilityLabel,
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const links: NavItem[] = [
    { href: "/", label: "الرئيسية" },
    { href: "/services", label: "الخدمات" },
    { href: "/offers", label: "العروض والبرامج" },
    { href: "/buses", label: "حجوزات الباصات" },
    { href: "/contact", label: "تواصل معنا" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass border-b border-navy/10 shadow-[0_10px_30px_-24px_rgba(10,37,64,0.6)]"
            : "bg-ivory/80 backdrop-blur-md"
        }`}
      >
        <div className="container-lux flex h-[68px] items-center justify-between gap-3 lg:h-[78px]">
          <Link href="/" className="shrink-0" aria-label={officeName}>
            <Logo name={officeName} tagline={tagline} logoUrl={logoUrl} size="md" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="روابط الموقع">
            {links.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                    active ? "text-navy" : "text-navy/70 hover:text-navy"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute inset-x-3 -bottom-0.5 h-[3px] rounded-full bg-gradient-to-r from-gold to-gold/30 transition-all duration-300 ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            {availabilityLabel ? (
              <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200 xl:inline-flex">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                {availabilityLabel}
              </span>
            ) : null}
            <a href={telLink(phone)} className="btn btn-outline !px-4 !py-2 text-sm">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M6.6 10.8c1.3 2.5 3.1 4.3 5.6 5.6l2-2c.3-.3.7-.4 1.1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V19c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.2c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1.1l-2 2z" />
              </svg>
              اتصال
            </a>
            <a
              href={waLink(whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa !px-4 !py-2 text-sm"
            >
              <WhatsAppIcon className="h-4 w-4" />
              واتساب
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-navy/15 bg-white text-navy shadow-sm transition hover:bg-gold/10 lg:hidden"
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={open}
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute inset-x-0 top-0 h-0.5 rounded-full bg-current transition-all duration-300 ${
                  open ? "top-1/2 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-current transition-all duration-200 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-current transition-all duration-300 ${
                  open ? "bottom-1/2 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* قائمة الجوال */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-navy/50 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute inset-x-3 top-[80px] overflow-hidden rounded-3xl border border-white/50 bg-white/95 p-4 shadow-2xl transition-all duration-300 ${
            open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <nav className="flex flex-col" aria-label="قائمة الجوال">
            {links.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl px-4 py-3 text-base font-bold text-navy transition hover:bg-gold/10"
                style={{ transitionDelay: `${index * 30}ms` }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-navy/10 pt-3">
            <a href={telLink(phone)} className="btn btn-outline text-sm">
              اتصال مباشر
            </a>
            <a
              href={waLink(whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa text-sm"
            >
              واتساب
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.04 3.2c-7.06 0-12.8 5.72-12.8 12.77 0 2.25.6 4.45 1.72 6.39L3.2 28.8l6.6-1.73a12.8 12.8 0 006.24 1.6h.01c7.05 0 12.79-5.73 12.79-12.78 0-3.41-1.33-6.62-3.75-9.03a12.68 12.68 0 00-9.05-3.66zm0 23.2h-.01c-1.96 0-3.89-.53-5.57-1.53l-.4-.24-4.13 1.08 1.1-4.03-.26-.41a10.6 10.6 0 01-1.63-5.65c0-5.87 4.78-10.64 10.66-10.64 2.85 0 5.52 1.11 7.53 3.12a10.55 10.55 0 013.11 7.53c0 5.87-4.78 10.77-10.4 10.77zm5.85-8.03c-.32-.16-1.9-.94-2.19-1.05-.29-.11-.51-.16-.72.16-.21.32-.83.94-1.02 1.13-.19.19-.37.21-.69.05-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.74-.98-2.38-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.67s1.15 3.1 1.31 3.31c.16.21 2.27 3.46 5.5 4.85.77.33 1.37.53 1.84.68.77.24 1.47.21 2.03.13.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.13-.29-.21-.61-.37z" />
    </svg>
  );
}
