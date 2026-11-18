import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/site/page-shell";
import Reveal from "@/components/site/reveal";
import { getOffers, getSettings } from "@/lib/data";
import { formatDate, priceLabel, waLink } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/site/navbar";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: `العروض والبرامج — ${settings.officeName}`,
    description:
      "عروض وبرامج مكتب عصام الجسيم للسفريات والسياحة: برامج العمرة، عروض تذاكر الطيران، برامج الزيارة، برامج سياحية وخدمات إضافية.",
  };
}

export default async function OffersPage() {
  const [settings, offers] = await Promise.all([getSettings(), getOffers()]);
  const categories = Array.from(new Set(offers.map((offer) => offer.category)));

  return (
    <PageShell settings={settings} services={[]}>
      <section className="relative overflow-hidden navy-mesh py-14 text-white">
        <div className="absolute inset-0 pattern-arabesque opacity-30" aria-hidden="true" />
        <div className="relative container-lux">
          <Reveal>
            <p className="font-display text-sm font-bold text-gold">برامج مختارة</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">العروض والبرامج</h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/75">
              تُحدَّث العروض من إدارة المكتب بشكل مستمر. الأسعار والمواعيد تُرسل لك بدقة عند التواصل لأنها تختلف
              حسب الموسم والتوفر.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-lux">
        <div className="container-lux">
          {categories.length > 0 ? (
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full border border-navy/10 bg-white px-4 py-2 text-xs font-extrabold text-navy/70 shadow-sm"
                >
                  {category}
                </span>
              ))}
            </div>
          ) : null}

          {offers.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-navy/20 bg-white p-10 text-center">
              <p className="text-3xl">🗂️</p>
              <h2 className="mt-3 font-display text-lg font-extrabold text-navy">لا توجد عروض منشورة حالياً</h2>
              <p className="mt-2 text-[13px] text-navy/65">
                يمكنك التواصل مع المكتب مباشرة لمعرفة البرامج المتوفرة.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {offers.map((offer, index) => (
                <Reveal key={offer.id} delay={index * 80}>
                  <article className="card-lux group flex h-full flex-col overflow-hidden">
                    <div className="relative h-52 overflow-hidden">
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
                      <span
                        className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-extrabold shadow ${
                          offer.isAvailable ? "bg-emerald-500 text-white" : "bg-rose-600 text-white"
                        }`}
                      >
                        {offer.isAvailable ? "متاح" : "غير متاح"}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h2 className="font-display text-lg font-extrabold text-navy">{offer.title}</h2>
                      <p className="mt-2 flex-1 text-[13px] leading-relaxed text-navy/65">{offer.summary}</p>
                      {offer.startAt || offer.endAt ? (
                        <p className="mt-3 text-[12px] font-bold text-primary/80">
                          🗓️ {offer.startAt ? formatDate(offer.startAt) : "—"} ← {offer.endAt ? formatDate(offer.endAt) : "—"}
                        </p>
                      ) : null}
                      <p className="mt-3 rounded-xl bg-gold/10 px-3 py-2 text-center text-[13px] font-extrabold text-navy">
                        {priceLabel(offer.price)}
                      </p>
                      <div className="mt-4 flex gap-2">
                        <Link href={`/offers/${offer.slug}`} className="btn btn-primary flex-1 !py-2.5 text-[13px]">
                          اطلب الآن
                        </Link>
                        <a
                          href={waLink(settings.whatsappNumber, `مرحباً، أرغب بالاستفسار عن: ${offer.title}`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-wa !px-3 !py-2.5"
                          aria-label={`استفسار واتساب عن ${offer.title}`}
                        >
                          <WhatsAppIcon className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
