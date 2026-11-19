"use client";

import { useEffect, useRef, useState } from "react";
import { compressImage } from "@/lib/client-image";

type MediaItem = { id: number; url: string; originalName: string; mimeType: string; alt: string };

type ImagePickerProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  help?: string;
};

export default function ImagePicker({ label, value, onChange, help }: ImagePickerProps) {
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function loadLibrary() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/media");
      const data = (await response.json()) as { ok: boolean; rows?: MediaItem[] };
      setItems(data.rows ?? []);
    } catch {
      setError("تعذر تحميل مكتبة الوسائط");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (libraryOpen) void loadLibrary();
  }, [libraryOpen]);

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      for (const rawFile of Array.from(files)) {
        const file = await compressImage(rawFile);
        formData.append("file", file);
      }

      const response = await fetch("/api/admin/media", { method: "POST", body: formData });
      const text = await response.text();
      let data: { ok: boolean; error?: string; file?: MediaItem; files?: MediaItem[] };
      try {
        data = JSON.parse(text);
      } catch {
        setError(`استجابة غير متوقعة من السيرفر (${response.status})`);
        return;
      }

      if (!response.ok || !data.ok) {
        setError(data.error || `تعذر رفع الصورة (${response.status})`);
        return;
      }
      const uploaded = data.file;
      if (uploaded) onChange(uploaded.url);
      setLibraryOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر رفع الصورة");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex flex-wrap items-start gap-3 rounded-2xl border border-navy/12 bg-white p-3">
        <div className="grid h-20 w-24 shrink-0 place-items-center overflow-hidden rounded-xl border border-navy/10 bg-ivory">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="معاينة" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[11px] text-navy/40">لا توجد صورة</span>
          )}
        </div>
        <div className="min-w-[200px] flex-1 space-y-2">
          <input
            className="field text-[13px]"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="الصق رابط الصورة هنا أو استخدم الرفع"
            dir="ltr"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-xl bg-primary px-3 py-2 text-[12px] font-extrabold text-white transition hover:bg-navy"
              disabled={uploading}
            >
              {uploading ? "جارٍ الرفع..." : "⬆️ رفع صورة"}
            </button>
            <button
              type="button"
              onClick={() => setLibraryOpen(true)}
              className="rounded-xl border border-navy/15 px-3 py-2 text-[12px] font-extrabold text-navy transition hover:bg-ivory"
            >
              🖼️ مكتبة الوسائط
            </button>
            {value ? (
              <button
                type="button"
                onClick={() => onChange("")}
                className="rounded-xl border border-rose-200 px-3 py-2 text-[12px] font-extrabold text-rose-600 transition hover:bg-rose-50"
              >
                إزالة
              </button>
            ) : null}
          </div>
          {help ? <p className="text-[11px] text-navy/50">{help}</p> : null}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => void upload(event.target.files)}
      />

      {error ? <p className="mt-2 text-xs font-bold text-rose-600">{error}</p> : null}

      {libraryOpen ? (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-navy/60 p-4" onClick={() => setLibraryOpen(false)}>
          <div
            className="max-h-[80vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-navy/10 px-5 py-4">
              <h3 className="font-display text-lg font-extrabold text-navy">مكتبة الوسائط</h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="rounded-xl bg-primary px-3 py-2 text-xs font-extrabold text-white"
                  disabled={uploading}
                >
                  {uploading ? "جارٍ الرفع..." : "⬆️ رفع"}
                </button>
                <button
                  type="button"
                  onClick={() => setLibraryOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-navy/8 text-navy"
                  aria-label="إغلاق"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="thin-scroll max-h-[62vh] overflow-y-auto p-5">
              {loading ? (
                <p className="py-6 text-center text-sm text-navy/60">جارٍ التحميل...</p>
              ) : items.length === 0 ? (
                <p className="py-6 text-center text-sm text-navy/60">
                  المكتبة فارغة — ابدأ برفع أول صورة.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onChange(item.url);
                        setLibraryOpen(false);
                      }}
                      className="group overflow-hidden rounded-2xl border border-navy/10 text-right transition hover:border-gold"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.url} alt={item.alt || item.originalName} className="h-24 w-full object-cover" />
                      <span className="block truncate px-2 py-1.5 text-[10px] text-navy/60" dir="ltr">
                        {item.originalName}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
