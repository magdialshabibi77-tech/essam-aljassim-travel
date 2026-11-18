import { readStoredFile } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  const buffer = await readStoredFile(name);
  if (!buffer) {
    return new Response("الملف غير موجود", { status: 404 });
  }

  let contentType = "application/octet-stream";
  const lower = name.toLowerCase();
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) contentType = "image/jpeg";
  else if (lower.endsWith(".png")) contentType = "image/png";
  else if (lower.endsWith(".webp")) contentType = "image/webp";
  else if (lower.endsWith(".gif")) contentType = "image/gif";
  else if (lower.endsWith(".svg")) contentType = "image/svg+xml";
  else if (lower.endsWith(".avif")) contentType = "image/avif";
  else if (lower.endsWith(".ico")) contentType = "image/x-icon";

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": "inline",
    },
  });
}
