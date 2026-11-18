import { desc } from "drizzle-orm";
import { db } from "@/db";
import { mediaFiles } from "@/db/schema";
import { requireSession } from "@/lib/auth";
import MediaManager, { type MediaItem } from "@/components/admin/media-manager";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  await requireSession();
  const rows = await db.select().from(mediaFiles).orderBy(desc(mediaFiles.id)).limit(300);

  const items: MediaItem[] = rows.map((row) => ({
    id: row.id,
    url: row.url,
    originalName: row.originalName,
    mimeType: row.mimeType,
    size: row.size,
    alt: row.alt,
    createdAt: row.createdAt.toISOString(),
  }));

  return <MediaManager initial={items} />;
}
