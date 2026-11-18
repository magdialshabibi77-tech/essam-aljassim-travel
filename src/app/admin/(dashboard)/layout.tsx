import type { ReactNode } from "react";
import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { bookingRequests, contactMessages } from "@/db/schema";
import { requireSession } from "@/lib/auth";
import { ensureBootstrap } from "@/lib/seed";
import { getSettings } from "@/lib/data";
import AdminShell from "@/components/admin/shell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await ensureBootstrap();
  const session = await requireSession();
  const settings = await getSettings();

  const [newBookings] = await db
    .select({ value: count() })
    .from(bookingRequests)
    .where(eq(bookingRequests.status, "new"));
  const [newMessages] = await db
    .select({ value: count() })
    .from(contactMessages)
    .where(eq(contactMessages.status, "new"));

  return (
    <AdminShell
      userName={session.name}
      officeName={settings.officeShortName}
      newCount={Number(newBookings?.value ?? 0) + Number(newMessages?.value ?? 0)}
    >
      {children}
    </AdminShell>
  );
}
