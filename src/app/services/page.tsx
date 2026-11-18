import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/site/page-shell";
import SectionHeading from "@/components/site/section-heading";
import Reveal from "@/components/site/reveal";
import { getServices, getSettings } from "@/lib/data";
import { iconFor, waLink } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/site/navbar";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: `خدمات المكتب — ${settings.officeName}`,
    description:
      "خدمات مكتب عصام الجسيم للسفريات والسياحة: الحج والعمرة، تأشيرات المملكة والزيارات، تذاكر الطيران، وحجوزات الباصات في إب - اليمن.",
  };
}

export default async function ServicesPage() {
  const [settings, services] = await Promise.all([getSettings(), getServices()]);

  return (
    <PageShell settings={settings} services={services}>
      <section className="relative overflow-hidden navy-mesh py-14 text-white">
        <div className="absolute inset-0 pattern-arabesque opacity-30" aria-hidden="true" />
        <div className="relative container-lux">
          <Reveal>
            <p className="font-display text-sm font-bold text-gold">كل ما تحتاجه لرحلتك</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">خدمات المكتب</h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/75">
              نقدم خدمات السفر والحجوزات ومتابعة معاملات التأشيرات وبرامج الحج والعمرة. اختر الخدمة المناسبة
              وأرسل طلبك، وسيتولى المكتب مراجعته والتواصل معك.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-lux">
        <div className="container-lux">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Reveal key={service.id} delay={index * 80}>
                <div className="card-lux group flex h-full flex-col overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent" />
                    <span className="absolute bottom-3 right-4 grid h-11 w-11 place-items-center rounded-2xl bg-white/95 text-xl shadow-lg">
                      {iconFor(service.icon)}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="font-display text-lg font-extrabold text-navy">{service.title}</h2>
                    <p className="mt-2 text-[13px] leading-relaxed text-navy/65">{service.shortDescription}</p>
                    {Array.isArray(service.features) && service.features.length > 0 ? (
                      <ul className="mt-3 space-y-1.5 text-[12px] text-navy/70">
                        {service.features.slice(0, 4).map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    <div className="mt-5 flex gap-2">
                      <Link href={`/services/${service.slug}`} className="btn btn-primary flex-1 !py-2.5 text-[13px]">
                        تفاصيل وطلب الخدمة
                      </Link>
                      <a
                        href={waLink(settings.whatsappNumber, `مرحباً، أرغب بالاستفسار عن خدمة: ${service.title}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-wa !px-3 !py-2.5"
                        aria-label={`استفسار واتساب عن ${service.title}`}
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
    </PageShell>
  );
}
