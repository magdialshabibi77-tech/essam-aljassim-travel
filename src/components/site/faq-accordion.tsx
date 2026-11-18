"use client";

import { useState } from "react";

type FaqItem = { id: number; question: string; answer: string };

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<number | null>(items[0]?.id ?? null);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div
            key={item.id}
            className={`card-lux overflow-hidden !rounded-3xl transition-all ${
              open ? "border-gold/50 shadow-lg" : ""
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenId(open ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right"
              aria-expanded={open}
            >
              <span className="font-display text-[15px] font-extrabold text-navy sm:text-base">
                {item.question}
              </span>
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                  open ? "rotate-45 bg-gold text-navy" : "bg-navy/5 text-navy"
                }`}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M11 5h2v14h-2z" />
                  <path d="M5 11h14v2H5z" />
                </svg>
              </span>
            </button>
            <div
              className="grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-[14px] leading-relaxed text-navy/70">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
