import "server-only";
import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  benefits,
  busCompanies,
  busRoutes,
  faqs,
  homeSections,
  offers,
  services,
  siteSettings,
  stats,
  testimonials,
  type BusCompany,
  type HomeSection,
  type SiteSettings,
} from "@/db/schema";
import { ensureBootstrap } from "@/lib/seed";

export type SectionMap = Record<string, HomeSection>;

export async function getSettings(): Promise<SiteSettings> {
  await ensureBootstrap();
  const rows = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);
  return rows[0];
}

export async function getSections(): Promise<SectionMap> {
  await ensureBootstrap();
  const rows = await db.select().from(homeSections).orderBy(asc(homeSections.sortOrder));
  const map: SectionMap = {};
  for (const row of rows) map[row.key] = row;
  return map;
}

export async function getServices(activeOnly = true) {
  await ensureBootstrap();
  const rows = await db.select().from(services).orderBy(asc(services.sortOrder), asc(services.id));
  return activeOnly ? rows.filter((row) => row.isActive) : rows;
}

export async function getServiceBySlug(slug: string) {
  await ensureBootstrap();
  const rows = await db
    .select()
    .from(services)
    .where(eq(services.slug, slug))
    .limit(1);
  const service = rows[0];
  if (!service || !service.isActive) return null;
  return service;
}

export async function getOffers(activeOnly = true) {
  await ensureBootstrap();
  const rows = await db.select().from(offers).orderBy(asc(offers.sortOrder), desc(offers.id));
  return activeOnly ? rows.filter((row) => row.isActive) : rows;
}

export async function getOfferBySlug(slug: string) {
  await ensureBootstrap();
  const rows = await db.select().from(offers).where(eq(offers.slug, slug)).limit(1);
  const offer = rows[0];
  if (!offer || !offer.isActive) return null;
  return offer;
}

export async function getBusCompanies(activeOnly = true): Promise<BusCompany[]> {
  await ensureBootstrap();
  const rows = await db
    .select()
    .from(busCompanies)
    .orderBy(asc(busCompanies.sortOrder), asc(busCompanies.id));
  return activeOnly ? rows.filter((row) => row.isActive) : rows;
}

export async function getBusRoutes(activeOnly = true) {
  await ensureBootstrap();
  const rows = await db
    .select()
    .from(busRoutes)
    .orderBy(asc(busRoutes.sortOrder), asc(busRoutes.id));
  return activeOnly ? rows.filter((row) => row.isActive) : rows;
}

export async function getFaqs(activeOnly = true) {
  await ensureBootstrap();
  const rows = await db.select().from(faqs).orderBy(asc(faqs.sortOrder), asc(faqs.id));
  return activeOnly ? rows.filter((row) => row.isActive) : rows;
}

export async function getTestimonials(activeOnly = true) {
  await ensureBootstrap();
  const rows = await db
    .select()
    .from(testimonials)
    .orderBy(asc(testimonials.sortOrder), desc(testimonials.id));
  return activeOnly ? rows.filter((row) => row.isActive) : rows;
}

export async function getBenefits(activeOnly = true) {
  await ensureBootstrap();
  const rows = await db.select().from(benefits).orderBy(asc(benefits.sortOrder), asc(benefits.id));
  return activeOnly ? rows.filter((row) => row.isActive) : rows;
}

export async function getStats(activeOnly = true) {
  await ensureBootstrap();
  const rows = await db.select().from(stats).orderBy(asc(stats.sortOrder), asc(stats.id));
  return activeOnly ? rows.filter((row) => row.isActive) : rows;
}

export async function getCompanyWithRoutes(slug: string) {
  const company = (await getBusCompanies()).find((c) => c.slug === slug) ?? null;
  if (!company) return null;
  const routes = (await getBusRoutes()).filter((r) => r.companyId === company.id);
  return { company, routes };
}

export { and };
