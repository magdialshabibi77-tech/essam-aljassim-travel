import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageShell from "@/components/site/page-shell";
import Reveal from "@/components/site/reveal";
import BookingForm from "@/components/site/booking-form";
import { getOfferBySlug, getOffers, getSettings } from "@/lib/data";
import { formatDate, priceLabel, telLink, waLink } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/site/navbar";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const [settings, offer] = await Promise.all([getSettings(), getOfferBySlug(slug)]);
  if (!offer) return { title: "العرض غير متوفر" };
  return {
    title: `${offer.title} — ${settings.officeName}`,
    description: offer.summary || offer.details.slice(0, 160),
    alternates: { canonical: `/offers/${offer.slug}` },
  };
}

export default async function OfferDetailPage({ params }: Params) {
  const { slug } = await params;
  const [settings, offer, offers] = await Promise.all([getSettings(), getOfferBySlug(slug), getOffers()]);
  if (!offer) notFound();

  const gallery = Array.isArray(offer.gallery) ? offer.gallery.filter(Boolean) : [];
  const bookingType = offer.category.includes("عمرة")
    ? "umrah"
    : offer.category.includes("طيران")
      ? "flight"
      : offer.category.includes("زيارة")
        ? "visa"
        : "service";

  return (
    <PageShell settings={settings} services={[]}>
      <section className="relative overflow-hidden navy-mesh py-14 text-white">
        <div className="absolute inset-0 pattern-arabesque opacity-25" aria-hidden="true" />
        <div className="relative container-lux">
          <Reveal>
            <nav className="flex items-center gap-2 text-xs font-bold text-white/60" aria-label="مسار التنقل">
              <Link href="/" className="hover:text-white">
                الرئيسية
              </Link>
              <span>/</span>
              <Link href="/offers" className="hover:text-white">
                العروض
              </Link>
              <span>/</span>
              <span className="text-gold">{offer.title}</span>
            </nav>
            <h1 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">{offer.title}</h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/75">{offer.summary}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href="#request" className="btn btn-gold">
                اطلب الآن
              </a>
              <a
                href={waLink(settings.whatsappNumber, `مرحباً، أرغب بالاستفسار عن العرض: ${offer.title}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa"
              >
                <WhatsAppIcon className="h-4 w-4" />
                تواصل عبر واتساب
              </a>
              <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-extrabold text-gold ring-1 ring-white/20">
                {priceLabel(offer.price)}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-lux">
        <div className="container-lux grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <div className="card-lux overflow-hidden">
              {offer.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={offer.imageUrl} alt={offer.title} className="h-72 w-full object-cover" loading="lazy" />
              ) : null}
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-extrabold text-primary">
                    {offer.category}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-extrabold ${
                      offer.isAvailable ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {offer.isAvailable ? "حالة العرض: متاح" : "حالة العرض: غير متاح"}
                  </span>
                </div>

                {offer.startAt || offer.endAt ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-navy/10 bg-ivory p-4">
                      <p className="text-xs font-bold text-navy/55">تاريخ بداية العرض</p>
                      <p className="mt-1 text-sm font-extrabold text-navy">
                        {offer.startAt ? formatDate(offer.startAt) : "غير محدد"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-navy/10 bg-ivory p-4">
                      <p className="text-xs font-bold text-navy/55">تاريخ نهاية العرض</p>
                      <p className="mt-1 text-sm font-extrabold text-navy">
                        {offer.endAt ? formatDate(offer.endAt) : "غير محدد"}
                      </p>
                    </div>
                  </div>
                ) : null}

                <h2 className="mt-7 font-display text-2xl font-extrabold text-navy">تفاصيل العرض</h2>
                <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-navy/70">{offer.details}</p>

                <div className="mt-6 rounded-2xl border border-gold/40 bg-gold/8 p-5 text-[13px] font-bold leading-relaxed text-navy/80">
                  السعر: {priceLabel(offer.price)} — تختلف الأسعار والمواعيد بحسب الموسم والتوفر، ويتم تأكيدها من
                  المكتب عند التواصل.
                </div>

                {gallery.length > 0 ? (
                  <>
                    <h3 className="mt-8 font-display text-lg font-extrabold text-navy">صور إضافية</h3>
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {gallery.map((image) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={image}
                          src={image}
                          alt={offer.title}
                          loading="lazy"
                          className="h-32 w-full rounded-2xl object-cover transition hover:scale-105"
                        />
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:sticky lg:top-24 lg:self-start">
            <div id="request" className="card-lux p-6 sm:p-7">
              <h2 className="font-display text-xl font-extrabold text-navy">طلب حجز هذا العرض</h2>
              <p className="mt-2 text-[13px] leading-relaxed text-navy/60">
                سيتم حفظ الطلب في نظام المكتب، وإرسال رسالة واتساب جاهزة ببيانات الطلب، ثم يتم التأكيد بعد المراجعة.
              </p>
              <div className="mt-5">
                <BookingForm
                  type={bookingType}
                  serviceTitle={offer.title}
                  whatsappNumber={settings.whatsappNumber}
                  submitLabel="إرسال طلب العرض"
                />
              </div>
              <a href={telLink(settings.phone)} className="btn btn-outline mt-4 w-full text-sm">
                📞 اتصال مباشر بالمكتب
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
