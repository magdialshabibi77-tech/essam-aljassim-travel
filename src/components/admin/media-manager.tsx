"use client";

import { useRef, useState } from "react";
import { compressImage } from "@/lib/client-image";

export type MediaItem = {
  id: number;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
  alt: string;
  createdAt: string;
};

export default function MediaManager({ initial }: { initial: MediaItem[] }) {
  const [items, setItems] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    setNotice("");
    try {
      const formData = new FormData();
      for (const rawFile of Array.from(files)) {
        const file = await compressImage(rawFile);
        formData.append("file", file);
      }

      const response = await fetch("/api/admin/media", { method: "POST", body: formData });
      const text = await response.text();
      let data: { ok: boolean; error?: string; files?: MediaItem[] };
      try {
        data = JSON.parse(text);
      } catch {
        setError(`استجابة غير متوقعة من السيرفر (${response.status})`);
        return;
      }

      if (!response.ok || !data.ok) {
        setError(data.error || `تعذر رفع الصور (${response.status})`);
        return;
      }
      setItems((prev) => [...(data.files ?? []), ...prev]);
      setNotice("تم رفع الصور بنجاح");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر رفع الصور");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function remove(item: MediaItem) {
    if (!window.confirm("حذف الصورة من المكتبة؟")) return;
    setItems((prev) => prev.filter((row) => row.id !== item.id));
    await fetch(`/api/admin/media?id=${item.id}`, { method: "DELETE" });
  }

  async function copyUrl(item: MediaItem) {
    try {
      await navigator.clipboard.writeText(item.url);
      setNotice("تم نسخ الرابط");
      window.setTimeout(() => setNotice(""), 1800);
    } catch {
      setError("تعذر نسخ الرابط");
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-navy">مكتبة الوسائط</h1>
      <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-navy/60">
        ارفع صور المكتب هنا ثم استخدمها في الشعار وصور الخدمات والعروض والأغلفة. الصور تُخزن فعلياً على الخادم
        ومرتبطة بقاعدة البيانات، ويتم التحقق من نوع الملف وحجمه (بحد أقصى 6 ميغابايت).
      </p>

      <div
        className="mt-5 rounded-3xl border-2 border-dashed border-navy/20 bg-white p-8 text-center transition hover:border-gold"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          void upload(event.dataTransfer.files);
        }}
      >
        <p className="text-3xl">🖼️</p>
        <p className="mt-2 font-display text-base font-extrabold text-navy">
          اسحب الصور هنا أو اختر ملفات من جهازك
        </p>
        <p className="mt-1 text-[12px] text-navy/55">JPG, PNG, WEBP, GIF, SVG, AVIF — حتى 6 ميغابايت للصورة</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="btn btn-primary mt-4 text-sm"
          disabled={uploading}
        >
          {uploading ? "جارٍ الرفع..." : "⬆️ اختيار صور للرفع"}
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
          className="hidden"
          onChange={(event) => void upload(event.target.files)}
        />
        {notice ? <p className="mt-3 text-sm font-bold text-emerald-700">{notice}</p> : null}
        {error ? <p className="mt-3 text-sm font-bold text-rose-600">{error}</p> : null}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.length === 0 ? (
          <p className="col-span-full rounded-3xl border border-dashed border-navy/20 bg-white p-10 text-center text-navy/50">
            المكتبة فارغة — ارفع أول صورة.
          </p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.alt || item.originalName} className="h-32 w-full object-cover" />
              <div className="p-3">
                <p className="truncate text-[11px] font-bold text-navy/70" dir="ltr">
                  {item.originalName}
                </p>
                <p className="mt-0.5 text-[10px] text-navy/40">
                  {(item.size / 1024).toFixed(0)} كيلوبايت
                </p>
                <div className="mt-2 flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => void copyUrl(item)}
                    className="flex-1 rounded-xl bg-primary px-2 py-2 text-[10px] font-extrabold text-white"
                  >
                    نسخ الرابط
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove(item)}
                    className="rounded-xl border border-rose-200 px-2 py-2 text-[10px] font-extrabold text-rose-600"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
