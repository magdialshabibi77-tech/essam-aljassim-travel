import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageShell from "@/components/site/page-shell";
import Reveal from "@/components/site/reveal";
import BookingForm from "@/components/site/booking-form";
import { getServices, getServiceBySlug, getSettings } from "@/lib/data";
import { iconFor, telLink, waLink } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/site/navbar";

export const dynamic = "force-dynamic";

const TYPE_BY_SLUG: Record<string, "bus" | "flight" | "visa" | "umrah" | "service"> = {
  "bus-booking": "bus",
  "flight-tickets": "flight",
  "saudi-visas": "visa",
  "hajj-umrah": "umrah",
};

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const [settings, service] = await Promise.all([getSettings(), getServiceBySlug(slug)]);
  if (!service) return { title: "الخدمة غير متوفرة" };
  return {
    title: `${service.title} — ${settings.officeName}`,
    description: service.shortDescription || service.description.slice(0, 160),
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const [settings, service, services] = await Promise.all([
    getSettings(),
    getServiceBySlug(slug),
    getServices(),
  ]);
  if (!service) notFound();

  const bookingType = TYPE_BY_SLUG[service.slug] ?? "service";
  const features = Array.isArray(service.features) ? service.features : [];
  const others = services.filter((item) => item.slug !== service.slug).slice(0, 3);

  return (
    <PageShell settings={settings} services={services}>
      <section className="relative overflow-hidden navy-mesh py-14 text-white">
        <div className="absolute inset-0 pattern-arabesque opacity-25" aria-hidden="true" />
        <div className="relative container-lux">
          <Reveal>
            <nav className="flex items-center gap-2 text-xs font-bold text-white/60" aria-label="مسار التنقل">
              <Link href="/" className="hover:text-white">
                الرئيسية
              </Link>
              <span>/</span>
              <Link href="/services" className="hover:text-white">
                الخدمات
              </Link>
              <span>/</span>
              <span className="text-gold">{service.title}</span>
            </nav>
            <h1 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">{service.title}</h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/75">
              {service.shortDescription}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#request" className="btn btn-gold">
                إرسال طلب / استفسار
              </a>
              <a
                href={waLink(settings.whatsappNumber, `مرحباً، أرغب بالاستفسار عن خدمة: ${service.title}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa"
              >
                <WhatsAppIcon className="h-4 w-4" />
                واتساب
              </a>
              <a href={telLink(settings.phone)} className="btn btn-ghost-light">
                <span dir="ltr">{settings.phone}</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-lux">
        <div className="container-lux grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <div className="card-lux overflow-hidden">
              {service.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="h-72 w-full object-cover"
                  loading="lazy"
                />
              ) : null}
              <div className="p-6 sm:p-8">
                <span className="inline-flex items-center gap-2 rounded-full bg-gold/12 px-3 py-1.5 text-xs font-extrabold text-primary ring-1 ring-gold/30">
                  <span>{iconFor(service.icon)}</span> خدمة مقدمة من {settings.officeShortName}
                </span>
                <h2 className="mt-4 font-display text-2xl font-extrabold text-navy">تفاصيل الخدمة</h2>
                <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-navy/70">
                  {service.description}
                </p>

                {features.length > 0 ? (
                  <>
                    <h3 className="mt-8 font-display text-lg font-extrabold text-navy">ما تشمله الخدمة</h3>
                    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                      {features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 rounded-2xl border border-navy/10 bg-ivory p-3.5 text-[13px] font-semibold text-navy/80"
                        >
                          <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-500 text-[11px] text-white">
                            ✓
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}

                <div className="mt-8 rounded-2xl border border-gold/40 bg-gold/8 p-5">
                  <p className="text-[13px] font-bold leading-relaxed text-navy/80">
                    ملاحظة مهمة: الطلب المرسل من الموقع يُعتبر طلب حجز أو استفسار يُراجعه المكتب، ولا يُعتبر تأكيداً
                    نهائياً إلا بعد التحقق من التوفر والتواصل معك.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:sticky lg:top-24 lg:self-start">
            <div id="request" className="card-lux p-6 sm:p-7">
              <h2 className="font-display text-xl font-extrabold text-navy">إرسال طلب أو استفسار</h2>
              <p className="mt-2 text-[13px] leading-relaxed text-navy/60">
                لا تجمع النماذج أي مستندات شخصية. تتم مشاركة المستندات لاحقاً عبر القنوات الآمنة المعتمدة من المكتب.
              </p>
              <div className="mt-5">
                <BookingForm
                  type={bookingType}
                  serviceTitle={service.title}
                  whatsappNumber={settings.whatsappNumber}
                  submitLabel="إرسال الطلب"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {others.length > 0 ? (
        <section className="section-lux bg-white">
          <div className="container-lux">
            <h2 className="font-display text-2xl font-extrabold text-navy">خدمات أخرى</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {others.map((item, index) => (
                <Reveal key={item.id} delay={index * 80}>
                  <Link href={`/services/${item.slug}`} className="card-lux flex h-full flex-col p-5 hover-lift">
                    <span className="text-2xl">{iconFor(item.icon)}</span>
                    <h3 className="mt-3 font-display text-base font-extrabold text-navy">{item.title}</h3>
                    <p className="mt-2 flex-1 text-[13px] leading-relaxed text-navy/65">
                      {item.shortDescription}
                    </p>
                    <span className="mt-4 text-sm font-extrabold text-primary">عرض التفاصيل ←</span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </PageShell>
  );
}
