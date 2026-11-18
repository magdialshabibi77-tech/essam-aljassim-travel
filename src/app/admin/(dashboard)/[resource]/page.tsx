import { notFound } from "next/navigation";
import { asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { requireSession } from "@/lib/auth";
import { getResourceConfig } from "@/lib/admin-resources";
import { serializeRows } from "@/lib/resource-io";
import ResourceManager, {
  type AdminResourceConfig,
} from "@/components/admin/resource-manager";

export const dynamic = "force-dynamic";

export default async function AdminResourcePage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  await requireSession();
  const { resource } = await params;
  const config = getResourceConfig(resource);
  if (!config) notFound();

  const base = db.select().from(config.table);
  const rows =
    config.orderMode === "newest"
      ? await base.orderBy(desc(config.table.id))
      : config.orderMode === "oldest"
        ? await base.orderBy(asc(config.table.id))
        : await base.orderBy(asc(config.table.sortOrder), asc(config.table.id));

  const serializable: AdminResourceConfig = {
    name: config.name,
    label: config.label,
    singular: config.singular,
    description: config.description,
    titleField: config.titleField,
    fields: config.fields,
    columns: config.columns,
  };

  return (
    <ResourceManager
      config={serializable}
      initialRows={serializeRows(rows as unknown as Record<string, unknown>[])}
    />
  );
}
