import Link from "next/link";
import { count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { bookingRequests, contactMessages, offers, services } from "@/db/schema";
import { requireSession } from "@/lib/auth";
import { getSettings } from "@/lib/data";
import { REQUEST_STATUS_COLORS, REQUEST_STATUS_LABELS, REQUEST_TYPE_LABELS, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await requireSession();
  const settings = await getSettings();

  const [bookingCount] = await db.select({ value: count() }).from(bookingRequests);
  const [newCount] = await db
    .select({ value: count() })
    .from(bookingRequests)
    .where(eq(bookingRequests.status, "new"));
  const [visaCount] = await db
    .select({ value: count() })
    .from(bookingRequests)
    .where(eq(bookingRequests.type, "visa"));
  const [messageCount] = await db.select({ value: count() }).from(contactMessages);
  const [newMessages] = await db
    .select({ value: count() })
    .from(contactMessages)
    .where(eq(contactMessages.status, "new"));
  const [offersCount] = await db
    .select({ value: count() })
    .from(offers)
    .where(eq(offers.isActive, true));
  const [servicesCount] = await db
    .select({ value: count() })
    .from(services)
    .where(eq(services.isActive, true));

  const recent = await db
    .select()
    .from(bookingRequests)
    .orderBy(desc(bookingRequests.createdAt))
    .limit(8);
  const recentMessages = await db
    .select()
    .from(contactMessages)
    .orderBy(desc(contactMessages.createdAt))
    .limit(5);

  const cards = [
    { label: "إجمالي طلبات الحجز", value: Number(bookingCount?.value ?? 0), icon: "📥", href: "/admin/requests" },
    { label: "طلبات التأشيرات", value: Number(visaCount?.value ?? 0), icon: "🛂", href: "/admin/requests?type=visa" },
    { label: "استفسارات العملاء", value: Number(messageCount?.value ?? 0), icon: "💬", href: "/admin/requests" },
    { label: "عروض منشورة", value: Number(offersCount?.value ?? 0), icon: "🎁", href: "/admin/offers" },
  ];

  const followCards = [
    { label: "طلبات جديدة لم تُتابع", value: Number(newCount?.value ?? 0), icon: "🆕" },
    { label: "رسائل جديدة", value: Number(newMessages?.value ?? 0), icon: "✉️" },
    { label: "خدمات مفعلة", value: Number(servicesCount?.value ?? 0), icon: "🛎️" },
    { label: "أقسام الصفحة الرئيسية", value: 10, icon: "🧩", href: "/admin/sections" },
  ];

  return (
    <div>
      <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold text-navy/55">أهلاً بك</p>
        <h1 className="mt-1 font-display text-2xl font-extrabold text-navy">{session.name}</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-navy/60">
          من هذه اللوحة تتحكم بكل محتويات موقع {settings.officeName}: المعلومات، الخدمات، العروض، شركات
          الباصات، الطلبات، الصور والإعدادات — دون الحاجة لتعديل الكود.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/admin/sections" className="btn btn-primary !py-2.5 text-sm">
            تعديل الصفحة الرئيسية
          </Link>
          <Link href="/admin/settings" className="btn btn-outline !py-2.5 text-sm">
            معلومات المكتب والألوان
          </Link>
          <Link href="/admin/media" className="btn btn-outline !py-2.5 text-sm">
            مكتبة الصور
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const inner = (
            <div className="card-lux flex h-full flex-col gap-2 p-5">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-xl">
                {card.icon}
              </span>
              <p className="font-display text-3xl font-extrabold text-navy">{card.value}</p>
              <p className="text-[12px] font-bold text-navy/55">{card.label}</p>
            </div>
          );
          return card.href ? (
            <Link key={card.label} href={card.href}>
              {inner}
            </Link>
          ) : (
            <div key={card.label}>{inner}</div>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {followCards.map((card) => (
          <div key={card.label} className="rounded-3xl border border-navy/10 bg-ivory p-5">
            <p className="text-[12px] font-bold text-navy/55">
              {card.icon} {card.label}
            </p>
            <p className="mt-1 font-display text-2xl font-extrabold text-primary">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-3xl border border-navy/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-extrabold text-navy">آخر الطلبات</h2>
            <Link href="/admin/requests" className="text-xs font-extrabold text-primary">
              عرض الكل ←
            </Link>
          </div>
          <div className="thin-scroll mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-right text-[13px]">
              <thead className="text-[11px] font-extrabold text-navy/50">
                <tr>
                  <th className="px-2 py-2">الرقم</th>
                  <th className="px-2 py-2">العميل</th>
                  <th className="px-2 py-2">النوع</th>
                  <th className="px-2 py-2">الحالة</th>
                  <th className="px-2 py-2">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/8">
                {recent.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-navy/50">
                      لا توجد طلبات بعد.
                    </td>
                  </tr>
                ) : (
                  recent.map((row) => (
                    <tr key={row.id} className="transition hover:bg-ivory/70">
                      <td className="px-2 py-2.5 font-mono text-[11px] text-navy/60" dir="ltr">
                        {row.reference}
                      </td>
                      <td className="px-2 py-2.5 font-extrabold text-navy">{row.customerName}</td>
                      <td className="px-2 py-2.5">{REQUEST_TYPE_LABELS[row.type] ?? row.type}</td>
                      <td className="px-2 py-2.5">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[10px] font-extrabold ${
                            REQUEST_STATUS_COLORS[row.status] ?? ""
                          }`}
                        >
                          {REQUEST_STATUS_LABELS[row.status] ?? row.status}
                        </span>
                      </td>
                      <td className="px-2 py-2.5 text-[11px] text-navy/55">{formatDateTime(row.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border border-navy/10 bg-white p-5 shadow-sm">
          <h2 className="font-display text-lg font-extrabold text-navy">آخر الاستفسارات</h2>
          <ul className="mt-4 space-y-3">
            {recentMessages.length === 0 ? (
              <li className="text-[13px] text-navy/50">لا توجد رسائل بعد.</li>
            ) : (
              recentMessages.map((message) => (
                <li key={message.id} className="rounded-2xl bg-ivory p-3">
                  <p className="text-[13px] font-extrabold text-navy">{message.name}</p>
                  <p className="mt-1 line-clamp-2 text-[12px] text-navy/60">{message.message}</p>
                  <p className="mt-1 text-[10px] text-navy/40" dir="ltr">
                    {message.phone}
                  </p>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
