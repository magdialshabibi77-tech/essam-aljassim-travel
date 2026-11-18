import type { Metadata } from "next";
import PageShell from "@/components/site/page-shell";
import Reveal from "@/components/site/reveal";
import BookingForm from "@/components/site/booking-form";
import { getBusCompanies, getBusRoutes, getSettings } from "@/lib/data";
import { AVAILABILITY_LABELS, waLink } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/site/navbar";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: `حجوزات الباصات في إب — ${settings.officeName}`,
    description:
      "حجز تذاكر الباصات بين المدن مع شركات النقل البري مثل البركة والمتصدر. أرسل طلب الحجز ويتولى المكتب التحقق من التوفر والتأكيد.",
  };
}

export default async function BusesPage() {
  const [settings, companies, routes] = await Promise.all([
    getSettings(),
    getBusCompanies(),
    getBusRoutes(),
  ]);
  const activeRoutes = routes.filter((route) => route.isActive);
  const cities = Array.from(new Set(companies.flatMap((c) => (Array.isArray(c.cities) ? c.cities : []))));

  return (
    <PageShell settings={settings} services={[]}>
      <section className="relative overflow-hidden navy-mesh py-14 text-white">
        <div className="absolute inset-0 pattern-arabesque opacity-30" aria-hidden="true" />
        <div className="relative container-lux">
          <Reveal>
            <p className="font-display text-sm font-bold text-gold">نقل بري بين المدن</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">حجز تذاكر الباصات</h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/75">
              نستقبل طلبات حجز الباصات مع تحديد المدينة والشركة وتاريخ السفر، ثم نتحقق من التوفر والمواعيد لدى
              شركة النقل ونتواصل معك للتأكيد النهائي.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#booking" className="btn btn-gold">
                نموذج طلب الحجز
              </a>
              <a
                href={waLink(settings.whatsappNumber, "مرحباً، أرغب بحجز تذكرة باص.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa"
              >
                <WhatsAppIcon className="h-4 w-4" />
                واتساب
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-lux">
        <div className="container-lux">
          <div className="grid gap-6 lg:grid-cols-2">
            {companies.map((company, index) => {
              const companyRoutes = activeRoutes.filter((route) => route.companyName === company.name);
              return (
                <Reveal key={company.id} delay={index * 90}>
                  <article className="card-lux overflow-hidden">
                    <div className="relative h-52">
                      {company.coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={company.coverUrl}
                          alt={company.name}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-primary/10" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />
                      {company.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={company.logoUrl}
                          alt={`شعار ${company.name}`}
                          loading="lazy"
                          className="absolute bottom-3 right-3 h-14 w-14 rounded-2xl bg-white/95 object-contain p-1.5 shadow-lg"
                        />
                      ) : null}
                      <div className="absolute left-3 top-3 flex flex-col items-end gap-1.5">
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-extrabold shadow ${
                            company.availability === "available"
                              ? "bg-emerald-500 text-white"
                              : company.availability === "limited"
                                ? "bg-amber-500 text-navy"
                                : "bg-rose-600 text-white"
                          }`}
                        >
                          {AVAILABILITY_LABELS[company.availability] ?? "حالة التوفر"}
                        </span>
                        {company.isOfficialPartner ? (
                          <span className="rounded-full bg-gold px-3 py-1 text-[11px] font-extrabold text-navy shadow">
                            شريك رسمي
                          </span>
                        ) : null}
                      </div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h2 className="font-display text-xl font-extrabold drop-shadow">{company.name}</h2>
                        {company.routeSummary ? (
                          <p className="text-[12px] font-bold text-gold">🛣️ {company.routeSummary}</p>
                        ) : null}
                      </div>
                    </div>
                    <div className="p-5 sm:p-6">
                      <p className="text-[13px] leading-relaxed text-navy/70">{company.description}</p>

                      {Array.isArray(company.cities) && company.cities.length > 0 ? (
                        <div className="mt-4">
                          <p className="text-xs font-extrabold text-navy/60">المدن المخدومة</p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {company.cities.map((city) => (
                              <span
                                key={city}
                                className="rounded-full border border-navy/10 bg-ivory px-2.5 py-1 text-[11px] font-bold text-navy/70"
                              >
                                {city}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {companyRoutes.length > 0 ? (
                        <div className="mt-4">
                          <p className="text-xs font-extrabold text-navy/60">خطوط السير المسجلة</p>
                          <ul className="mt-2 divide-y divide-navy/8 overflow-hidden rounded-2xl border border-navy/10">
                            {companyRoutes.map((route) => (
                              <li key={route.id} className="flex items-center justify-between gap-2 bg-white px-3.5 py-2.5 text-[12px]">
                                <span className="font-extrabold text-navy">
                                  {route.origin} ← {route.destination}
                                </span>
                                <span className="text-navy/55">{route.departureInfo || "حسب جدول الشركة"}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {company.contactInfo ? (
                        <p className="mt-4 rounded-2xl bg-ivory p-3 text-[12px] leading-relaxed text-navy/60">
                          ℹ️ {company.contactInfo}
                        </p>
                      ) : null}

                      <a
                        href={waLink(
                          settings.whatsappNumber,
                          `مرحباً، أرغب بحجز تذكرة باص مع ${company.name}.\nمدينة الانطلاق: \nالمدينة المطلوبة: \nتاريخ السفر: \nعدد المسافرين: `,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-wa mt-4 w-full text-sm"
                      >
                        <WhatsAppIcon className="h-4 w-4" />
                        طلب حجز مع {company.name}
                      </a>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={140} className="mt-12">
            <div id="booking" className="card-lux overflow-hidden">
              <div className="navy-mesh p-7 text-white">
                <div className="absolute inset-0 pattern-arabesque opacity-20" aria-hidden="true" />
                <h2 className="relative font-display text-2xl font-extrabold text-gold">نموذج طلب حجز باص</h2>
                <p className="relative mt-2 text-[13px] leading-relaxed text-white/75">
                  جميع الحقول تُرسل إلى المكتب للمراجعة. لا يتم إصدار تذكرة مؤكدة إلا بعد التحقق من التوفر والتواصل معك.
                </p>
              </div>
              <div className="p-6 sm:p-7">
                <BookingForm
                  type="bus"
                  serviceTitle="حجز تذاكر باص"
                  whatsappNumber={settings.whatsappNumber}
                  companies={companies.map((c) => ({ id: c.id, name: c.name }))}
                  cityOptions={cities}
                  submitLabel="إرسال طلب الحجز"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
