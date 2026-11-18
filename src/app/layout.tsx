import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { getSettings } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title =
    settings.seoTitle?.trim() ||
    `${settings.officeName} | تأشيرات وتذاكر طيران وعمرة وحجوزات باصات - إب`;
  const description =
    settings.seoDescription?.trim() ||
    `${settings.officeName} — ${settings.aboutText || settings.tagline}. ${settings.address}`;
  const images = settings.ogImage ? [settings.ogImage] : undefined;

  return {
    title: {
      default: title,
      template: `%s | ${settings.officeShortName}`,
    },
    description,
    keywords: settings.seoKeywords
      ? settings.seoKeywords.split(",").map((k) => k.trim()).filter(Boolean)
      : undefined,
    applicationName: settings.officeName,
    icons: settings.faviconUrl ? { icon: settings.faviconUrl } : undefined,
    metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
    openGraph: {
      title,
      description,
      type: "website",
      locale: "ar_YE",
      siteName: settings.officeName,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
    robots: { index: true, follow: true },
  };
}

function colorVars(settings: Awaited<ReturnType<typeof getSettings>>) {
  return {
    "--brand-primary": settings.colorPrimary,
    "--brand-navy": settings.colorNavy,
    "--brand-gold": settings.colorAccent,
    "--brand-ivory": settings.colorBackground,
    "--brand-surface": settings.colorSurface,
  } as React.CSSProperties;
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: settings.officeName,
    description: settings.aboutText || settings.seoDescription,
    telephone: settings.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "إب",
      addressCountry: "YE",
    },
    areaServed: "Ibb, Yemen",
    url: process.env.SITE_URL || undefined,
    sameAs: [settings.facebookUrl, settings.tiktokUrl].filter(Boolean),
    openingHours: settings.workingHours,
    hasMap: settings.mapsLink,
  };

  return (
    <html lang="ar" dir="rtl" style={colorVars(settings)} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800;900&family=Tajawal:wght@300;400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content={settings.colorPrimary} />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
