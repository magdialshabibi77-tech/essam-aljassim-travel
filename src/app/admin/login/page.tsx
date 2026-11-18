import { Suspense } from "react";
import Link from "next/link";
import LoginForm from "@/components/admin/login-form";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const settings = await getSettings();

  return (
    <div className="relative grid min-h-screen place-items-center navy-mesh px-4 py-10 text-white">
      <div className="absolute inset-0 pattern-arabesque opacity-30" aria-hidden="true" />
      <Suspense
        fallback={
          <div className="rounded-3xl bg-white/95 px-10 py-8 text-navy">جارٍ التحميل...</div>
        }
      >
        <LoginForm officeName={settings.officeShortName} />
      </Suspense>
      <p className="mt-8 text-center text-xs text-white/60">
        <Link href="/" className="hover:text-white">
          ← العودة إلى الموقع
        </Link>
      </p>
    </div>
  );
}
