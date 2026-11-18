import { desc } from "drizzle-orm";
import { db } from "@/db";
import { bookingRequests, contactMessages } from "@/db/schema";
import { requireSession } from "@/lib/auth";
import RequestsManager, { type MessageRow, type RequestRow } from "@/components/admin/requests-manager";

export const dynamic = "force-dynamic";

export default async function AdminRequestsPage() {
  await requireSession();

  const requestRows = await db
    .select()
    .from(bookingRequests)
    .orderBy(desc(bookingRequests.createdAt));
  const messageRows = await db
    .select()
    .from(contactMessages)
    .orderBy(desc(contactMessages.createdAt));

  const requests: RequestRow[] = requestRows.map((row) => ({
    id: row.id,
    reference: row.reference,
    type: row.type,
    serviceTitle: row.serviceTitle,
    customerName: row.customerName,
    phone: row.phone,
    city: row.city,
    originCity: row.originCity,
    destinationCity: row.destinationCity,
    preferredCompany: row.preferredCompany,
    travelDate: row.travelDate,
    passengers: row.passengers,
    details: row.details,
    status: row.status,
    adminNotes: row.adminNotes,
    createdAt: row.createdAt.toISOString(),
  }));

  const messages: MessageRow[] = messageRows.map((row) => ({
    id: row.id,
    name: row.name,
    phone: row.phone,
    subject: row.subject,
    message: row.message,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  }));

  return <RequestsManager requests={requests} messages={messages} />;
}
