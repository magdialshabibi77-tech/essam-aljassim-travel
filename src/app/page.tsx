import Link from "next/link";
import Navbar, { WhatsAppIcon } from "@/components/site/navbar";
import Footer from "@/components/site/footer";
import WhatsAppFloat from "@/components/site/whatsapp-float";
import Reveal from "@/components/site/reveal";
import SectionHeading from "@/components/site/section-heading";
import BookingForm from "@/components/site/booking-form";
import FaqAccordion from "@/components/site/faq-accordion";
import ContactForm from "@/components/site/contact-form";
import {
  getBenefits,
  getBusCompanies,
  getBusRoutes,
  getFaqs,
  getOffers,
  getSections,
  getServices,
  getSettings,
  getStats,
  getTestimonials,
} from "@/lib/data";
import { AVAILABILITY_LABELS, iconFor, priceLabel, telLink, waLink } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, sections, services, offers, companies, routes, benefits, stats, faqs, testimonials] =
    await Promise.all([
      getSettings(),
      getSections(),
      getServices(),
      getOffers(),
      getBusCompanies(),
      getBusRoutes(),
      getBenefits(),
      getStats(),
      getFaqs(),
      getTestimonials(),
    ]);

  const show = (key: string) => sections[key]?.isVisible !== false;
  const section = (key: string, fallbackTitle = "", fallbackSub = "") => ({
    title: sections[key]?.title || fallbackTitle,
    subtitle: sections[key]?.subtitle || fallbackSub,
    description: sections[key]?.description || "",
  });

  const homeServices = services.filter((s) => s.showOnHome).slice(0, 6);
  const homeOffers = offers.filter((o) => o.showOnHome).slice(0, 4);
  const activeRoutes = routes.filter((r) => r.isActive);
  const cities = Array.from(
    new Set(companies.flatMap((c) => (Array.isArray(c.cities) ? c.cities : []))),
  );
  const companyOptions = companies.map((c) => ({ id: c.id, name: c.name }));
  const waHero = waLink(settings.whatsappNumber);
  const heroImage = sections.hero?.imageUrl || "";

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar
        officeName={settings.officeName}
        tagline={settings.tagline}
        logoUrl={settings.logoUrl}
        phone={settings.phone}
        whatsapp={settings.whatsappNumber}
        availabilityLabel={
          settings.availabilityStatus === "open" ? "المكتب مفتوح الآن" : "حالة المكتب تُحدَّث من الإدارة"
        }
      />

      <main>
        {/* ============================ HERO ============================ */}
        {show("hero") ? (
          <section className="relative overflow-hidden navy-mesh text-white">
            <div className="absolute inset-0 pattern-arabesque opacity-25" aria-hidden="true" />
            {heroImage ? (
              <div className="absolute inset-0" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroImage}
                  alt="مكتب عصام الجسيم للسفريات والسياحة - خدمات السفر والحج والعمرة"
                  className="h-full w-full object-cover opacity-45"
                  fetchPriority="high"
                />
              </div>
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-l from-navy/95 via-navy/85 to-primary/70" aria-hidden="true" />
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gold/20 blur-3xl animate-float" aria-hidden="true" />

            <div className="relative container-lux grid items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
              <div className="flex flex-col items-start gap-6">
                <Reveal className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/10 px-4 py-2 text-xs font-extrabold text-gold backdrop-blur-md">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-gold" />
                  {settings.availabilityStatus === "open"
                    ? "نستقبل طلباتكم الآن — خدمة مباشرة من المكتب"
                    : "تواصل معنا عبر واتساب في أي وقت"}
                </Reveal>

                <Reveal delay={80}>
                  <p className="font-display text-sm font-bold tracking-wide text-gold sm:text-base">
                    {sections.hero?.subtitle || settings.tagline}
                  </p>
                  <h1 className="mt-3 font-display text-[2rem] font-extrabold leading-[1.28] sm:text-[2.6rem] lg:text-[3.3rem]">
                    {sections.hero?.title || "رحلتك تبدأ من هنا... وخدمات السفر بين يديك"}
                  </h1>
                </Reveal>

                <Reveal delay={160}>
                  <p className="max-w-xl text-[15px] leading-relaxed text-white/80 sm:text-base">
                    {sections.hero?.description || settings.aboutText}
                  </p>
                </Reveal>

                <Reveal delay={240} className="flex w-full flex-wrap gap-3">
                  <Link href="#services" className="btn btn-gold">
                    استعرض خدماتنا
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                      <path d="M14 7l-1.4 1.4L15.2 11H6v2h9.2l-2.6 2.6L14 17l5-5z" />
                    </svg>
                  </Link>
                  <a
                    href={waHero}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-wa"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    تواصل معنا عبر واتساب
                  </a>
                  <a href={telLink(settings.phone)} className="btn btn-ghost-light">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                      <path d="M6.6 10.8c1.3 2.5 3.1 4.3 5.6 5.6l2-2c.3-.3.7-.4 1.1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V19c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.2c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1.1l-2 2z" />
                    </svg>
                    <span dir="ltr">{settings.phone}</span>
                  </a>
                </Reveal>

                <Reveal delay={320} className="mt-2 grid w-full gap-3 sm:grid-cols-3">
                  {[
                    { icon: "🛂", title: "تأشيرات", text: "زيارة • عمل • علاج • دراسة" },
                    { icon: "✈️", title: "تذاكر طيران", text: "استفسار وحجز لكل الوجهات" },
                    { icon: "🚌", title: "حجز باصات", text: "البركة والمتصدر وغيرها" },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/15"
                    >
                      <p className="text-xl">{item.icon}</p>
                      <p className="mt-1 text-sm font-extrabold">{item.title}</p>
                      <p className="text-[11px] text-white/70">{item.text}</p>
                    </div>
                  ))}
                </Reveal>
              </div>

              <Reveal delay={200} variant="zoom" className="relative hidden lg:block">
                <div className="relative overflow-hidden rounded-[2rem] border border-white/20 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]">
                  {heroImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={heroImage}
                      alt="الحج والعمرة وخدمات السفر"
                      className="h-[420px] w-full object-cover"
                    />
                  ) : (
                    <div className="h-[420px] w-full bg-primary/40" />
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy via-navy/70 to-transparent p-5">
                    <p className="font-display text-lg font-extrabold">{settings.officeName}</p>
                    <p className="text-xs text-white/70">{settings.address}</p>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 flex items-center gap-2 rounded-2xl bg-white/95 p-3 shadow-xl">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500 text-white">
                    <WhatsAppIcon className="h-5 w-5" />
                  </span>
                  <div className="leading-tight">
                    <p className="text-[11px] font-bold text-navy/60">رد سريع عبر</p>
                    <p className="text-sm font-extrabold text-navy">واتساب المكتب</p>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="relative border-t border-white/10 bg-navy/40">
              <div className="container-lux flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-3 text-[11px] font-bold text-white/60 sm:text-xs">
                <span>الحج والعمرة</span>
                <span className="text-gold/50">✦</span>
                <span>تأشيرات المملكة والزيارات</span>
                <span className="text-gold/50">✦</span>
                <span>تذاكر الطيران</span>
                <span className="text-gold/50">✦</span>
                <span>حجوزات الباصات</span>
                <span className="text-gold/50">✦</span>
                <span>برامج الزيارة والسفر</span>
              </div>
            </div>
          </section>
        ) : null}

        {/* ============================ SERVICES ============================ */}
        {show("services") ? (
          <section id="services" className="section-lux">
            <div className="container-lux">
              <SectionHeading
                kicker="خدماتنا"
                subtitle={section("services").subtitle}
                title={section("services").title}
                description={section("services").description}
              />
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {homeServices.map((service, index) => (
                  <Reveal key={service.id} delay={index * 90}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="card-lux group flex h-full flex-col overflow-hidden"
                    >
                      <div className="relative h-44 overflow-hidden">
                        {service.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={service.imageUrl}
                            alt={service.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="h-full w-full bg-primary/10" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />
                        <span className="absolute bottom-3 right-4 grid h-11 w-11 place-items-center rounded-2xl bg-white/95 text-xl shadow-lg transition group-hover:scale-110">
                          {iconFor(service.icon)}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="font-display text-lg font-extrabold text-navy">{service.title}</h3>
                        <p className="mt-2 flex-1 text-[13px] leading-relaxed text-navy/65">
                          {service.shortDescription}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-primary transition group-hover:gap-3">
                          تفاصيل الخدمة
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                            <path d="M14 7l-1.4 1.4L15.2 11H6v2h9.2l-2.6 2.6L14 17l5-5z" />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* ============================ OFFERS ============================ */}
        {show("offers") ? (
          <section id="offers" className="section-lux relative overflow-hidden bg-white">
            <div className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" aria-hidden="true" />
            <div className="container-lux relative">
              <div className="flex flex-col items-center gap-6">
                <SectionHeading
                  kicker="عروض وبرامج"
                  subtitle={section("offers").subtitle}
                  title={section("offers").title}
                  description={section("offers").description}
                />
                <Reveal delay={100}>
                  <Link href="/offers" className="btn btn-outline text-sm">
                    عرض جميع العروض والبرامج
                  </Link>
                </Reveal>
              </div>

              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {homeOffers.map((offer, index) => (
                  <Reveal key={offer.id} delay={index * 90}>
                    <div className="card-lux group flex h-full flex-col overflow-hidden">
                      <div className="relative h-48 overflow-hidden">
                        {offer.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={offer.imageUrl}
                            alt={offer.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="h-full w-full bg-primary/10" />
                        )}
                        <span className="absolute right-3 top-3 rounded-full bg-gold px-3 py-1 text-[11px] font-extrabold text-navy shadow">
                          {offer.category}
                        </span>
                        {!offer.isAvailable ? (
                          <span className="absolute left-3 top-3 rounded-full bg-rose-600 px-3 py-1 text-[11px] font-extrabold text-white shadow">
                            غير متاح حالياً
                          </span>
                        ) : null}
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="font-display text-[17px] font-extrabold text-navy">{offer.title}</h3>
                        <p className="mt-2 flex-1 text-[13px] leading-relaxed text-navy/65">{offer.summary}</p>
                        <p className="mt-3 rounded-xl bg-gold/10 px-3 py-2 text-center text-[13px] font-extrabold text-navy">
                          {priceLabel(offer.price)}
                        </p>
                        <div className="mt-4 flex gap-2">
                          <Link href={`/offers/${offer.slug}`} className="btn btn-primary flex-1 !py-2.5 text-[13px]">
                            اطلب الآن
                          </Link>
                          <a
                            href={waLink(
                              settings.whatsappNumber,
                              `مرحباً، أرغب بالاستفسار عن: ${offer.title}`,
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-wa !px-3 !py-2.5"
                            aria-label={`استفسار واتساب عن ${offer.title}`}
                          >
                            <WhatsAppIcon className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* ============================ BUSES ============================ */}
        {show("buses") ? (
          <section id="buses" className="section-lux relative overflow-hidden navy-mesh text-white">
            <div className="absolute inset-0 pattern-arabesque opacity-25" aria-hidden="true" />
            <div className="container-lux relative">
              <SectionHeading
                kicker="حجوزات الباصات"
                tone="light"
                subtitle={section("buses").subtitle}
                title={section("buses").title}
                description={section("buses").description}
              />

              <div className="mt-12 grid gap-6 lg:grid-cols-3">
                {companies.map((company, index) => (
                  <Reveal key={company.id} delay={index * 90}>
                    <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/15 bg-white/8 backdrop-blur-md transition hover:-translate-y-2 hover:border-gold/40">
                      <div className="relative h-40 overflow-hidden">
                        {company.coverUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={company.coverUrl}
                            alt={company.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="h-full w-full bg-primary/30" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 to-transparent" />
                        {company.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={company.logoUrl}
                            alt={`شعار ${company.name}`}
                            loading="lazy"
                            className="absolute bottom-3 right-3 h-12 w-12 rounded-xl bg-white/90 object-contain p-1 shadow"
                          />
                        ) : null}
                        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold shadow ${
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
                            <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] font-extrabold text-navy shadow">
                              شريك رسمي
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="font-display text-lg font-extrabold">{company.name}</h3>
                        <p className="mt-2 text-[13px] leading-relaxed text-white/70">{company.description}</p>
                        {company.routeSummary ? (
                          <p className="mt-3 rounded-xl bg-white/10 px-3 py-2 text-[12px] font-bold text-gold">
                            🛣️ {company.routeSummary}
                          </p>
                        ) : null}
                        {Array.isArray(company.cities) && company.cities.length > 0 ? (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {company.cities.slice(0, 6).map((city) => (
                              <span
                                key={city}
                                className="rounded-full border border-white/20 px-2.5 py-1 text-[11px] font-semibold text-white/75"
                              >
                                {city}
                              </span>
                            ))}
                          </div>
                        ) : null}
                        {activeRoutes.filter((route) => route.companyName === company.name).length > 0 ? (
                          <ul className="mt-3 space-y-1.5 text-[12px] text-white/70">
                            {activeRoutes
                              .filter((route) => route.companyName === company.name)
                              .slice(0, 3)
                              .map((route) => (
                                <li key={route.id} className="flex items-center gap-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                                  <span>
                                    {route.origin} ← {route.destination}
                                    {route.departureInfo ? ` — ${route.departureInfo}` : ""}
                                  </span>
                                </li>
                              ))}
                          </ul>
                        ) : null}
                        {company.contactInfo ? (
                          <p className="mt-3 text-[11px] text-white/50">{company.contactInfo}</p>
                        ) : null}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={120} className="mt-10">
                <div className="overflow-hidden rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl">
                  <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
                    <div className="relative border-b border-white/10 p-7 lg:border-b-0 lg:border-l">
                      <div className="absolute inset-0 pattern-arabesque opacity-30" aria-hidden="true" />
                      <div className="relative">
                        <h3 className="font-display text-2xl font-extrabold text-gold">نموذج طلب حجز باص</h3>
                        <p className="mt-3 text-[13px] leading-relaxed text-white/75">
                          املأ البيانات التالية وسيتولى المكتب مراجعة الطلب والتحقق من التوفر والمواعيد لدى شركة
                          النقل، ثم التواصل معك للتأكيد النهائي.
                        </p>
                        <ul className="mt-5 space-y-2.5 text-[13px] text-white/80">
                          {[
                            "الطلب يُحفظ في نظام المكتب ويظهر في لوحة التحكم",
                            "رسالة واتساب جاهزة تُرسل مع بيانات طلبك",
                            "لا يُعتبر الطلب حجزاً مؤكداً قبل مراجعة المكتب",
                          ].map((item) => (
                            <li key={item} className="flex items-start gap-2">
                              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold/20 text-[11px] text-gold">
                                ✓
                              </span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="bg-white/95 p-7 text-navy">
                      <BookingForm
                        type="bus"
                        serviceTitle="حجز تذاكر باص"
                        whatsappNumber={settings.whatsappNumber}
                        companies={companyOptions}
                        cityOptions={cities}
                        submitLabel="إرسال طلب الحجز"
                      />
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        ) : null}

        {/* ============================ BENEFITS ============================ */}
        {show("benefits") ? (
          <section id="why" className="section-lux">
            <div className="container-lux">
              <SectionHeading
                kicker="لماذا نحن"
                subtitle={section("benefits").subtitle}
                title={section("benefits").title}
                description={section("benefits").description}
              />
              <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {benefits.map((benefit, index) => (
                  <Reveal key={benefit.id} delay={index * 70}>
                    <div className="card-lux h-full p-6">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-navy text-xl shadow-md">
                        {iconFor(benefit.icon)}
                      </span>
                      <h3 className="mt-4 font-display text-[17px] font-extrabold text-navy">{benefit.title}</h3>
                      <p className="mt-2 text-[13px] leading-relaxed text-navy/65">{benefit.description}</p>
                    </div>
                  </Reveal>
                ))}
              </div>

              {stats.length > 0 && show("stats") ? (
                <Reveal delay={150} className="mt-10">
                  <div className="grid gap-4 rounded-3xl border border-navy/10 bg-white p-6 shadow-[0_18px_45px_-30px_rgba(10,37,64,0.5)] sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                      <div key={stat.id} className="text-center">
                        <p className="font-display text-2xl font-extrabold text-gradient-gold sm:text-3xl">
                          {stat.value}
                        </p>
                        <p className="mt-1 text-xs font-bold text-navy/60">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </Reveal>
              ) : null}
            </div>
          </section>
        ) : null}

        {/* ============================ TESTIMONIALS ============================ */}

        {show("testimonials") ? (
          <section className="section-lux bg-white">
            <div className="container-lux">
              <SectionHeading
                kicker="آراء العملاء"
                subtitle={section("testimonials").subtitle}
                title={section("testimonials").title}
                description={section("testimonials").description}
              />
              {testimonials.length > 0 ? (
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {testimonials.map((item, index) => (
                    <Reveal key={item.id} delay={index * 80}>
                      <figure className="card-lux h-full p-6">
                        <div className="flex items-center gap-1 text-gold" aria-label={`تقييم ${item.rating} من 5`}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < item.rating ? "opacity-100" : "opacity-25"}>
                              ★
                            </span>
                          ))}
                        </div>
                        <blockquote className="mt-3 text-[14px] leading-relaxed text-navy/75">
                          “{item.content}”
                        </blockquote>
                        <figcaption className="mt-4 flex items-center gap-3 border-t border-navy/10 pt-4">
                          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-sm font-extrabold text-primary">
                            {item.name.slice(0, 1)}
                          </span>
                          <span className="leading-tight">
                            <span className="block text-sm font-extrabold text-navy">{item.name}</span>
                            <span className="block text-[11px] text-navy/55">{item.city}</span>
                          </span>
                        </figcaption>
                      </figure>
                    </Reveal>
                  ))}
                </div>
              ) : (
                <Reveal delay={100} className="mt-12">
                  <div className="mx-auto max-w-2xl rounded-3xl border border-dashed border-navy/20 bg-ivory p-8 text-center">
                    <p className="text-3xl">💬</p>
                    <h3 className="mt-3 font-display text-lg font-extrabold text-navy">
                      آراء العملاء قيد التحديث
                    </h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-navy/65">
                      لا نعرض أي تقييم غير مدخل فعلياً من إدارة المكتب. تُضاف تجارب العملاء الحقيقية من لوحة
                      التحكم بعد تأكيدها.
                    </p>
                  </div>
                </Reveal>
              )}
            </div>
          </section>
        ) : null}

        {/* ============================ FAQ ============================ */}
        {show("faq") ? (
          <section id="faq" className="section-lux">
            <div className="container-lux">
              <SectionHeading
                kicker="الأسئلة الشائعة"
                subtitle={section("faq").subtitle}
                title={section("faq").title}
                description={section("faq").description}
              />
              <div className="mt-10">
                <FaqAccordion
                  items={faqs.map((faq) => ({ id: faq.id, question: faq.question, answer: faq.answer }))}
                />
              </div>
            </div>
          </section>
        ) : null}

        {/* ============================ CONTACT + MAP ============================ */}
        {show("contact") ? (
          <section id="contact" className="section-lux bg-white">
            <div className="container-lux">
              <SectionHeading
                kicker="تواصل معنا"
                subtitle={section("contact").subtitle}
                title={section("contact").title}
                description={section("contact").description}
              />
              <div className="mt-12 grid gap-6 lg:grid-cols-2">
                <Reveal>
                  <div className="card-lux h-full p-6 sm:p-7">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <a
                        href={telLink(settings.phone)}
                        className="rounded-2xl border border-navy/10 bg-ivory p-4 transition hover:-translate-y-1 hover:border-gold/50"
                      >
                        <p className="text-xs font-bold text-navy/55">اتصال مباشر</p>
                        <p dir="ltr" className="mt-1 font-display text-base font-extrabold text-navy">
                          {settings.phone}
                        </p>
                      </a>
                      <a
                        href={waHero}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 transition hover:-translate-y-1"
                      >
                        <p className="text-xs font-bold text-emerald-700/70">واتساب المكتب</p>
                        <p dir="ltr" className="mt-1 font-display text-base font-extrabold text-emerald-800">
                          {settings.whatsappNumber}
                        </p>
                      </a>
                      <a
                        href={settings.mapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-2xl border border-navy/10 bg-ivory p-4 transition hover:-translate-y-1 hover:border-gold/50 sm:col-span-2"
                      >
                        <p className="text-xs font-bold text-navy/55">مقر المكتب</p>
                        <p className="mt-1 text-sm font-extrabold text-navy">{settings.address}</p>
                      </a>
                      <div className="rounded-2xl border border-navy/10 bg-ivory p-4 sm:col-span-2">
                        <p className="text-xs font-bold text-navy/55">أوقات العمل</p>
                        <p className="mt-1 text-sm font-extrabold text-navy">{settings.workingHours}</p>
                        {settings.workingHoursNote ? (
                          <p className="mt-1 text-[12px] text-navy/60">{settings.workingHoursNote}</p>
                        ) : null}
                      </div>
                    </div>
                    <div className="mt-6 border-t border-navy/10 pt-6">
                      <h3 className="font-display text-lg font-extrabold text-navy">أرسل استفسارك</h3>
                      <p className="mb-4 mt-1 text-[13px] text-navy/60">
                        اكتب استفسارك وسيتم حفظه في نظام المكتب والرد عليك في أقرب وقت.
                      </p>
                      <ContactForm whatsappNumber={settings.whatsappNumber} />
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={120}>
                  <div className="flex h-full flex-col gap-4">
                    <div className="overflow-hidden rounded-3xl border border-navy/10 shadow-[0_18px_45px_-30px_rgba(10,37,64,0.5)]">
                      <iframe
                        title="موقع المكتب على الخريطة"
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&z=14&output=embed`}
                        className="h-[320px] w-full border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                    <a
                      href={settings.mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary w-full"
                    >
                      📍 فتح موقع المكتب في خرائط Google
                    </a>
                    <div className="rounded-3xl border border-navy/10 bg-ivory p-6">
                      <h3 className="font-display text-base font-extrabold text-navy">تابعنا</h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline text-sm">
                          فيسبوك
                        </a>
                        <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline text-sm">
                          تيك توك
                        </a>
                        <a href={waHero} target="_blank" rel="noopener noreferrer" className="btn btn-wa text-sm">
                          واتساب
                        </a>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
        ) : null}

        {/* ============================ CTA ============================ */}
        {show("cta") ? (
          <section className="relative overflow-hidden navy-mesh py-16 text-white">
            <div className="absolute inset-0 pattern-arabesque opacity-30" aria-hidden="true" />
            <div className="absolute -bottom-24 right-1/4 h-64 w-64 rounded-full bg-gold/20 blur-3xl animate-float" aria-hidden="true" />
            <div className="relative container-lux flex flex-col items-center gap-6 text-center">
              <Reveal>
                <p className="font-display text-sm font-bold text-gold">{section("cta").subtitle}</p>
                <h2 className="mt-3 font-display text-3xl font-extrabold leading-snug sm:text-4xl">
                  {section("cta").title}
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-[15px] text-white/75">
                  {section("cta").description}
                </p>
              </Reveal>
              <Reveal delay={120} className="flex flex-wrap items-center justify-center gap-3">
                <a href={waHero} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
                  <WhatsAppIcon className="h-4 w-4" />
                  محادثة واتساب الآن
                </a>
                <a href={telLink(settings.phone)} className="btn btn-gold">
                  اتصال مباشر
                </a>
                <Link href="/services" className="btn btn-ghost-light">
                  استعرض الخدمات
                </Link>
              </Reveal>
            </div>
          </section>
        ) : null}
      </main>

      <Footer
        settings={{
          officeName: settings.officeName,
          officeShortName: settings.officeShortName,
          tagline: settings.tagline,
          logoUrl: settings.logoUrl,
          phone: settings.phone,
          phoneSecondary: settings.phoneSecondary,
          whatsappLink: settings.whatsappLink,
          whatsappNumber: settings.whatsappNumber,
          address: settings.address,
          mapsLink: settings.mapsLink,
          facebookUrl: settings.facebookUrl,
          tiktokUrl: settings.tiktokUrl,
          workingHours: settings.workingHours,
          workingHoursNote: settings.workingHoursNote,
          copyrightText: settings.copyrightText,
          footerNote: settings.footerNote,
          aboutText: settings.aboutText,
        }}
        serviceLinks={services.map((service) => ({
          href: `/services/${service.slug}`,
          label: service.title,
        }))}
      />

      <WhatsAppFloat
        whatsapp={settings.whatsappNumber}
        enabled={settings.whatsappPopupEnabled}
        title={settings.whatsappPopupTitle}
        message={settings.whatsappPopupMessage}
        buttonLabel={settings.whatsappPopupButton}
        delayMs={settings.whatsappPopupDelay}
      />
    </div>
  );
}
