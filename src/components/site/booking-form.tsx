"use client";

import { useMemo, useState } from "react";
import { waLink } from "@/lib/utils";

export type BookingType = "bus" | "flight" | "visa" | "umrah" | "service" | "contact";

type BookingFormProps = {
  type: BookingType;
  serviceTitle: string;
  whatsappNumber: string;
  companies?: { id: number; name: string }[];
  cityOptions?: string[];
  submitLabel?: string;
  tone?: "light" | "dark";
};

type FormState = {
  customerName: string;
  phone: string;
  city: string;
  originCity: string;
  destinationCity: string;
  preferredCompany: string;
  travelDate: string;
  passengers: string;
  details: string;
};

const empty: FormState = {
  customerName: "",
  phone: "",
  city: "إب",
  originCity: "إب",
  destinationCity: "",
  preferredCompany: "",
  travelDate: "",
  passengers: "1",
  details: "",
};

const inputClass =
  "field text-[15px] placeholder:text-navy/35";

export default function BookingForm({
  type,
  serviceTitle,
  whatsappNumber,
  companies = [],
  cityOptions = [],
  submitLabel,
  tone = "light",
}: BookingFormProps) {
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ reference: string } | null>(null);
  const [serverError, setServerError] = useState("");

  const isBus = type === "bus";
  const isFlight = type === "flight";
  const isVisa = type === "visa";
  const isUmrah = type === "umrah";

  const message = useMemo(() => {
    const lines = [
      `*طلب خدمة — ${serviceTitle}*`,
      `رقم الطلب: ${result?.reference ?? "(سيتم إصداره بعد الإرسال)"}`,
      `الاسم: ${form.customerName || "-"}`,
      `الهاتف: ${form.phone || "-"}`,
    ];
    if (isBus) {
      lines.push(`مدينة الانطلاق: ${form.originCity || "-"}`);
      lines.push(`المدينة المطلوبة: ${form.destinationCity || "-"}`);
      lines.push(`الشركة المفضلة: ${form.preferredCompany || "غير محددة"}`);
    } else if (isFlight) {
      lines.push(`الوجهة: ${form.destinationCity || "-"}`);
    } else if (isVisa) {
      lines.push(`المدينة: ${form.city || "-"}`);
    } else if (isUmrah) {
      lines.push(`المدينة: ${form.city || "-"}`);
    }
    if (form.travelDate) lines.push(`تاريخ السفر: ${form.travelDate}`);
    if (isBus || isFlight || isUmrah) lines.push(`عدد المسافرين: ${form.passengers || "1"}`);
    if (form.details) lines.push(`ملاحظات: ${form.details}`);
    lines.push("", "أرجو مراجعة الطلب والتواصل معي للتأكيد.");
    return lines.join("\n");
  }, [form, isBus, isFlight, isVisa, isUmrah, result, serviceTitle]);

  const set = (key: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  function validate() {
    const next: Record<string, string> = {};
    if (form.customerName.trim().length < 3) next.customerName = "يرجى إدخال الاسم كاملاً";
    const digits = form.phone.replace(/[^\d]/g, "");
    if (digits.length < 7) next.phone = "يرجى إدخال رقم هاتف صحيح";
    if (isBus && form.destinationCity.trim().length < 2)
      next.destinationCity = "يرجى تحديد المدينة المطلوبة";
    if (isFlight && form.destinationCity.trim().length < 2)
      next.destinationCity = "يرجى تحديد الوجهة";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setServerError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/public/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, serviceTitle, ...form, passengers: Number(form.passengers) || 1 }),
      });
      const data = (await response.json()) as {
        ok: boolean;
        reference?: string;
        error?: string;
      };
      if (!response.ok || !data.ok) {
        setServerError(data.error || "تعذر إرسال الطلب، يرجى المحاولة مرة أخرى.");
        return;
      }
      setResult({ reference: data.reference ?? "" });
      window.open(waLink(whatsappNumber, message), "_blank", "noopener,noreferrer");
    } catch {
      setServerError("حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 text-center sm:p-8">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-500 text-white shadow-lg animate-pop-in">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
            <path d="M9 16.2l-3.5-3.5L4 14.2l5 5 11-11-1.4-1.4z" />
          </svg>
        </div>
        <h3 className="mt-4 font-display text-xl font-extrabold text-emerald-900">
          تم استلام طلبك بنجاح
        </h3>
        <p className="mt-2 text-sm text-emerald-800">
          رقم الطلب: <span className="font-extrabold" dir="ltr">{result.reference}</span>
        </p>
        <p className="mx-auto mt-3 max-w-md text-[13px] leading-relaxed text-emerald-900/80">
          تم حفظ الطلب في نظام المكتب وسيتم مراجعته والتحقق من التوفر، ثم التواصل معك للتأكيد النهائي.
          إذا لم تُفتح نافذة واتساب تلقائياً استخدم الزر أدناه.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <a
            href={waLink(whatsappNumber, message)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-wa text-sm"
          >
            متابعة المحادثة على واتساب
          </a>
          <button
            type="button"
            onClick={() => {
              setResult(null);
              setForm(empty);
            }}
            className="btn btn-outline text-sm"
          >
            إرسال طلب آخر
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4"
      noValidate
      aria-label={`نموذج طلب ${serviceTitle}`}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor={`${type}-name`}>
            اسم المسافر / العميل <span className="text-rose-500">*</span>
          </label>
          <input
            id={`${type}-name`}
            className={`${inputClass} ${errors.customerName ? "input-error" : ""}`}
            value={form.customerName}
            onChange={set("customerName")}
            placeholder="الاسم الرباعي"
            autoComplete="name"
            required
          />
          {errors.customerName ? (
            <p className="mt-1 text-xs font-semibold text-rose-600">{errors.customerName}</p>
          ) : null}
        </div>

        <div>
          <label className="label" htmlFor={`${type}-phone`}>
            رقم الهاتف / واتساب <span className="text-rose-500">*</span>
          </label>
          <input
            id={`${type}-phone`}
            className={`${inputClass} ${errors.phone ? "input-error" : ""}`}
            value={form.phone}
            onChange={set("phone")}
            placeholder="9677xxxxxxxx"
            dir="ltr"
            inputMode="tel"
            autoComplete="tel"
            required
          />
          {errors.phone ? (
            <p className="mt-1 text-xs font-semibold text-rose-600">{errors.phone}</p>
          ) : null}
        </div>
      </div>

      {isBus || isFlight ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {isBus ? (
            <div>
              <label className="label" htmlFor={`${type}-origin`}>
                مدينة الانطلاق
              </label>
              <input
                id={`${type}-origin`}
                className={inputClass}
                value={form.originCity}
                onChange={set("originCity")}
                placeholder="إب"
                list="city-options"
              />
            </div>
          ) : null}
          <div>
            <label className="label" htmlFor={`${type}-dest`}>
              {isBus ? "المدينة المطلوبة" : "الوجهة المطلوبة"}{" "}
              {isBus || isFlight ? <span className="text-rose-500">*</span> : null}
            </label>
            <input
              id={`${type}-dest`}
              className={`${inputClass} ${errors.destinationCity ? "input-error" : ""}`}
              value={form.destinationCity}
              onChange={set("destinationCity")}
              placeholder={isBus ? "جدة" : "الرياض"}
              list="city-options"
              required={isBus || isFlight}
            />
            {errors.destinationCity ? (
              <p className="mt-1 text-xs font-semibold text-rose-600">{errors.destinationCity}</p>
            ) : null}
          </div>
        </div>
      ) : null}

      {isBus && companies.length > 0 ? (
        <div>
          <label className="label" htmlFor={`${type}-company`}>
            شركة الباص المفضلة
          </label>
          <select
            id={`${type}-company`}
            className={inputClass}
            value={form.preferredCompany}
            onChange={set("preferredCompany")}
          >
            <option value="">بدون تحديد — استفسر عن الخيارات المتاحة</option>
            {companies.map((company) => (
              <option key={company.id} value={company.name}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {(isVisa || isUmrah) && cityOptions.length > 0 ? (
        <div>
          <label className="label" htmlFor={`${type}-city`}>
            المدينة
          </label>
          <input
            id={`${type}-city`}
            className={inputClass}
            value={form.city}
            onChange={set("city")}
            list="city-options"
          />
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor={`${type}-date`}>
            {isUmrah ? "الموعد المفضل" : "تاريخ السفر"}
          </label>
          <input
            id={`${type}-date`}
            type="date"
            className={inputClass}
            value={form.travelDate}
            onChange={set("travelDate")}
          />
        </div>
        {isBus || isFlight || isUmrah ? (
          <div>
            <label className="label" htmlFor={`${type}-passengers`}>
              عدد المسافرين
            </label>
            <input
              id={`${type}-passengers`}
              type="number"
              min={1}
              max={30}
              className={inputClass}
              value={form.passengers}
              onChange={set("passengers")}
            />
          </div>
        ) : null}
      </div>

      <div>
        <label className="label" htmlFor={`${type}-details`}>
          {isVisa ? "نوع التأشيرة وتفاصيل الحالة" : "ملاحظات إضافية"}
        </label>
        <textarea
          id={`${type}-details`}
          className={`${inputClass} min-h-[92px] resize-y`}
          value={form.details}
          onChange={set("details")}
          placeholder={
            isVisa
              ? "مثال: زيارة عائلية لعدد 4 أفراد، أريد معرفة المستندات المطلوبة"
              : "أي تفاصيل تساعد المكتب في مراجعة طلبك"
          }
        />
      </div>

      <datalist id="city-options">
        {["إب", "صنعاء", "عدن", "تعز", "الحديدة", "المكلا", "جدة", "مكة المكرمة", "المدينة المنورة", "الرياض", "الدمام"].map(
          (city) => (
            <option key={city} value={city} />
          ),
        )}
        {cityOptions
          .filter((city) => city && city !== "إب")
          .map((city) => (
            <option key={`extra-${city}`} value={city} />
          ))}
      </datalist>

      {serverError ? (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {serverError}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" className="btn btn-gold w-full sm:w-auto" disabled={loading}>
          {loading ? "جارٍ الإرسال..." : submitLabel || "إرسال الطلب"}
        </button>
        <p className="text-[12px] leading-relaxed text-navy/60">
          الطلب يُحفظ في نظام المكتب ويُفتح واتساب برسالة جاهزة. التأكيد يتم من المكتب بعد مراجعة
          الطلب والتوفر.
        </p>
      </div>
    </form>
  );
}
