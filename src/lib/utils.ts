export function waNumber(raw: string) {
  return (raw || "").replace(/[^\d]/g, "");
}

export function waLink(number: string, message?: string) {
  const digits = waNumber(number);
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function telLink(phone: string) {
  return `tel:${(phone || "").replace(/[^\d+]/g, "")}`;
}

export const REQUEST_TYPE_LABELS: Record<string, string> = {
  bus: "حجز باص",
  flight: "تذكرة طيران",
  visa: "تأشيرة",
  umrah: "عمرة / حج",
  service: "خدمة عامة",
  contact: "استفسار",
};

export const REQUEST_STATUS_LABELS: Record<string, string> = {
  new: "جديد",
  in_progress: "قيد المتابعة",
  contacted: "تم التواصل",
  completed: "مكتمل",
  cancelled: "ملغي",
};

export const REQUEST_STATUS_COLORS: Record<string, string> = {
  new: "bg-amber-100 text-amber-800 border-amber-200",
  in_progress: "bg-sky-100 text-sky-800 border-sky-200",
  contacted: "bg-violet-100 text-violet-800 border-violet-200",
  completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-rose-100 text-rose-700 border-rose-200",
};

export const AVAILABILITY_LABELS: Record<string, string> = {
  available: "متاح الحجز",
  limited: "تتوفر رحلات محدودة",
  unavailable: "غير متاح حالياً",
};

export const OFFER_CATEGORY_OPTIONS = [
  "برامج العمرة",
  "تذاكر طيران",
  "برامج الزيارة",
  "عروض السفر",
  "برامج سياحية",
  "خدمات إضافية",
];

export const ICON_OPTIONS = [
  { value: "plane", label: "طائرة" },
  { value: "passport", label: "جواز / تأشيرة" },
  { value: "mosque", label: "حج وعمرة" },
  { value: "bus", label: "باص" },
  { value: "shield", label: "أمان / ثقة" },
  { value: "check", label: "تأكيد" },
  { value: "chat", label: "تواصل" },
  { value: "user", label: "متابعة شخصية" },
  { value: "pin", label: "موقع" },
  { value: "clock", label: "وقت" },
  { value: "star", label: "تميّز" },
  { value: "globe", label: "عالمي" },
];

export function iconFor(name?: string | null) {
  switch (name) {
    case "plane":
      return "✈️";
    case "passport":
      return "🛂";
    case "mosque":
      return "🕋";
    case "bus":
      return "🚌";
    case "shield":
      return "🛡️";
    case "check":
      return "✅";
    case "chat":
      return "💬";
    case "user":
      return "👤";
    case "pin":
      return "📍";
    case "clock":
      return "🕐";
    case "star":
      return "⭐";
    case "globe":
      return "🌍";
    default:
      return "✨";
  }
}

export function formatDateTime(value: Date | string | null | undefined) {
  if (!value) return "-";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
    numberingSystem: "latn",
    calendar: "gregory",
  }).format(date);
}

export function formatDate(value: Date | string | null | undefined) {
  if (!value) return "-";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    numberingSystem: "latn",
    calendar: "gregory",
  }).format(date);
}

export function priceLabel(price?: string | null) {
  const clean = (price ?? "").trim();
  return clean.length > 0 ? clean : "تواصل معنا لمعرفة السعر";
}

export function makeReference(prefix = "EJ") {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${y}${m}${d}-${rand}`;
}
