"use client";

import { useMemo, useState } from "react";
import ImagePicker from "@/components/admin/image-picker";

export type AdminFieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "image"
  | "list"
  | "select"
  | "date";

export type AdminField = {
  name: string;
  label: string;
  type: AdminFieldType;
  options?: { value: string; label: string }[];
  placeholder?: string;
  help?: string;
  rows?: number;
  half?: boolean;
  required?: boolean;
};

export type AdminColumn = {
  name: string;
  label: string;
  type?: "image" | "boolean" | "text" | "badge";
};

export type AdminResourceConfig = {
  name: string;
  label: string;
  singular: string;
  description: string;
  titleField: string;
  fields: AdminField[];
  columns: AdminColumn[];
};

type Row = Record<string, unknown>;

function emptyRecord(config: AdminResourceConfig): Row {
  const record: Row = {};
  for (const field of config.fields) {
    if (field.type === "boolean") record[field.name] = field.name !== "sortOrder" ? true : false;
    else if (field.type === "number") record[field.name] = field.name === "sortOrder" ? 0 : field.name === "rating" ? 5 : 1;
    else if (field.type === "list") record[field.name] = [];
    else record[field.name] = "";
  }
  return record;
}

export default function ResourceManager({
  config,
  initialRows,
}: {
  config: AdminResourceConfig;
  initialRows: Row[];
}) {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim();
    if (!term) return rows;
    return rows.filter((row) =>
      Object.values(row).some((value) => String(value ?? "").includes(term)),
    );
  }, [rows, query]);

  function openCreate() {
    setEditing(emptyRecord(config));
    setIsNew(true);
    setError("");
  }

  function openEdit(row: Row) {
    const copy: Row = {};
    for (const field of config.fields) {
      const value = row[field.name];
      copy[field.name] = field.type === "list" && Array.isArray(value) ? (value as string[]).join("\n") : value;
    }
    copy.id = row.id;
    setEditing(copy);
    setIsNew(false);
    setError("");
  }

  function setValue(name: string, value: unknown) {
    setEditing((prev) => (prev ? { ...prev, [name]: value } : prev));
  }

  async function quickToggle(row: Row, field: string) {
    const next = !row[field];
    setRows((prev) => prev.map((item) => (item.id === row.id ? { ...item, [field]: next } : item)));
    await fetch(`/api/admin/resources/${config.name}/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: next }),
    });
    setNotice("تم التحديث");
    window.setTimeout(() => setNotice(""), 1800);
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    setError("");
    try {
      const payload: Row = {};
      for (const field of config.fields) payload[field.name] = editing[field.name];
      const url = isNew
        ? `/api/admin/resources/${config.name}`
        : `/api/admin/resources/${config.name}/${editing.id}`;
      const response = await fetch(url, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { ok: boolean; row?: Row; error?: string };
      if (!response.ok || !data.ok) {
        setError(data.error || "تعذر الحفظ");
        return;
      }
      const saved = data.row ?? {};
      setRows((prev) => {
        if (isNew) return [...prev, saved];
        return prev.map((item) => (item.id === saved.id ? saved : item));
      });
      setEditing(null);
      setNotice("تم الحفظ بنجاح");
      window.setTimeout(() => setNotice(""), 2200);
    } catch {
      setError("خطأ في الاتصال");
    } finally {
      setSaving(false);
    }
  }

  async function remove(row: Row) {
    if (!window.confirm(`هل تريد حذف هذا العنصر؟ لا يمكن التراجع عن العملية.`)) return;
    setRows((prev) => prev.filter((item) => item.id !== row.id));
    await fetch(`/api/admin/resources/${config.name}/${row.id}`, { method: "DELETE" });
    setNotice("تم الحذف");
    window.setTimeout(() => setNotice(""), 1800);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-navy">{config.label}</h1>
          <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-navy/60">{config.description}</p>
        </div>
        <button type="button" onClick={openCreate} className="btn btn-primary !py-2.5 text-sm">
          + إضافة {config.singular}
        </button>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <input
          className="field max-w-xs text-[13px]"
          placeholder="بحث في العناصر..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <span className="text-xs font-bold text-navy/50">
          {filtered.length} عنصر من أصل {rows.length}
        </span>
        {notice ? (
          <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-extrabold text-emerald-800">
            {notice}
          </span>
        ) : null}
      </div>

      <div className="thin-scroll mt-4 overflow-x-auto rounded-3xl border border-navy/10 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-right">
          <thead className="bg-ivory text-[11px] font-extrabold text-navy/60">
            <tr>
              {config.columns.map((column) => (
                <th key={column.name} className="px-4 py-3">
                  {column.label}
                </th>
              ))}
              <th className="px-4 py-3">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy/8 text-[13px]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={config.columns.length + 1} className="px-4 py-10 text-center text-navy/50">
                  لا توجد عناصر بعد — ابدأ بإضافة {config.singular} جديد.
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr key={String(row.id)} className="transition hover:bg-ivory/60">
                  {config.columns.map((column) => {
                    const value = row[column.name];
                    return (
                      <td key={column.name} className="px-4 py-3 align-middle">
                        {column.type === "image" ? (
                          value ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={String(value)}
                              alt=""
                              className="h-12 w-16 rounded-xl object-cover ring-1 ring-navy/10"
                            />
                          ) : (
                            <span className="grid h-12 w-16 place-items-center rounded-xl bg-navy/5 text-[10px] text-navy/40">
                              بدون صورة
                            </span>
                          )
                        ) : column.type === "boolean" ? (
                          <button
                            type="button"
                            onClick={() => void quickToggle(row, column.name)}
                            className={`rounded-full px-3 py-1.5 text-[11px] font-extrabold transition ${
                              value
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-navy/8 text-navy/50"
                            }`}
                          >
                            {value ? "نعم" : "لا"}
                          </button>
                        ) : column.type === "badge" ? (
                          <span className="rounded-full bg-gold/15 px-3 py-1.5 text-[11px] font-extrabold text-navy">
                            {String(value ?? "-")}
                          </span>
                        ) : (
                          <span className="line-clamp-2 max-w-[240px] font-semibold text-navy/80">
                            {String(value ?? "-") || "-"}
                          </span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(row)}
                        className="rounded-xl bg-primary px-3 py-2 text-[11px] font-extrabold text-white transition hover:bg-navy"
                      >
                        تعديل
                      </button>
                      <button
                        type="button"
                        onClick={() => void remove(row)}
                        className="rounded-xl border border-rose-200 px-3 py-2 text-[11px] font-extrabold text-rose-600 transition hover:bg-rose-50"
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editing ? (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-navy/60 p-4" onClick={() => setEditing(null)}>
          <div
            className="mx-auto my-6 w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="navy-mesh px-6 py-5 text-white">
              <h2 className="font-display text-xl font-extrabold">
                {isNew ? `إضافة ${config.singular} جديد` : `تعديل ${config.singular}`}
              </h2>
              <p className="mt-1 text-[12px] text-white/60">
                جميع التغييرات تظهر في الموقع مباشرة بعد الحفظ.
              </p>
            </div>

            <div className="thin-scroll max-h-[65vh] overflow-y-auto p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {config.fields.map((field) => (
                  <div
                    key={field.name}
                    className={field.half || field.type === "boolean" ? "sm:col-span-1" : "sm:col-span-2"}
                  >
                    {field.type === "image" ? (
                      <ImagePicker
                        label={field.label}
                        value={String(editing[field.name] ?? "")}
                        onChange={(value) => setValue(field.name, value)}
                        help={field.help}
                      />
                    ) : field.type === "boolean" ? (
                      <label className="flex h-full cursor-pointer items-center gap-3 rounded-2xl border border-navy/12 bg-white px-4 py-3">
                        <input
                          type="checkbox"
                          className="h-5 w-5 accent-[var(--brand-gold)]"
                          checked={Boolean(editing[field.name])}
                          onChange={(event) => setValue(field.name, event.target.checked)}
                        />
                        <span className="text-[13px] font-extrabold text-navy">{field.label}</span>
                      </label>
                    ) : field.type === "list" ? (
                      <div>
                        <label className="label" htmlFor={`f-${field.name}`}>
                          {field.label}
                        </label>
                        <textarea
                          id={`f-${field.name}`}
                          className="field min-h-[110px] resize-y text-[13px]"
                          value={String(editing[field.name] ?? "")}
                          onChange={(event) => setValue(field.name, event.target.value)}
                          placeholder={field.help}
                        />
                        {field.help ? <p className="mt-1 text-[11px] text-navy/50">{field.help}</p> : null}
                      </div>
                    ) : field.type === "textarea" ? (
                      <div>
                        <label className="label" htmlFor={`f-${field.name}`}>
                          {field.label} {field.required ? <span className="text-rose-500">*</span> : null}
                        </label>
                        <textarea
                          id={`f-${field.name}`}
                          className="field resize-y text-[13px]"
                          rows={field.rows ?? 4}
                          value={String(editing[field.name] ?? "")}
                          onChange={(event) => setValue(field.name, event.target.value)}
                          placeholder={field.placeholder}
                        />
                      </div>
                    ) : field.type === "select" ? (
                      <div>
                        <label className="label" htmlFor={`f-${field.name}`}>
                          {field.label}
                        </label>
                        <select
                          id={`f-${field.name}`}
                          className="field text-[13px]"
                          value={String(editing[field.name] ?? "")}
                          onChange={(event) => setValue(field.name, event.target.value)}
                        >
                          <option value="">— اختر —</option>
                          {(field.options ?? []).map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {field.help ? <p className="mt-1 text-[11px] text-navy/50">{field.help}</p> : null}
                      </div>
                    ) : (
                      <div>
                        <label className="label" htmlFor={`f-${field.name}`}>
                          {field.label} {field.required ? <span className="text-rose-500">*</span> : null}
                        </label>
                        <input
                          id={`f-${field.name}`}
                          type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                          className="field text-[13px]"
                          value={String(editing[field.name] ?? "")}
                          onChange={(event) => setValue(field.name, event.target.value)}
                          placeholder={field.placeholder}
                        />
                        {field.help ? <p className="mt-1 text-[11px] text-navy/50">{field.help}</p> : null}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {error ? (
                <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p>
              ) : null}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-navy/10 bg-ivory px-6 py-4">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-xl border border-navy/15 px-4 py-2.5 text-sm font-extrabold text-navy"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => void save()}
                className="btn btn-gold !py-2.5 text-sm"
                disabled={saving}
              >
                {saving ? "جارٍ الحفظ..." : "حفظ التغييرات"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
