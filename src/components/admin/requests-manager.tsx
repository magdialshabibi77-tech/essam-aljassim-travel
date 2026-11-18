"use client";

import { useMemo, useState } from "react";
import { REQUEST_STATUS_COLORS, REQUEST_STATUS_LABELS, REQUEST_TYPE_LABELS, formatDateTime, telLink, waLink } from "@/lib/utils";

export type RequestRow = {
  id: number;
  reference: string;
  type: string;
  serviceTitle: string;
  customerName: string;
  phone: string;
  city: string;
  originCity: string;
  destinationCity: string;
  preferredCompany: string;
  travelDate: string;
  passengers: number;
  details: string;
  status: string;
  adminNotes: string;
  createdAt: string;
};

export type MessageRow = {
  id: number;
  name: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
};

const STATUSES = Object.keys(REQUEST_STATUS_LABELS);
const TYPES = Object.keys(REQUEST_TYPE_LABELS);

export default function RequestsManager({
  requests,
  messages,
}: {
  requests: RequestRow[];
  messages: MessageRow[];
}) {
  const [rows, setRows] = useState(requests);
  const [msgs, setMsgs] = useState(messages);
  const [tab, setTab] = useState<"requests" | "messages">("requests");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [detail, setDetail] = useState<RequestRow | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim();
    return rows.filter((row) => {
      if (statusFilter && row.status !== statusFilter) return false;
      if (typeFilter && row.type !== typeFilter) return false;
      if (!term) return true;
      return (
        row.customerName.includes(term) ||
        row.phone.includes(term) ||
        row.reference.includes(term) ||
        row.serviceTitle.includes(term)
      );
    });
  }, [rows, search, statusFilter, typeFilter]);

  async function updateStatus(row: RequestRow, status: string) {
    setRows((prev) => prev.map((item) => (item.id === row.id ? { ...item, status } : item)));
    await fetch(`/api/admin/requests/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function saveDetail() {
    if (!detail) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/requests/${detail.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: detail.status, adminNotes: notes }),
      });
      setRows((prev) =>
        prev.map((item) =>
          item.id === detail.id ? { ...item, status: detail.status, adminNotes: notes } : item,
        ),
      );
      setDetail(null);
    } finally {
      setSaving(false);
    }
  }

  async function updateMessageStatus(row: MessageRow, status: string) {
    setMsgs((prev) => prev.map((item) => (item.id === row.id ? { ...item, status } : item)));
    await fetch(`/api/admin/requests/${row.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function removeRequest(row: RequestRow) {
    if (!window.confirm("حذف الطلب نهائياً؟")) return;
    setRows((prev) => prev.filter((item) => item.id !== row.id));
    await fetch(`/api/admin/requests/${row.id}`, { method: "DELETE" });
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-navy">طلبات العملاء</h1>
      <p className="mt-1 text-[13px] text-navy/60">
        كل طلب يُحفظ هنا من الموقع. قم بتحديث الحالة بعد التواصل مع العميل وتأكيد التوفر.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {[
          { key: "requests", label: `طلبات الحجز (${rows.length})` },
          { key: "messages", label: `استفسارات الرسائل (${msgs.length})` },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key as "requests" | "messages")}
            className={`rounded-2xl px-4 py-2.5 text-sm font-extrabold transition ${
              tab === item.key ? "bg-primary text-white shadow" : "bg-white text-navy/70 ring-1 ring-navy/10"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "requests" ? (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <input
              className="field text-[13px]"
              placeholder="بحث بالاسم أو رقم الطلب أو الهاتف"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select className="field text-[13px]" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">كل الحالات</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {REQUEST_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
            <select className="field text-[13px]" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">كل أنواع الخدمة</option>
              {TYPES.map((type) => (
                <option key={type} value={type}>
                  {REQUEST_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>

          <div className="thin-scroll mt-4 overflow-x-auto rounded-3xl border border-navy/10 bg-white shadow-sm">
            <table className="w-full min-w-[860px] text-right">
              <thead className="bg-ivory text-[11px] font-extrabold text-navy/60">
                <tr>
                  <th className="px-4 py-3">رقم الطلب</th>
                  <th className="px-4 py-3">العميل</th>
                  <th className="px-4 py-3">الخدمة</th>
                  <th className="px-4 py-3">الحالة</th>
                  <th className="px-4 py-3">التاريخ</th>
                  <th className="px-4 py-3">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/8 text-[13px]">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-navy/50">
                      لا توجد طلبات مطابقة.
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => (
                    <tr key={row.id} className="transition hover:bg-ivory/60">
                      <td className="px-4 py-3 font-mono text-[11px] text-navy/60" dir="ltr">
                        {row.reference}
                      </td>
                      <td className="px-4 py-3">
                        <span className="block font-extrabold text-navy">{row.customerName}</span>
                        <span dir="ltr" className="block text-[11px] text-navy/55">
                          {row.phone}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-gold/15 px-2.5 py-1 text-[11px] font-extrabold text-navy">
                          {REQUEST_TYPE_LABELS[row.type] ?? row.type}
                        </span>
                        <span className="mt-1 block text-[11px] text-navy/55">{row.serviceTitle}</span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={row.status}
                          onChange={(event) => void updateStatus(row, event.target.value)}
                          className={`rounded-xl border px-2.5 py-1.5 text-[11px] font-extrabold ${
                            REQUEST_STATUS_COLORS[row.status] ?? "border-navy/15"
                          }`}
                        >
                          {STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {REQUEST_STATUS_LABELS[status]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-navy/55">{formatDateTime(row.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setDetail(row);
                              setNotes(row.adminNotes);
                            }}
                            className="rounded-xl bg-primary px-3 py-2 text-[11px] font-extrabold text-white"
                          >
                            تفاصيل
                          </button>
                          <a
                            href={telLink(row.phone)}
                            className="rounded-xl border border-navy/15 px-3 py-2 text-[11px] font-extrabold text-navy"
                          >
                            اتصال
                          </a>
                          <a
                            href={waLink(row.phone, `مرحباً ${row.customerName}، بخصوص طلبك رقم ${row.reference}`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl bg-[#25d366] px-3 py-2 text-[11px] font-extrabold text-white"
                          >
                            واتساب
                          </a>
                          <button
                            type="button"
                            onClick={() => void removeRequest(row)}
                            className="rounded-xl border border-rose-200 px-3 py-2 text-[11px] font-extrabold text-rose-600"
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
        </>
      ) : (
        <div className="mt-5 grid gap-3">
          {msgs.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-navy/20 bg-white p-10 text-center text-navy/50">
              لا توجد استفسارات بعد.
            </p>
          ) : (
            msgs.map((message) => (
              <div key={message.id} className="rounded-3xl border border-navy/10 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-display text-base font-extrabold text-navy">{message.name}</p>
                    <p dir="ltr" className="text-[12px] text-navy/55">
                      {message.phone}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={message.status}
                      onChange={(event) => void updateMessageStatus(message, event.target.value)}
                      className={`rounded-xl border px-2.5 py-1.5 text-[11px] font-extrabold ${
                        REQUEST_STATUS_COLORS[message.status] ?? "border-navy/15"
                      }`}
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {REQUEST_STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>
                    <a
                      href={waLink(message.phone, `مرحباً ${message.name}، بخصوص استفسارك`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl bg-[#25d366] px-3 py-2 text-[11px] font-extrabold text-white"
                    >
                      واتساب
                    </a>
                    <a
                      href={telLink(message.phone)}
                      className="rounded-xl border border-navy/15 px-3 py-2 text-[11px] font-extrabold text-navy"
                    >
                      اتصال
                    </a>
                  </div>
                </div>
                {message.subject ? (
                  <p className="mt-3 text-[12px] font-extrabold text-primary">الموضوع: {message.subject}</p>
                ) : null}
                <p className="mt-2 whitespace-pre-line text-[13px] leading-relaxed text-navy/70">
                  {message.message}
                </p>
                <p className="mt-2 text-[10px] text-navy/40">{formatDateTime(message.createdAt)}</p>
              </div>
            ))
          )}
        </div>
      )}

      {detail ? (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-navy/60 p-4" onClick={() => setDetail(null)}>
          <div
            className="mx-auto my-6 w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="navy-mesh px-6 py-5 text-white">
              <h2 className="font-display text-xl font-extrabold">تفاصيل الطلب</h2>
              <p className="mt-1 font-mono text-[12px] text-white/70" dir="ltr">
                {detail.reference}
              </p>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-6">
              <dl className="grid gap-3 sm:grid-cols-2">
                {[
                  ["العميل", detail.customerName],
                  ["الهاتف", detail.phone],
                  ["نوع الطلب", REQUEST_TYPE_LABELS[detail.type] ?? detail.type],
                  ["الخدمة", detail.serviceTitle],
                  ["المدينة", detail.city || "-"],
                  ["مدينة الانطلاق", detail.originCity || "-"],
                  ["المدينة المطلوبة", detail.destinationCity || "-"],
                  ["الشركة المفضلة", detail.preferredCompany || "-"],
                  ["تاريخ السفر", detail.travelDate || "-"],
                  ["عدد المسافرين", String(detail.passengers ?? 1)],
                  ["تاريخ الطلب", formatDateTime(detail.createdAt)],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-ivory p-3">
                    <dt className="text-[11px] font-bold text-navy/55">{label}</dt>
                    <dd className="mt-0.5 text-[13px] font-extrabold text-navy" dir={label === "الهاتف" ? "ltr" : undefined}>
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
              {detail.details ? (
                <div className="mt-3 rounded-2xl bg-ivory p-4">
                  <p className="text-[11px] font-bold text-navy/55">ملاحظات العميل</p>
                  <p className="mt-1 whitespace-pre-line text-[13px] text-navy/75">{detail.details}</p>
                </div>
              ) : null}
              <div className="mt-4">
                <label className="label" htmlFor="admin-notes">
                  ملاحظات المكتب
                </label>
                <textarea
                  id="admin-notes"
                  className="field min-h-[90px] text-[13px]"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </div>
              <div className="mt-4">
                <label className="label" htmlFor="admin-status">
                  حالة الطلب
                </label>
                <select
                  id="admin-status"
                  className="field text-[13px]"
                  value={detail.status}
                  onChange={(event) => setDetail({ ...detail, status: event.target.value })}
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {REQUEST_STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-navy/10 bg-ivory px-6 py-4">
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="rounded-xl border border-navy/15 px-4 py-2.5 text-sm font-extrabold text-navy"
              >
                إغلاق
              </button>
              <button
                type="button"
                onClick={() => void saveDetail()}
                className="btn btn-gold !py-2.5 text-sm"
                disabled={saving}
              >
                {saving ? "جارٍ الحفظ..." : "حفظ التحديث"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
