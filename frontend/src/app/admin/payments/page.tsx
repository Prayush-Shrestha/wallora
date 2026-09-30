"use client";

import { useCallback, useEffect, useState } from "react";
import * as adminService from "../../../services/adminService";
import type { Payment } from "../../../services/adminService";
import { formatMoney } from "../../../services/adminService";
import { showToast } from "../../../components/ui/Toast";

const STATUS_STYLE: Record<string, string> = {
  COMPLETED: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  PENDING: "bg-amber-500/10 border-amber-500/30 text-amber-400",
  FAILED: "bg-red-500/10 border-red-500/30 text-red-400",
  REFUNDED: "bg-line/5 border-line/15 text-muted",
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [revenue, setRevenue] = useState(0);
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.fetchAdminPayments({ status, page, limit: 20 });
      setPayments(data.payments);
      setRevenue(data.revenueCents);
      setTotalPages(data.pagination.totalPages);
      setTotal(data.pagination.total);
    } catch {
      showToast("Failed to load payments");
    } finally {
      setLoading(false);
    }
  }, [status, page]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-line/10 bg-raised/60 p-5 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-faint">Total revenue (filtered)</p>
          <p className="mt-1 font-display text-2xl font-black text-strong tracking-tight">{formatMoney(revenue)}</p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="pay-status" className="sr-only">Filter by status</label>
          <select
            id="pay-status"
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="px-3 py-2.5 rounded-xl text-xs font-semibold bg-base border border-line/10 text-muted"
          >
            {["all", "COMPLETED", "PENDING", "FAILED", "REFUNDED"].map((s) => (
              <option key={s} value={s} className="bg-raised">{s === "all" ? "All statuses" : s}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-xs text-faint" role="status">{total} payments</p>

      <div className="rounded-2xl border border-line/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-xs">
            <thead>
              <tr className="text-left text-faint border-b border-line/10 bg-raised/80">
                <th scope="col" className="px-4 py-3 font-semibold">Buyer</th>
                <th scope="col" className="px-4 py-3 font-semibold">Plan</th>
                <th scope="col" className="px-4 py-3 font-semibold">Amount</th>
                <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                <th scope="col" className="px-4 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-faint">Loading payments...</td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-faint">No payments found.</td></tr>
              ) : payments.map((p) => (
                <tr key={p.id} className="border-b border-line/5 last:border-0 hover:bg-line/5">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-strong">{p.user.name}</p>
                    <p className="text-faint">{p.user.email}</p>
                  </td>
                  <td className="px-4 py-3 text-muted">{p.plan?.name || "—"}</td>
                  <td className="px-4 py-3 font-bold text-strong whitespace-nowrap">{formatMoney(p.amountCents, p.currency)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${STATUS_STYLE[p.status] || "bg-line/5 border-line/15 text-muted"}`}>
                      {p.status}
                    </span>
                    <span className="ml-2 text-faint text-[11px]">{p.provider}</span>
                  </td>
                  <td className="px-4 py-3 text-muted whitespace-nowrap">{new Date(p.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-muted">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-4 py-2 rounded-full border border-line/15 disabled:opacity-40 hover:border-line/30 transition">Previous</button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-4 py-2 rounded-full border border-line/15 disabled:opacity-40 hover:border-line/30 transition">Next</button>
        </div>
      )}
    </div>
  );
}
