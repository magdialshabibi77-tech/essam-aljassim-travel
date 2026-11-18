import "server-only";
import {
  benefits,
  busCompanies,
  busRoutes,
  faqs,
  homeSections,
  offers,
  services,
  stats,
  testimonials,
} from "@/db/schema";
import { OFFER_CATEGORY_OPTIONS } from "@/lib/utils";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "image"
  | "list"
  | "select"
  | "date";

export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  placeholder?: string;
  help?: string;
  rows?: number;
  half?: boolean;
  required?: boolean;
};

export type ListColumn = {
  name: string;
  label: string;
  type?: "image" | "boolean" | "text" | "badge";
};

export type ResourceConfig = {
  name: string;
  label: string;
  singular: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: any;
  orderMode: "sort" | "newest" | "oldest";
  titleField: string;
  fields: FieldConfig[];
  columns: ListColumn[];
};

const ICON_SELECT = [
  { value: "plane", label: "✈️ طائرة" },
  { value: "passport", label: "🛂 جواز / تأشيرة" },
  { value: "mosque", label: "🕋 حج وعمرة" },
  { value: "bus", label: "🚌 باص" },
  { value: "shield", label: "🛡️ أمان" },
  { value: "check", label: "✅ تأكيد" },
  { value: "chat", label: "💬 تواصل" },
  { value: "user", label: "👤 متابعة شخصية" },
  { value: "pin", label: "📍 موقع" },
  { value: "clock", label: "🕐 وقت" },
  { value: "star", label: "⭐ تميّز" },
  { value: "globe", label: "🌍 عالمي" },
];

const AVAILABILITY_SELECT = [
  { value: "available", label: "متاح الحجز" },
  { value: "limited", label: "تتوفر رحلات محدودة" },
  { value: "unavailable", label: "غير متاح حالياً" },
];

export const RESOURCE_CONFIGS: Record<string, ResourceConfig> = {
  services: {
    name: "services",
    label: "الخدمات",
    singular: "خدمة",
    description: "أضف خدمات المكتب وتفاصيلها وصورها وترتيب ظهورها في الموقع.",
    table: services,
    orderMode: "sort",
    titleField: "title",
    columns: [
      { name: "imageUrl", label: "الصورة", type: "image" },
      { name: "title", label: "الخدمة" },
      { name: "slug", label: "الرابط" },
      { name: "showOnHome", label: "الرئيسية", type: "boolean" },
      { name: "isActive", label: "مفعلة", type: "boolean" },
      { name: "sortOrder", label: "الترتيب" },
    ],
    fields: [
      { name: "title", label: "عنوان الخدمة", type: "text", required: true },
      { name: "slug", label: "المعرف في الرابط (slug)", type: "text", half: true, help: "بالإنجليزية مثل: hajj-umrah" },
      { name: "icon", label: "الأيقونة", type: "select", options: ICON_SELECT, half: true },
      { name: "imageUrl", label: "صورة الخدمة", type: "image" },
      { name: "shortDescription", label: "وصف مختصر", type: "textarea", rows: 2 },
      { name: "description", label: "التفاصيل الكاملة", type: "textarea", rows: 6 },
      { name: "features", label: "نقاط الخدمة (كل سطر نقطة)", type: "list" },
      { name: "sortOrder", label: "الترتيب", type: "number", half: true },
      { name: "showOnHome", label: "إظهار في الصفحة الرئيسية", type: "boolean", half: true },
      { name: "isActive", label: "الخدمة مفعلة", type: "boolean", half: true },
    ],
  },
  offers: {
    name: "offers",
    label: "العروض والبرامج",
    singular: "عرض",
    description: "أضف عدداً غير محدود من العروض والبرامج والمنتجات مع الصور والتفاصيل.",
    table: offers,
    orderMode: "sort",
    titleField: "title",
    columns: [
      { name: "imageUrl", label: "الصورة", type: "image" },
      { name: "title", label: "العرض" },
      { name: "category", label: "التصنيف", type: "badge" },
      { name: "price", label: "السعر" },
      { name: "isAvailable", label: "متاح", type: "boolean" },
      { name: "isActive", label: "منشور", type: "boolean" },
      { name: "sortOrder", label: "الترتيب" },
    ],
    fields: [
      { name: "title", label: "اسم العرض", type: "text", required: true },
      {
        name: "category",
        label: "تصنيف المنتج",
        type: "select",
        options: OFFER_CATEGORY_OPTIONS.map((c) => ({ value: c, label: c })),
        half: true,
      },
      { name: "slug", label: "المعرف في الرابط (slug)", type: "text", half: true },
      { name: "imageUrl", label: "الصورة الرئيسية", type: "image" },
      { name: "gallery", label: "صور إضافية (رابط في كل سطر)", type: "list", help: "أضف روابط الصور من مكتبة الوسائط، رابط في كل سطر" },
      { name: "summary", label: "وصف مختصر", type: "textarea", rows: 2 },
      { name: "details", label: "التفاصيل الكاملة", type: "textarea", rows: 6 },
      { name: "price", label: "السعر", type: "text", half: true, help: "اتركه فارغاً لعرض: تواصل معنا لمعرفة السعر" },
      { name: "startAt", label: "تاريخ بداية العرض", type: "date", half: true },
      { name: "endAt", label: "تاريخ نهاية العرض", type: "date", half: true },
      { name: "isAvailable", label: "حالة العرض: متاح", type: "boolean", half: true },
      { name: "isActive", label: "منشور في الموقع", type: "boolean", half: true },
      { name: "showOnHome", label: "إظهار في الصفحة الرئيسية", type: "boolean", half: true },
      { name: "sortOrder", label: "الترتيب", type: "number", half: true },
    ],
  },
  "bus-companies": {
    name: "bus-companies",
    label: "شركات الباصات",
    singular: "شركة",
    description: "أضف شركات النقل مع الشعار والغلاف وخط السير والمدن المخدومة وحالة التوفر.",
    table: busCompanies,
    orderMode: "sort",
    titleField: "name",
    columns: [
      { name: "coverUrl", label: "الغلاف", type: "image" },
      { name: "name", label: "الشركة" },
      { name: "routeSummary", label: "خط السير" },
      { name: "availability", label: "التوفر", type: "badge" },
      { name: "isOfficialPartner", label: "شريك رسمي", type: "boolean" },
      { name: "isActive", label: "ظاهرة", type: "boolean" },
    ],
    fields: [
      { name: "name", label: "اسم الشركة", type: "text", required: true },
      { name: "slug", label: "المعرف في الرابط (slug)", type: "text", half: true },
      { name: "availability", label: "حالة التوفر", type: "select", options: AVAILABILITY_SELECT, half: true },
      { name: "logoUrl", label: "شعار الشركة", type: "image" },
      { name: "coverUrl", label: "صورة / غلاف", type: "image" },
      { name: "description", label: "وصف مختصر", type: "textarea", rows: 3 },
      { name: "routeSummary", label: "خط السير", type: "text", help: "مثال: إب - صنعاء - جدة" },
      { name: "cities", label: "المدن التي تخدمها (كل سطر مدينة)", type: "list" },
      { name: "contactInfo", label: "معلومات التواصل عند الحاجة", type: "textarea", rows: 2 },
      {
        name: "isOfficialPartner",
        label: "شريك رسمي (لا تفعّل إلا بعد تأكيد الإدارة)",
        type: "boolean",
        half: true,
      },
      { name: "isActive", label: "ظاهرة في الموقع", type: "boolean", half: true },
      { name: "sortOrder", label: "الترتيب", type: "number", half: true },
    ],
  },
  "bus-routes": {
    name: "bus-routes",
    label: "خطوط سير الباصات",
    singular: "خط سير",
    description: "حدد خطوط السير والمواعيد التقريبية لكل شركة نقل.",
    table: busRoutes,
    orderMode: "sort",
    titleField: "origin",
    columns: [
      { name: "companyName", label: "الشركة", type: "badge" },
      { name: "origin", label: "الانطلاق" },
      { name: "destination", label: "الوصول" },
      { name: "departureInfo", label: "المواعيد" },
      { name: "isActive", label: "مفعّل", type: "boolean" },
    ],
    fields: [
      { name: "companyName", label: "اسم الشركة", type: "text", required: true },
      { name: "origin", label: "مدينة الانطلاق", type: "text", half: true, required: true },
      { name: "destination", label: "مدينة الوصول", type: "text", half: true, required: true },
      { name: "departureInfo", label: "المواعيد / معلومات الرحلة", type: "text", half: true },
      { name: "priceInfo", label: "معلومة السعر", type: "text", half: true, help: "اتركه فارغاً إن لم يكن مؤكداً" },
      { name: "notes", label: "ملاحظات", type: "textarea", rows: 2 },
      { name: "isActive", label: "مفعّل", type: "boolean", half: true },
      { name: "sortOrder", label: "الترتيب", type: "number", half: true },
    ],
  },
  faqs: {
    name: "faqs",
    label: "الأسئلة الشائعة",
    singular: "سؤال",
    description: "أضف الأسئلة والإجابات وترتيبها وإظهارها أو إخفاؤها.",
    table: faqs,
    orderMode: "sort",
    titleField: "question",
    columns: [
      { name: "question", label: "السؤال" },
      { name: "isActive", label: "ظاهر", type: "boolean" },
      { name: "sortOrder", label: "الترتيب" },
    ],
    fields: [
      { name: "question", label: "السؤال", type: "text", required: true },
      { name: "answer", label: "الإجابة", type: "textarea", rows: 4, required: true },
      { name: "sortOrder", label: "الترتيب", type: "number", half: true },
      { name: "isActive", label: "ظاهر في الموقع", type: "boolean", half: true },
    ],
  },
  testimonials: {
    name: "testimonials",
    label: "آراء العملاء",
    singular: "رأي",
    description: "لا يُعرض أي رأي في الموقع إلا بعد إضافته وتفعيله من هنا.",
    table: testimonials,
    orderMode: "newest",
    titleField: "name",
    columns: [
      { name: "name", label: "العميل" },
      { name: "city", label: "المدينة" },
      { name: "rating", label: "التقييم" },
      { name: "isActive", label: "منشور", type: "boolean" },
    ],
    fields: [
      { name: "name", label: "اسم العميل", type: "text", required: true },
      { name: "city", label: "المدينة / المحافظة", type: "text", half: true },
      { name: "rating", label: "التقييم (1-5)", type: "number", half: true },
      { name: "content", label: "نص الرأي", type: "textarea", rows: 4, required: true },
      { name: "sortOrder", label: "الترتيب", type: "number", half: true },
      { name: "isActive", label: "منشور في الموقع", type: "boolean", half: true },
    ],
  },
  benefits: {
    name: "benefits",
    label: "أسباب الاختيار",
    singular: "ميزة",
    description: "أسباب اختيار المكتب التي تظهر في قسم: لماذا تختار مكتب عصام الجسيم؟",
    table: benefits,
    orderMode: "sort",
    titleField: "title",
    columns: [
      { name: "icon", label: "الأيقونة", type: "badge" },
      { name: "title", label: "العنوان" },
      { name: "isActive", label: "ظاهر", type: "boolean" },
      { name: "sortOrder", label: "الترتيب" },
    ],
    fields: [
      { name: "title", label: "العنوان", type: "text", required: true },
      { name: "icon", label: "الأيقونة", type: "select", options: ICON_SELECT, half: true },
      { name: "description", label: "الوصف", type: "textarea", rows: 3 },
      { name: "sortOrder", label: "الترتيب", type: "number", half: true },
      { name: "isActive", label: "ظاهر في الموقع", type: "boolean", half: true },
    ],
  },
  stats: {
    name: "stats",
    label: "المعلومات السريعة",
    singular: "معلومة",
    description: "أرقام أو معلومات سريعة تظهر أسفل أسباب الاختيار.",
    table: stats,
    orderMode: "sort",
    titleField: "value",
    columns: [
      { name: "value", label: "القيمة" },
      { name: "label", label: "الوصف" },
      { name: "isActive", label: "ظاهر", type: "boolean" },
    ],
    fields: [
      { name: "value", label: "القيمة", type: "text", required: true },
      { name: "label", label: "الوصف", type: "text", required: true },
      { name: "sortOrder", label: "الترتيب", type: "number", half: true },
      { name: "isActive", label: "ظاهر في الموقع", type: "boolean", half: true },
    ],
  },
  sections: {
    name: "sections",
    label: "أقسام الصفحة الرئيسية",
    singular: "قسم",
    description: "تحكم بعناوين ونصوص وصور كل قسم في الصفحة الرئيسية، وإظهاره أو إخفائه وترتيبه.",
    table: homeSections,
    orderMode: "sort",
    titleField: "label",
    columns: [
      { name: "label", label: "القسم" },
      { name: "title", label: "العنوان" },
      { name: "isVisible", label: "ظاهر", type: "boolean" },
      { name: "sortOrder", label: "الترتيب" },
    ],
    fields: [
      { name: "label", label: "اسم القسم داخل لوحة التحكم", type: "text", required: true },
      { name: "title", label: "العنوان الرئيسي", type: "text" },
      { name: "subtitle", label: "العنوان الفرعي", type: "text" },
      { name: "description", label: "النص التعريفي", type: "textarea", rows: 3 },
      { name: "imageUrl", label: "صورة القسم", type: "image" },
      { name: "sortOrder", label: "ترتيب القسم", type: "number", half: true },
      { name: "isVisible", label: "القسم ظاهر في الموقع", type: "boolean", half: true },
    ],
  },
};

export function getResourceConfig(name: string) {
  return RESOURCE_CONFIGS[name] ?? null;
}
