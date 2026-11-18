import "server-only";
import { getResourceConfig, type FieldConfig } from "@/lib/admin-resources";

export function serializeRow(row: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    out[key] = value instanceof Date ? value.toISOString() : value;
  }
  return out;
}

export function serializeRows(rows: Record<string, unknown>[]) {
  return rows.map(serializeRow);
}

function coerce(field: FieldConfig, raw: unknown) {
  switch (field.type) {
    case "number": {
      if (raw === "" || raw === null || raw === undefined) return 0;
      const num = Number(raw);
      return Number.isFinite(num) ? Math.trunc(num) : 0;
    }
    case "boolean": {
      if (typeof raw === "boolean") return raw;
      if (raw === "true" || raw === "1" || raw === 1) return true;
      return Boolean(raw);
    }
    case "list": {
      if (Array.isArray(raw)) return raw.map((item) => String(item)).filter(Boolean);
      if (typeof raw === "string")
        return raw
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean);
      return [];
    }
    case "date": {
      const value = String(raw ?? "").trim();
      return value.slice(0, 20);
    }
    default:
      return typeof raw === "string" ? raw : raw === null || raw === undefined ? "" : String(raw);
  }
}

export function buildPayload(resource: string, body: Record<string, unknown>, partial = false) {
  const config = getResourceConfig(resource);
  if (!config) return null;
  const payload: Record<string, unknown> = {};
  for (const field of config.fields) {
    if (partial && !(field.name in body)) continue;
    payload[field.name] = coerce(field, body[field.name]);
  }
  return { config, payload };
}

export function autoSlug(input: string, fallback: string) {
  const base = input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return base || `${fallback}-${Math.random().toString(36).slice(2, 7)}`;
}
