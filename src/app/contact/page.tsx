import type { Metadata } from "next";
import PageShell from "@/components/site/page-shell";
import Reveal from "@/components/site/reveal";
import ContactForm from "@/components/site/contact-form";
import { getServices, getSettings } from "@/lib/data";
import { telLink, waLink } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/site/navbar";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: `تواصل معنا — ${settings.officeName}`,
    description: `تواصل مع ${settings.officeName} في ${settings.address} — هاتف: ${settings.phone}`,
  };
}

export default async function ContactPage() {
  const [settings, services] = await Promise.all([getSettings(), getServices()]);

  return (
    <PageShell settings={settings} services={services}>
      <section className="relative overflow-hidden navy-mesh py-14 text-white">
        <div className="absolute inset-0 pattern-arabesque opacity-30" aria-hidden="true" />
        <div className="relative container-lux">
          <Reveal>
            <p className="font-display text-sm font-bold text-gold">نحن في خدمتك</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">تواصل مع المكتب</h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/75">
              اتصل بنا أو أرسل رسالة واتساب، أو اكتب استفسارك في النموذج وسيتولى فريق المكتب متابعته.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-lux">
        <div className="container-lux grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="card-lux p-6 sm:p-7">
              <h2 className="font-display text-xl font-extrabold text-navy">معلومات التواصل</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <a
                  href={telLink(settings.phone)}
                  className="rounded-2xl border border-navy/10 bg-ivory p-4 transition hover:-translate-y-1 hover:border-gold/50"
                >
                  <p className="text-xs font-bold text-navy/55">📞 اتصال مباشر</p>
                  <p dir="ltr" className="mt-1 font-display text-base font-extrabold text-navy">
                    {settings.phone}
                  </p>
                </a>
                {settings.phoneSecondary ? (
                  <a
                    href={telLink(settings.phoneSecondary)}
                    className="rounded-2xl border border-navy/10 bg-ivory p-4 transition hover:-translate-y-1 hover:border-gold/50"
                  >
                    <p className="text-xs font-bold text-navy/55">📞 رقم إضافي</p>
                    <p dir="ltr" className="mt-1 font-display text-base font-extrabold text-navy">
                      {settings.phoneSecondary}
                    </p>
                  </a>
                ) : null}
                <a
                  href={waLink(settings.whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 transition hover:-translate-y-1"
                >
                  <p className="text-xs font-bold text-emerald-700/70">💬 واتساب</p>
                  <p dir="ltr" className="mt-1 font-display text-base font-extrabold text-emerald-800">
                    {settings.whatsappNumber}
                  </p>
                </a>
                <a
                  href={settings.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-navy/10 bg-ivory p-4 transition hover:-translate-y-1 hover:border-gold/50"
                >
                  <p className="text-xs font-bold text-navy/55">📍 الموقع على الخريطة</p>
                  <p className="mt-1 text-[13px] font-extrabold text-navy">افتح في خرائط Google</p>
                </a>
                <div className="rounded-2xl border border-navy/10 bg-ivory p-4 sm:col-span-2">
                  <p className="text-xs font-bold text-navy/55">مقر المكتب</p>
                  <p className="mt-1 text-[14px] font-extrabold text-navy">{settings.address}</p>
                  <p className="mt-2 text-[13px] font-bold text-primary">{settings.workingHours}</p>
                  {settings.workingHoursNote ? (
                    <p className="mt-1 text-[12px] text-navy/60">{settings.workingHoursNote}</p>
                  ) : null}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline text-sm">
                  فيسبوك
                </a>
                <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline text-sm">
                  تيك توك
                </a>
                <a
                  href={waLink(settings.whatsappNumber, "مرحباً، لدي استفسار.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-wa text-sm"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  محادثة سريعة
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120} className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-3xl border border-navy/10 shadow-[0_18px_45px_-30px_rgba(10,37,64,0.5)]">
              <iframe
                title="خريطة موقع المكتب"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&z=14&output=embed`}
                className="h-[300px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="card-lux p-6">
              <h2 className="font-display text-xl font-extrabold text-navy">أرسل استفسارك</h2>
              <p className="mt-1.5 text-[13px] text-navy/60">
                تُحفظ الرسالة في نظام المكتب ويتم الرد عليك في أقرب وقت.
              </p>
              <div className="mt-5">
                <ContactForm whatsappNumber={settings.whatsappNumber} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
