"use client";

import { useEffect, useRef, useState } from "react";
import { waLink } from "@/lib/utils";

type WhatsAppFloatProps = {
  whatsapp: string;
  enabled: boolean;
  title: string;
  message: string;
  buttonLabel: string;
  delayMs: number;
};

const DISMISS_KEY = "ej_wa_popup_dismissed_at";
const COOLDOWN_MS = 1000 * 60 * 45;

export default function WhatsAppFloat({
  whatsapp,
  enabled,
  title,
  message,
  buttonLabel,
  delayMs,
}: WhatsAppFloatProps) {
  const [popupOpen, setPopupOpen] = useState(false);
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled || !message) return;
    const dismissedAt = Number(window.sessionStorage.getItem(DISMISS_KEY) || 0);
    if (Date.now() - dismissedAt < COOLDOWN_MS) return;

    timerRef.current = setTimeout(() => {
      setBubbleOpen(true);
      window.setTimeout(() => setPopupOpen(true), 400);
    }, Math.max(2500, delayMs));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [enabled, message, delayMs]);

  const close = () => {
    setPopupOpen(false);
    setBubbleOpen(false);
    window.sessionStorage.setItem(DISMISS_KEY, String(Date.now()));
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-3 sm:bottom-6 sm:left-6">
      {/* النافذة المنبثقة */}
      <div
        className={`w-[19rem] max-w-[calc(100vw-2rem)] origin-bottom-left overflow-hidden rounded-3xl border border-white/60 bg-white shadow-[0_30px_60px_-25px_rgba(10,37,64,0.55)] transition-all duration-500 ${
          popupOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-95 opacity-0"
        }`}
        role="dialog"
        aria-label="نافذة التواصل السريع"
        aria-hidden={!popupOpen}
      >
        <div className="relative navy-mesh px-4 py-3 text-white">
          <div className="absolute inset-0 pattern-arabesque opacity-40" />
          <div className="relative flex items-start justify-between gap-2">
            <p className="font-display text-sm font-extrabold">{title}</p>
            <button
              type="button"
              onClick={close}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/30"
              aria-label="إغلاق النافذة"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                <path d="M18.3 5.7L12 12l6.3 6.3-1.4 1.4L10.6 13.4 5.7 18.3 4.3 16.9 9.2 12 4.3 7.1 5.7 5.7l4.9 4.9 4.9-4.9z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="px-4 py-3.5">
          <p className="whitespace-pre-line text-[13px] leading-relaxed text-navy/80">{message}</p>
          <a
            href={waLink(whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-wa mt-3 w-full text-sm"
            onClick={() => window.sessionStorage.setItem(DISMISS_KEY, String(Date.now()))}
          >
            <svg viewBox="0 0 32 32" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M16 3C8.8 3 3 8.8 3 16c0 2.2.6 4.3 1.7 6.2L3 29l7-1.7c1.8 1 3.9 1.6 6 1.6 7.2 0 13-5.8 13-13S23.2 3 16 3z" />
            </svg>
            {buttonLabel}
          </a>
        </div>
      </div>

      {/* الزر العائم */}
      <div className="flex items-center gap-2">
        <a
          href={waLink(whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-[#25d366] to-[#128c50] text-white shadow-[0_14px_30px_-10px_rgba(18,140,80,0.8)] transition hover:scale-105 animate-pulse-ring"
          aria-label="تواصل معنا عبر واتساب"
          onMouseEnter={() => setBubbleOpen(true)}
        >
          <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden="true">
            <path d="M16.04 3.2c-7.06 0-12.8 5.72-12.8 12.77 0 2.25.6 4.45 1.72 6.39L3.2 28.8l6.6-1.73a12.8 12.8 0 006.24 1.6h.01c7.05 0 12.79-5.73 12.79-12.78 0-3.41-1.33-6.62-3.75-9.03a12.68 12.68 0 00-9.05-3.66zm5.85 15.17c-.32-.16-1.9-.94-2.19-1.05-.29-.11-.51-.16-.72.16-.21.32-.83.94-1.02 1.13-.19.19-.37.21-.69.05-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.74-.98-2.38-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.67s1.15 3.1 1.31 3.31c.16.21 2.27 3.46 5.5 4.85.77.33 1.37.53 1.84.68.77.24 1.47.21 2.03.13.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.13-.29-.21-.61-.37z" />
          </svg>
        </a>
        <button
          type="button"
          onClick={() => {
            if (popupOpen) close();
            else setPopupOpen(true);
          }}
          className="rounded-full bg-white/95 px-3 py-2 text-[11px] font-extrabold text-navy shadow-md ring-1 ring-navy/10 transition hover:bg-white"
          aria-expanded={popupOpen}
        >
          {popupOpen ? "إغلاق" : "مساعدة سريعة"}
        </button>
      </div>
    </div>
  );
}
