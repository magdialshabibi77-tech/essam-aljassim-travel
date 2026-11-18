import Link from "next/link";
import Logo from "@/components/site/logo";
import { telLink, waLink } from "@/lib/utils";

type FooterProps = {
  settings: {
    officeName: string;
    officeShortName: string;
    tagline: string;
    logoUrl: string;
    phone: string;
    phoneSecondary: string;
    whatsappLink: string;
    whatsappNumber: string;
    address: string;
    mapsLink: string;
    facebookUrl: string;
    tiktokUrl: string;
    workingHours: string;
    workingHoursNote: string;
    copyrightText: string;
    footerNote: string;
    aboutText: string;
  };
  serviceLinks: { href: string; label: string }[];
};

export default function Footer({ settings, serviceLinks }: FooterProps) {
  return (
    <footer className="relative overflow-hidden navy-mesh text-white">
      <div className="absolute inset-0 pattern-arabesque opacity-30" aria-hidden="true" />
      <div className="absolute -top-24 left-1/2 h-48 w-[70%] -translate-x-1/2 rounded-full bg-gold/20 blur-3xl" />

      <div className="relative container-lux py-14">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo
              name={settings.officeName}
              tagline={settings.tagline}
              logoUrl={settings.logoUrl}
              variant="light"
            />
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              {settings.aboutText ||
                "خدمات السفر والحجوزات ومتابعة معاملات التأشيرات وبرامج الحج والعمرة."}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 transition hover:-translate-y-1 hover:bg-white/20"
                aria-label="فيسبوك"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.2c0-.9.2-1.5 1.5-1.5h1.7V4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.2V10H8v3h2.3v8h3.2z" />
                </svg>
              </a>
              <a
                href={settings.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 transition hover:-translate-y-1 hover:bg-white/20"
                aria-label="تيك توك"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M16.5 3c.3 1.9 1.6 3.4 3.5 3.7v3c-1.4 0-2.7-.4-3.8-1.2v5.8a6.1 6.1 0 11-6.1-6.1c.4 0 .8 0 1.1.1v3.1a3 3 0 101.9 2.8V3h3.4z" />
                </svg>
              </a>
              <a
                href={settings.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 transition hover:-translate-y-1 hover:bg-white/20"
                aria-label="الموقع على الخريطة"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M12 2a7 7 0 00-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display text-base font-extrabold text-gold">روابط سريعة</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/75">
              {[
                { href: "/", label: "الصفحة الرئيسية" },
                { href: "/services", label: "جميع الخدمات" },
                { href: "/offers", label: "العروض والبرامج" },
                { href: "/buses", label: "حجوزات الباصات" },
                { href: "/contact", label: "تواصل معنا" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-2 transition hover:translate-x-[-4px] hover:text-white"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-gold/70" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-base font-extrabold text-gold">خدماتنا</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/75">
              {(serviceLinks.length > 0
                ? serviceLinks
                : [{ href: "/services", label: "الخدمات الرئيسية" }]
              ).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-2 transition hover:text-white"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-gold/70" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-base font-extrabold text-gold">معلومات التواصل</h3>
            <ul className="mt-4 space-y-3.5 text-sm text-white/80">
              <li className="flex gap-3">
                <span className="mt-0.5 text-gold">📞</span>
                <a href={telLink(settings.phone)} dir="ltr" className="hover:text-white">
                  {settings.phone}
                </a>
              </li>
              {settings.phoneSecondary ? (
                <li className="flex gap-3">
                  <span className="mt-0.5 text-gold">📞</span>
                  <a href={telLink(settings.phoneSecondary)} dir="ltr" className="hover:text-white">
                    {settings.phoneSecondary}
                  </a>
                </li>
              ) : null}
              <li className="flex gap-3">
                <span className="mt-0.5 text-gold">💬</span>
                <a
                  href={waLink(settings.whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  واتساب مباشر
                </a>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 text-gold">📍</span>
                <a href={settings.mapsLink} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  {settings.address}
                </a>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 text-gold">🕐</span>
                <span>
                  {settings.workingHours}
                  {settings.workingHoursNote ? (
                    <span className="block text-xs text-white/55">{settings.workingHoursNote}</span>
                  ) : null}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 h-px gold-line" />

        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-center text-xs text-white/60 sm:flex-row sm:text-right">
          <p>{settings.copyrightText}</p>
          {settings.footerNote ? <p className="max-w-md text-white/50">{settings.footerNote}</p> : null}
        </div>
      </div>
    </footer>
  );
}
