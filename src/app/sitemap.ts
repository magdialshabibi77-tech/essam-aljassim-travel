import type { MetadataRoute } from "next";
import { getOffers, getServices } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const [services, offers] = await Promise.all([getServices(), getOffers()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/services`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/offers`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/buses`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.7 },
  ];

  return [
    ...staticRoutes,
    ...services.map((service) => ({
      url: `${base}/services/${service.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...offers.map((offer) => ({
      url: `${base}/offers/${offer.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
