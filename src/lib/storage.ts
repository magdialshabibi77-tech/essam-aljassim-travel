import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { mediaFiles, type MediaFile } from "@/db/schema";

export const MAX_UPLOAD_BYTES = 6 * 1024 * 1024; // 6MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "image/x-icon", "image/avif"];

function resolveDir() {
  const configured = process.env.UPLOAD_DIR;
  if (configured) return path.resolve(configured);
  return path.join(process.cwd(), "storage", "uploads");
}

async function ensureDir(dir: string) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch {
    /* Read-only filesystem in serverless environments */
  }
}

function extensionFor(type: string, originalName: string) {
  const fromName = path.extname(originalName || "").toLowerCase();
  if (fromName && fromName.length <= 6) return fromName;
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
    "image/x-icon": ".ico",
    "image/avif": ".avif",
  };
  return map[type] ?? ".bin";
}

export function sanitizeFileName(name: string) {
  const base = (name || "image").replace(/[^\p{L}\p{N}._-]+/gu, "-").slice(-80);
  return base.replace(/^[-.]+/, "") || "image";
}

export type UploadResult = { ok: true; file: MediaFile } | { ok: false; error: string };

export async function saveUpload(
  file: File,
  options: { alt?: string } = {},
): Promise<UploadResult> {
  if (!file || typeof file === "string") {
    return { ok: false, error: "لم يتم إرسال أي ملف" };
  }

  let mime = (file.type || "").toLowerCase().trim();
  const ext = path.extname(file.name || "").toLowerCase();

  // تصحيح نوع الملف إذا لم يكن مرسلاً بدقة من المتصفح
  if (!mime || mime === "application/octet-stream") {
    if (ext === ".jpg" || ext === ".jpeg") mime = "image/jpeg";
    else if (ext === ".png") mime = "image/png";
    else if (ext === ".webp") mime = "image/webp";
    else if (ext === ".gif") mime = "image/gif";
    else if (ext === ".svg") mime = "image/svg+xml";
    else if (ext === ".avif") mime = "image/avif";
    else if (ext === ".ico") mime = "image/x-icon";
    else mime = "image/jpeg";
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: "حجم الصورة يتجاوز الحد المسموح (6 ميغابايت)" };
  }
  if (file.size < 32) {
    return { ok: false, error: "الملف غير صالح أو فارغ" };
  }

  const cleanOriginal = sanitizeFileName(file.name);
  const fileName = `${Date.now()}-${randomUUID().slice(0, 8)}${extensionFor(mime, cleanOriginal)}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  // تحقق من صلاحية الصورة
  if (!isKnownImageSignature(buffer) && !mime.startsWith("image/")) {
    return { ok: false, error: "محتوى الملف ليس صورة صالحة" };
  }

  // محاولة الحفظ على القرص المحلي إن كان متاحاً (بيئة التطوير أو سيرفر مخصص)
  try {
    const dir = resolveDir();
    await ensureDir(dir);
    await fs.writeFile(path.join(/*turbopackIgnore: true*/ dir, fileName), buffer);
  } catch {
    /* بيئة Serverless مثل Vercel لا تسمح بالكتابة على القرص المحلي، يتم الحفظ في قاعدة البيانات */
  }

  const base64Data = buffer.toString("base64");

  const [record] = await db
    .insert(mediaFiles)
    .values({
      originalName: cleanOriginal,
      fileName,
      mimeType: mime,
      size: file.size,
      url: `/api/files/${fileName}`,
      alt: options.alt?.slice(0, 200) ?? "",
      data: base64Data,
    })
    .returning();

  return { ok: true, file: record };
}

function isKnownImageSignature(buffer: Buffer) {
  const len = buffer.length;
  if (len < 4) return false;
  const b0 = buffer[0];
  const b1 = buffer[1];
  // JPEG: Starts with 0xFF, 0xD8
  if (b0 === 0xff && b1 === 0xd8) return true;
  // PNG: Starts with 0x89, 0x50, 0x4E, 0x47
  if (b0 === 0x89 && b1 === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return true;
  // GIF: Starts with GIF
  if (b0 === 0x47 && b1 === 0x49 && buffer[2] === 0x46) return true;
  // SVG: Starts with <svg or <?xml
  if (
    buffer.slice(0, 4).toString("ascii").startsWith("<svg") ||
    buffer.slice(0, 12).toString("ascii").includes("<svg") ||
    buffer.slice(0, 5).toString("ascii").startsWith("<?xml")
  )
    return true;
  // WebP / RIFF container
  if (
    buffer.slice(0, 4).toString("ascii") === "RIFF" &&
    buffer.slice(8, 12).toString("ascii") === "WEBP"
  )
    return true;
  // AVIF / ISO BMFF container
  const brand = buffer.slice(4, 8).toString("ascii");
  if (brand === "ftyp") return true;
  // ICO
  if (b0 === 0x00 && b1 === 0x00 && buffer[2] === 0x01 && buffer[3] === 0x00) return true;
  return false;
}

export async function readStoredFile(fileName: string): Promise<Buffer | null> {
  if (!/^[A-Za-z0-9._-]+$/.test(fileName)) return null;

  // 1. القراءة من قاعدة البيانات السحابية (دائمة وتعمل 100% على Vercel و Serverless)
  try {
    const rows = await db
      .select({ data: mediaFiles.data })
      .from(mediaFiles)
      .where(eq(mediaFiles.fileName, fileName))
      .limit(1);

    if (rows[0]?.data) {
      return Buffer.from(rows[0].data, "base64");
    }
  } catch (err) {
    console.error("DB read file error:", err);
  }

  // 2. المحاولة البديلة من القرص المحلي إن وجد
  const dir = resolveDir();
  try {
    const buffer = await fs.readFile(path.join(/*turbopackIgnore: true*/ dir, fileName));
    return buffer;
  } catch {
    return null;
  }
}

export async function deleteStoredFile(fileName: string) {
  if (!/^[A-Za-z0-9._-]+$/.test(fileName)) return;
  const dir = resolveDir();
  try {
    await fs.unlink(path.join(/*turbopackIgnore: true*/ dir, fileName));
  } catch {
    /* الملف غير موجود أو القرص للقراءة فقط */
  }
}

export async function listMedia(limit = 200) {
  return db
    .select({
      id: mediaFiles.id,
      originalName: mediaFiles.originalName,
      fileName: mediaFiles.fileName,
      mimeType: mediaFiles.mimeType,
      size: mediaFiles.size,
      url: mediaFiles.url,
      alt: mediaFiles.alt,
      data: mediaFiles.data,
      createdAt: mediaFiles.createdAt,
    })
    .from(mediaFiles)
    .orderBy(desc(mediaFiles.id))
    .limit(limit);
}
