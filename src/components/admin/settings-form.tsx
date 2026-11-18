"use client";

import { useState } from "react";
import ImagePicker from "@/components/admin/image-picker";

export type SettingsValues = {
  officeName: string;
  officeShortName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  phone: string;
  phoneSecondary: string;
  whatsappNumber: string;
  whatsappLink: string;
  email: string;
  address: string;
  mapsLink: string;
  facebookUrl: string;
  tiktokUrl: string;
  workingHours: string;
  workingHoursNote: string;
  availabilityStatus: string;
  aboutText: string;
  colorPrimary: string;
  colorNavy: string;
  colorAccent: string;
  colorBackground: string;
  colorSurface: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogImage: string;
  whatsappPopupEnabled: boolean;
  whatsappPopupTitle: string;
  whatsappPopupMessage: string;
  whatsappPopupButton: string;
  whatsappPopupDelay: number;
  copyrightText: string;
  footerNote: string;
};

type TextKey = Exclude<keyof SettingsValues, "whatsappPopupEnabled" | "whatsappPopupDelay">;

function Text({
  label,
  value,
  onChange,
  help,
  dir,
  type = "text",
  area,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  help?: string;
  dir?: "ltr" | "rtl";
  type?: string;
  area?: boolean;
  rows?: number;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      {area ? (
        <textarea
          className="field resize-y text-[13px]"
          rows={rows}
          value={value}
          dir={dir}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className="field text-[13px]"
          type={type}
          value={value}
          dir={dir}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {help ? <p className="mt-1 text-[11px] text-navy/50">{help}</p> : null}
    </div>
  );
}

export default function SettingsForm({ initial }: { initial: SettingsValues }) {
  const [values, setValues] = useState<SettingsValues>(initial);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  function set(key: keyof SettingsValues) {
    return (value: string | number | boolean) =>
      setValues((prev) => ({ ...prev, [key]: value }) as SettingsValues);
  }

  async function save() {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setError(data.error || "تعذر الحفظ");
        return;
      }
      setNotice("تم حفظ الإعدادات — التغييرات ظاهرة في الموقع الآن");
    } catch {
      setError("خطأ في الاتصال");
    } finally {
      setSaving(false);
      window.setTimeout(() => setNotice(""), 3000);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm">
        <h1 className="font-display text-2xl font-extrabold text-navy">إعدادات الموقع</h1>
        <p className="mt-1 text-[13px] text-navy/60">
          كل ما تحفظه هنا يظهر في الموقع مباشرة: اسم المكتب، الشعار، الأرقام، العنوان، الألوان، نصوص SEO ونافذة
          واتساب.
        </p>
        <button type="button" onClick={() => void save()} className="btn btn-gold mt-4 text-sm" disabled={saving}>
          {saving ? "جارٍ الحفظ..." : "💾 حفظ جميع الإعدادات"}
        </button>
        {notice ? (
          <p className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">{notice}</p>
        ) : null}
        {error ? (
          <p className="mt-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p>
        ) : null}
      </div>

      {/* معلومات المكتب */}
      <section className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-extrabold text-navy">معلومات المكتب والشعار</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Text label="اسم المكتب الكامل" value={values.officeName} onChange={set("officeName")} />
          <Text label="الاسم المختصر" value={values.officeShortName} onChange={set("officeShortName")} />
          <Text label="الشعار النصي (تحت الاسم)" value={values.tagline} onChange={set("tagline")} />
          <div>
            <label className="label">حالة التوفر</label>
            <select
              className="field text-[13px]"
              value={values.availabilityStatus}
              onChange={(event) => set("availabilityStatus")(event.target.value)}
            >
              <option value="open">مفتوح — يستقبل الطلبات</option>
              <option value="busy">مشغول — يُنصح بالتواصل أولاً</option>
              <option value="closed">مغلق مؤقتاً</option>
            </select>
          </div>
          <Text label="أوقات العمل" value={values.workingHours} onChange={set("workingHours")} />
          <Text label="ملاحظة أوقات العمل" value={values.workingHoursNote} onChange={set("workingHoursNote")} />
          <div className="sm:col-span-2">
            <Text
              label="وصف المكتب"
              value={values.aboutText}
              onChange={set("aboutText")}
              area
              rows={3}
              help="يظهر في التذييل ويُستخدم في بيانات SEO"
            />
          </div>
          <ImagePicker label="شعار المكتب (اللافتة)" value={values.logoUrl} onChange={set("logoUrl")} help="ارفع صورة اللافتة الأصلية هنا وستظهر في الهيدر والتذييل" />
          <ImagePicker label="أيقونة المتصفح (Favicon)" value={values.faviconUrl} onChange={set("faviconUrl")} help="صورة مربعة صغيرة 32×32 أو 64×64" />
        </div>
      </section>

      {/* بيانات التواصل */}
      <section className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-extrabold text-navy">بيانات التواصل والموقع</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Text label="رقم الهاتف" value={values.phone} onChange={set("phone")} dir="ltr" help="يُستخدم في رابط الاتصال المباشر tel:" />
          <Text label="رقم إضافي (اختياري)" value={values.phoneSecondary} onChange={set("phoneSecondary")} dir="ltr" />
          <Text label="رقم واتساب" value={values.whatsappNumber} onChange={set("whatsappNumber")} dir="ltr" help="أرقام فقط مع رمز الدولة، مثال: 967781808012" />
          <Text label="رابط واتساب المباشر" value={values.whatsappLink} onChange={set("whatsappLink")} dir="ltr" />
          <Text label="البريد الإلكتروني (اختياري)" value={values.email} onChange={set("email")} dir="ltr" />
          <Text label="العنوان" value={values.address} onChange={set("address")} />
          <Text label="رابط الموقع على خرائط Google" value={values.mapsLink} onChange={set("mapsLink")} dir="ltr" />
          <Text label="رابط فيسبوك" value={values.facebookUrl} onChange={set("facebookUrl")} dir="ltr" />
          <Text label="رابط تيك توك" value={values.tiktokUrl} onChange={set("tiktokUrl")} dir="ltr" />
        </div>
      </section>

      {/* الألوان */}
      <section className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-extrabold text-navy">ألوان الهوية</h2>
        <p className="mt-1 text-[12px] text-navy/55">تُطبق الألوان على الموقع فوراً بعد الحفظ.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {(
            [
              ["colorPrimary", "اللون الأساسي (كحلي أخضر)"],
              ["colorNavy", "الكحلي الداكن"],
              ["colorAccent", "الذهبي الفاخر"],
              ["colorBackground", "خلفية الموقع (عاجي)"],
              ["colorSurface", "خلفية البطاقات"],
            ] as [TextKey, string][]
          ).map(([key, label]) => (
            <div key={key}>
              <label className="label">{label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="h-11 w-14 cursor-pointer rounded-xl border border-navy/15 bg-white p-1"
                  value={values[key]}
                  onChange={(event) => set(key)(event.target.value)}
                />
                <input
                  className="field text-[13px]"
                  dir="ltr"
                  value={values[key]}
                  onChange={(event) => set(key)(event.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
        <div
          className="mt-5 overflow-hidden rounded-2xl p-5 text-white shadow-inner"
          style={{ background: `linear-gradient(135deg, ${values.colorPrimary}, ${values.colorNavy})` }}
        >
          <p className="font-display text-lg font-extrabold">معاينة الهوية</p>
          <p className="mt-1 text-[13px] text-white/80">
            زر ذهبي وبطاقة بألوان المكتب الحالية
          </p>
          <span
            className="mt-3 inline-block rounded-full px-4 py-2 text-sm font-extrabold"
            style={{ background: values.colorAccent, color: "#1d1503" }}
          >
            اطلب الآن
          </span>
          <span
            className="ml-2 inline-block rounded-full px-4 py-2 text-sm font-extrabold"
            style={{ background: values.colorSurface, color: values.colorNavy }}
          >
            تواصل معنا
          </span>
        </div>
      </section>

      {/* نافذة واتساب */}
      <section id="whatsapp" className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-extrabold text-navy">نافذة واتساب المنبثقة</h2>
        <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-2xl border border-navy/12 px-4 py-3">
          <input
            type="checkbox"
            className="h-5 w-5 accent-[var(--brand-gold)]"
            checked={values.whatsappPopupEnabled}
            onChange={(event) => set("whatsappPopupEnabled")(event.target.checked)}
          />
          <span className="text-[13px] font-extrabold text-navy">تفعيل النافذة المنبثقة</span>
        </label>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Text label="عنوان النافذة" value={values.whatsappPopupTitle} onChange={set("whatsappPopupTitle")} />
          <Text label="نص زر النافذة" value={values.whatsappPopupButton} onChange={set("whatsappPopupButton")} />
          <div className="sm:col-span-2">
            <Text
              label="نص الرسالة"
              value={values.whatsappPopupMessage}
              onChange={set("whatsappPopupMessage")}
              area
              rows={4}
            />
          </div>
          <Text
            label="مدة الظهور (بالثواني تقريباً)"
            value={String(values.whatsappPopupDelay)}
            onChange={(value) => set("whatsappPopupDelay")(Number(value) || 12000)}
            type="number"
            help="الوقت الذي تنتظره النافذة قبل الظهور (بالمللي ثانية، الافتراضي 12000)"
          />
        </div>
      </section>

      {/* SEO */}
      <section id="seo" className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-extrabold text-navy">إعدادات محركات البحث SEO</h2>
        <div className="mt-5 grid gap-4">
          <Text label="عنوان الموقع" value={values.seoTitle} onChange={set("seoTitle")} area rows={2} />
          <Text label="وصف الموقع" value={values.seoDescription} onChange={set("seoDescription")} area rows={3} />
          <Text
            label="الكلمات المفتاحية"
            value={values.seoKeywords}
            onChange={set("seoKeywords")}
            area
            rows={3}
            help="مفصولة بفواصل: مكتب عصام الجسيم للسفريات، حجوزات باصات في إب..."
          />
          <ImagePicker label="صورة المشاركة (OG Image)" value={values.ogImage} onChange={set("ogImage")} />
        </div>
      </section>

      {/* التذييل */}
      <section className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-extrabold text-navy">بيانات حقوق النشر والتذييل</h2>
        <div className="mt-5 grid gap-4">
          <Text label="نص حقوق النشر" value={values.copyrightText} onChange={set("copyrightText")} />
          <Text label="ملاحظة التذييل" value={values.footerNote} onChange={set("footerNote")} area rows={2} />
        </div>
      </section>

      <div className="sticky bottom-4 rounded-3xl border border-navy/10 bg-white/95 p-4 shadow-lg backdrop-blur">
        <button type="button" onClick={() => void save()} className="btn btn-gold w-full text-sm" disabled={saving}>
          {saving ? "جارٍ الحفظ..." : "💾 حفظ جميع الإعدادات"}
        </button>
      </div>
    </div>
  );
}
