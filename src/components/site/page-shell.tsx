import type { ReactNode } from "react";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";
import WhatsAppFloat from "@/components/site/whatsapp-float";
import type { Service, SiteSettings } from "@/db/schema";

type PageShellProps = {
  settings: SiteSettings;
  services: Service[];
  children: ReactNode;
};

export default function PageShell({ settings, services, children }: PageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <Navbar
        officeName={settings.officeName}
        tagline={settings.tagline}
        logoUrl={settings.logoUrl}
        phone={settings.phone}
        whatsapp={settings.whatsappNumber}
        availabilityLabel={settings.availabilityStatus === "open" ? "المكتب مفتوح الآن" : ""}
      />
      <main className="flex-1">{children}</main>
      <Footer
        settings={{
          officeName: settings.officeName,
          officeShortName: settings.officeShortName,
          tagline: settings.tagline,
          logoUrl: settings.logoUrl,
          phone: settings.phone,
          phoneSecondary: settings.phoneSecondary,
          whatsappLink: settings.whatsappLink,
          whatsappNumber: settings.whatsappNumber,
          address: settings.address,
          mapsLink: settings.mapsLink,
          facebookUrl: settings.facebookUrl,
          tiktokUrl: settings.tiktokUrl,
          workingHours: settings.workingHours,
          workingHoursNote: settings.workingHoursNote,
          copyrightText: settings.copyrightText,
          footerNote: settings.footerNote,
          aboutText: settings.aboutText,
        }}
        serviceLinks={services.map((service) => ({
          href: `/services/${service.slug}`,
          label: service.title,
        }))}
      />
      <WhatsAppFloat
        whatsapp={settings.whatsappNumber}
        enabled={settings.whatsappPopupEnabled}
        title={settings.whatsappPopupTitle}
        message={settings.whatsappPopupMessage}
        buttonLabel={settings.whatsappPopupButton}
        delayMs={settings.whatsappPopupDelay}
      />
    </div>
  );
}
