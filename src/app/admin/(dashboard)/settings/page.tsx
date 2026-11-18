import { requireSession } from "@/lib/auth";
import { getSettings } from "@/lib/data";
import SettingsForm, { type SettingsValues } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  await requireSession();
  const settings = await getSettings();

  const initial: SettingsValues = {
    officeName: settings.officeName,
    officeShortName: settings.officeShortName,
    tagline: settings.tagline,
    logoUrl: settings.logoUrl,
    faviconUrl: settings.faviconUrl,
    phone: settings.phone,
    phoneSecondary: settings.phoneSecondary,
    whatsappNumber: settings.whatsappNumber,
    whatsappLink: settings.whatsappLink,
    email: settings.email,
    address: settings.address,
    mapsLink: settings.mapsLink,
    facebookUrl: settings.facebookUrl,
    tiktokUrl: settings.tiktokUrl,
    workingHours: settings.workingHours,
    workingHoursNote: settings.workingHoursNote,
    availabilityStatus: settings.availabilityStatus,
    aboutText: settings.aboutText,
    colorPrimary: settings.colorPrimary,
    colorNavy: settings.colorNavy,
    colorAccent: settings.colorAccent,
    colorBackground: settings.colorBackground,
    colorSurface: settings.colorSurface,
    seoTitle: settings.seoTitle,
    seoDescription: settings.seoDescription,
    seoKeywords: settings.seoKeywords,
    ogImage: settings.ogImage,
    whatsappPopupEnabled: settings.whatsappPopupEnabled,
    whatsappPopupTitle: settings.whatsappPopupTitle,
    whatsappPopupMessage: settings.whatsappPopupMessage,
    whatsappPopupButton: settings.whatsappPopupButton,
    whatsappPopupDelay: settings.whatsappPopupDelay,
    copyrightText: settings.copyrightText,
    footerNote: settings.footerNote,
  };

  return <SettingsForm initial={initial} />;
}
