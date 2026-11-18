import {
  pgTable,
  serial,
  integer,
  text,
  varchar,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

/* -------------------------------------------------------------------------- */
/*  المستخدمون الإداريون                                                       */
/* -------------------------------------------------------------------------- */
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 190 }).notNull().unique(),
  name: varchar("name", { length: 190 }).notNull().default("مدير الموقع"),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 40 }).notNull().default("admin"),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* -------------------------------------------------------------------------- */
/*  إعدادات الموقع العامة (سجل واحد)                                           */
/* -------------------------------------------------------------------------- */
export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  officeName: text("office_name").notNull().default("مكتب عصام الجسيم للسفريات والسياحة"),
  officeShortName: text("office_short_name").notNull().default("عصام الجسيم"),
  tagline: text("tagline").notNull().default("للسفريات والسياحة"),
  logoUrl: text("logo_url").notNull().default(""),
  faviconUrl: text("favicon_url").notNull().default(""),

  phone: text("phone").notNull().default("+967 781 808 012"),
  phoneSecondary: text("phone_secondary").notNull().default(""),
  whatsappNumber: text("whatsapp_number").notNull().default("967781808012"),
  whatsappLink: text("whatsapp_link").notNull().default("https://wa.me/967781808012"),
  email: text("email").notNull().default(""),

  address: text("address").notNull().default("إب - فرزة الدليل - شارع صنعاء القديم - أمام صرافة عصام الجسيم - اليمن"),
  mapsLink: text("maps_link").notNull().default("https://maps.app.goo.gl/BPRWLCdunVYsYCuG9"),
  facebookUrl: text("facebook_url").notNull().default("https://www.facebook.com/share/1FTqMpeTib/"),
  tiktokUrl: text("tiktok_url").notNull().default("https://www.tiktok.com/@essam_028"),

  workingHours: text("working_hours").notNull().default("السبت - الخميس: 8:00 صباحاً - 9:00 مساءً"),
  workingHoursNote: text("working_hours_note").notNull().default("الجمعة: من بعد صلاة الجمعة حتى 8 مساءً"),
  availabilityStatus: varchar("availability_status", { length: 40 }).notNull().default("open"),
  aboutText: text("about_text").notNull().default(""),

  /* ألوان الهوية */
  colorPrimary: varchar("color_primary", { length: 20 }).notNull().default("#0b3f52"),
  colorNavy: varchar("color_navy", { length: 20 }).notNull().default("#0a2540"),
  colorAccent: varchar("color_accent", { length: 20 }).notNull().default("#c9a227"),
  colorBackground: varchar("color_background", { length: 20 }).notNull().default("#faf7f0"),
  colorSurface: varchar("color_surface", { length: 20 }).notNull().default("#ffffff"),

  /* SEO */
  seoTitle: text("seo_title").notNull().default(""),
  seoDescription: text("seo_description").notNull().default(""),
  seoKeywords: text("seo_keywords").notNull().default(""),
  ogImage: text("og_image").notNull().default(""),

  /* نافذة واتساب المنبثقة */
  whatsappPopupEnabled: boolean("whatsapp_popup_enabled").notNull().default(true),
  whatsappPopupTitle: text("whatsapp_popup_title").notNull().default(""),
  whatsappPopupMessage: text("whatsapp_popup_message").notNull().default(""),
  whatsappPopupButton: text("whatsapp_popup_button").notNull().default("تحدث معنا عبر واتساب"),
  whatsappPopupDelay: integer("whatsapp_popup_delay").notNull().default(12000),

  /* التذييل */
  copyrightText: text("copyright_text").notNull().default(""),
  footerNote: text("footer_note").notNull().default(""),

  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/* -------------------------------------------------------------------------- */
/*  أقسام الصفحة الرئيسية (إظهار/إخفاء/ترتيب)                                  */
/* -------------------------------------------------------------------------- */
export const homeSections = pgTable("home_sections", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 60 }).notNull().unique(),
  label: varchar("label", { length: 120 }).notNull().default(""),
  title: text("title").notNull().default(""),
  subtitle: text("subtitle").notNull().default(""),
  description: text("description").notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  isVisible: boolean("is_visible").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

/* -------------------------------------------------------------------------- */
/*  الخدمات                                                                    */
/* -------------------------------------------------------------------------- */
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  title: text("title").notNull(),
  shortDescription: text("short_description").notNull().default(""),
  description: text("description").notNull().default(""),
  icon: varchar("icon", { length: 40 }).notNull().default("plane"),
  imageUrl: text("image_url").notNull().default(""),
  features: jsonb("features").$type<string[]>().notNull().default([]),
  isActive: boolean("is_active").notNull().default(true),
  showOnHome: boolean("show_on_home").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/* -------------------------------------------------------------------------- */
/*  العروض والبرامج والمنتجات                                                  */
/* -------------------------------------------------------------------------- */
export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 140 }).notNull().unique(),
  title: text("title").notNull(),
  category: varchar("category", { length: 80 }).notNull().default("برامج سياحية"),
  summary: text("summary").notNull().default(""),
  details: text("details").notNull().default(""),
  price: text("price").notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  gallery: jsonb("gallery").$type<string[]>().notNull().default([]),
  startAt: varchar("start_at", { length: 20 }).notNull().default(""),
  endAt: varchar("end_at", { length: 20 }).notNull().default(""),
  isAvailable: boolean("is_available").notNull().default(true),
  isActive: boolean("is_active").notNull().default(true),
  showOnHome: boolean("show_on_home").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/* -------------------------------------------------------------------------- */
/*  شركات الباصات وخطوط السير                                                  */
/* -------------------------------------------------------------------------- */
export const busCompanies = pgTable("bus_companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  description: text("description").notNull().default(""),
  routeSummary: text("route_summary").notNull().default(""),
  cities: jsonb("cities").$type<string[]>().notNull().default([]),
  logoUrl: text("logo_url").notNull().default(""),
  coverUrl: text("cover_url").notNull().default(""),
  contactInfo: text("contact_info").notNull().default(""),
  availability: varchar("availability", { length: 40 }).notNull().default("available"),
  isOfficialPartner: boolean("is_official_partner").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const busRoutes = pgTable("bus_routes", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id"),
  companyName: text("company_name").notNull().default(""),
  origin: text("origin").notNull().default(""),
  destination: text("destination").notNull().default(""),
  departureInfo: text("departure_info").notNull().default(""),
  priceInfo: text("price_info").notNull().default(""),
  notes: text("notes").notNull().default(""),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* -------------------------------------------------------------------------- */
/*  طلبات الحجز والاستفسارات                                                   */
/* -------------------------------------------------------------------------- */
export const bookingRequests = pgTable("booking_requests", {
  id: serial("id").primaryKey(),
  reference: varchar("reference", { length: 30 }).notNull().unique(),
  type: varchar("type", { length: 40 }).notNull().default("general"),
  serviceTitle: text("service_title").notNull().default(""),
  customerName: text("customer_name").notNull(),
  phone: varchar("phone", { length: 60 }).notNull(),
  city: text("city").notNull().default(""),
  originCity: text("origin_city").notNull().default(""),
  destinationCity: text("destination_city").notNull().default(""),
  preferredCompany: text("preferred_company").notNull().default(""),
  travelDate: varchar("travel_date", { length: 20 }).notNull().default(""),
  passengers: integer("passengers").notNull().default(1),
  details: text("details").notNull().default(""),
  status: varchar("status", { length: 40 }).notNull().default("new"),
  adminNotes: text("admin_notes").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: varchar("phone", { length: 60 }).notNull(),
  subject: text("subject").notNull().default(""),
  message: text("message").notNull().default(""),
  status: varchar("status", { length: 40 }).notNull().default("new"),
  adminNotes: text("admin_notes").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* -------------------------------------------------------------------------- */
/*  الأسئلة الشائعة وآراء العملاء والمزايا والأرقام                             */
/* -------------------------------------------------------------------------- */
export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull().default(""),
  rating: integer("rating").notNull().default(5),
  content: text("content").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const benefits = pgTable("benefits", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  icon: varchar("icon", { length: 40 }).notNull().default("shield"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  value: text("value").notNull(),
  label: text("label").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

/* -------------------------------------------------------------------------- */
/*  مكتبة الوسائط                                                              */
/* -------------------------------------------------------------------------- */
export const mediaFiles = pgTable("media_files", {
  id: serial("id").primaryKey(),
  originalName: text("original_name").notNull().default(""),
  fileName: text("file_name").notNull(),
  mimeType: varchar("mime_type", { length: 80 }).notNull(),
  size: integer("size").notNull().default(0),
  url: text("url").notNull(),
  alt: text("alt").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type SiteSettings = typeof siteSettings.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Offer = typeof offers.$inferSelect;
export type BusCompany = typeof busCompanies.$inferSelect;
export type BusRoute = typeof busRoutes.$inferSelect;
export type BookingRequest = typeof bookingRequests.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type Faq = typeof faqs.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type Benefit = typeof benefits.$inferSelect;
export type Stat = typeof stats.$inferSelect;
export type MediaFile = typeof mediaFiles.$inferSelect;
export type HomeSection = typeof homeSections.$inferSelect;
