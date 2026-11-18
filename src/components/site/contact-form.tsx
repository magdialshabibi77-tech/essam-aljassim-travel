"use client";

import { useState } from "react";
import { waLink } from "@/lib/utils";

type ContactFormProps = {
  whatsappNumber: string;
};

export default function ContactForm({ whatsappNumber }: ContactFormProps) {
  const [form, setForm] = useState({ name: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const set =
    (key: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
      setErrors((prev) => ({ ...prev, [key]: "" }));
    };

  function validate() {
    const next: Record<string, string> = {};
    if (form.name.trim().length < 3) next.name = "يرجى إدخال الاسم";
    if (form.phone.replace(/[^\d]/g, "").length < 7) next.phone = "يرجى إدخال رقم صحيح";
    if (form.message.trim().length < 5) next.message = "يرجى كتابة استفسارك";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setError(data.error || "تعذر إرسال الرسالة.");
        return;
      }
      setDone(true);
    } catch {
      setError("حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 text-center">
        <h3 className="font-display text-lg font-extrabold text-emerald-900">تم إرسال استفسارك</h3>
        <p className="mt-2 text-sm text-emerald-800">
          تم حفظ رسالتك في نظام المكتب، وسنتواصل معك في أقرب وقت. للرد السريع استخدم واتساب.
        </p>
        <a
          href={waLink(
            whatsappNumber,
            `مرحباً، اسمي ${form.name}. ${form.subject ? `(${form.subject}) ` : ""}${form.message}`,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-wa mt-4 text-sm"
        >
          تحدث الآن عبر واتساب
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="c-name">
            الاسم <span className="text-rose-500">*</span>
          </label>
          <input
            id="c-name"
            className={`field ${errors.name ? "input-error" : ""}`}
            value={form.name}
            onChange={set("name")}
            required
          />
          {errors.name ? <p className="mt-1 text-xs text-rose-600">{errors.name}</p> : null}
        </div>
        <div>
          <label className="label" htmlFor="c-phone">
            رقم الهاتف <span className="text-rose-500">*</span>
          </label>
          <input
            id="c-phone"
            className={`field ${errors.phone ? "input-error" : ""}`}
            value={form.phone}
            onChange={set("phone")}
            dir="ltr"
            inputMode="tel"
            required
          />
          {errors.phone ? <p className="mt-1 text-xs text-rose-600">{errors.phone}</p> : null}
        </div>
      </div>
      <div>
        <label className="label" htmlFor="c-subject">
          موضوع الاستفسار
        </label>
        <input
          id="c-subject"
          className="field"
          value={form.subject}
          onChange={set("subject")}
          placeholder="تأشيرة / تذكرة / عمرة / باص"
        />
      </div>
      <div>
        <label className="label" htmlFor="c-message">
          رسالتك <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="c-message"
          className={`field min-h-[120px] resize-y ${errors.message ? "input-error" : ""}`}
          value={form.message}
          onChange={set("message")}
          required
        />
        {errors.message ? <p className="mt-1 text-xs text-rose-600">{errors.message}</p> : null}
      </div>
      {error ? (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>
      ) : null}
      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={loading}>
        {loading ? "جارٍ الإرسال..." : "إرسال الاستفسار"}
      </button>
    </form>
  );
}
