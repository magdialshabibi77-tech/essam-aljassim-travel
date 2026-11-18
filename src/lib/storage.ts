import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
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
  await fs.mkdir(dir, { recursive: true });
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
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { ok: false, error: `نوع الملف غير مدعوم (${file.type}). الصيغ المسموحة: JPG, PNG, WEBP, GIF, SVG` };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: "حجم الصورة يتجاوز الحد المسموح (6 ميغابايت)" };
  }
  if (file.size < 64) {
    return { ok: false, error: "الملف غير صالح أو تالف" };
  }

  const dir = resolveDir();
  await ensureDir(dir);

  const cleanOriginal = sanitizeFileName(file.name);
  const fileName = `${Date.now()}-${randomUUID().slice(0, 8)}${extensionFor(file.type, cleanOriginal)}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  // تحقق من التوقيع الحقيقي للملف وليس الاعتماد على نوع MIME فقط
  if (!isKnownImageSignature(buffer)) {
    return { ok: false, error: "محتوى الملف ليس صورة صالحة" };
  }

  await fs.writeFile(path.join(/*turbopackIgnore: true*/ dir, fileName), buffer);

  const [record] = await db
    .insert(mediaFiles)
    .values({
      originalName: cleanOriginal,
      fileName,
      mimeType: file.type,
      size: file.size,
      url: `/api/files/${fileName}`,
      alt: options.alt?.slice(0, 200) ?? "",
    })
    .returning();

  return { ok: true, file: record };
}

function isKnownImageSignature(buffer: Buffer) {
  const len = buffer.length;
  if (len < 12) return false;
  const b0 = buffer[0];
  const b1 = buffer[1];
  const b2 = buffer[2];
  const b3 = buffer[3];
  if (b0 === 0xff && b1 === 0xd8 && b2 === 0xff) return true; // jpeg
  if (b0 === 0x89 && b1 === 0x50 && b2 === 0x4e && b3 === 0x47) return true; // png
  if (b0 === 0x47 && b1 === 0x49 && b2 === 0x46) return true; // gif
  if (b0 === 0x3c && b1 === 0x3f && b2 === 0x78 && b3 === 0x6d) return true; // <?xm (svg)
  if (
    buffer.slice(0, 4).toString("ascii").startsWith("<svg") ||
    buffer.slice(0, 12).toString("ascii").includes("<svg")
  )
    return true;
  const brand = buffer.slice(4, 8).toString("ascii");
  if (brand === "ftyp") return true; // avif / webp container
  if (
    buffer.slice(0, 4).toString("ascii") === "RIFF" &&
    buffer.slice(8, 12).toString("ascii") === "WEBP"
  )
    return true;
  if (b0 === 0x00 && b1 === 0x00 && b2 === 0x01 && b3 === 0x00) return true; // ico
  return false;
}

export async function readStoredFile(fileName: string) {
  if (!/^[A-Za-z0-9._-]+$/.test(fileName)) return null;
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
    /* الملف غير موجود */
  }
}

export async function listMedia(limit = 200) {
  return db.select().from(mediaFiles).orderBy(mediaFiles.id).limit(limit);
}
