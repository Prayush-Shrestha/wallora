"use client";

import { useCallback, useEffect, useState } from "react";
import * as adminService from "../../../services/adminService";
import type { Subscription } from "../../../services/adminService";
import { showToast } from "../../../components/ui/Toast";

const STATUS_STYLE: Record<string, string> = {
  ACTIVE: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  CANCELED: "bg-line/5 border-line/15 text-muted",
  EXPIRED: "bg-line/5 border-line/15 text-faint",
  PAST_DUE: "bg-red-500/10 border-red-500/30 text-red-400",
};

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [planSlug, setPlanSlug] = useState("pro-monthly");
  const [granting, setGranting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.fetchAdminSubscriptions({ status, page, limit: 20 });
      setSubs(data.subscriptions);
      setTotalPages(data.pagination.totalPages);
      setTotal(data.pagination.total);
    } catch {
      showToast("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  }, [status, page]);

  useEffect(() => {
    load();
  }, [load]);

  const grant = async (e: React.FormEvent) => {
    e.preventDefault();
    setGranting(true);
    try {
      await adminService.grantSubscription(email.trim(), planSlug);
      showToast(`Plan granted to ${email.trim()}`);
      setEmail("");
      load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Grant failed");
    } finally {
      setGranting(false);
    }
  };

  const setSubStatus = async (id: string, next: string, label: string) => {
    try {
      await adminService.updateSubscription(id, next);
      showToast(label);
      load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Update failed");
    }
  };

  return (
    <div className="space-y-4">
      {/* Grant plan manually */}
      <form onSubmit={grant} className="rounded-2xl border border-line/10 bg-raised/60 p-5 space-y-3">
        <h2 className="text-sm font-bold text-strong">Grant a plan manually</h2>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px_auto] gap-3">
          <div>
            <label htmlFor="grant-email" className="sr-only">User email</label>
            <input
              id="grant-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full rounded-xl bg-base border border-line/10 px-4 py-2.5 text-sm text-strong placeholder:text-faint focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="grant-plan" className="sr-only">Plan</label>
            <select
              id="grant-plan"
              value={planSlug}
              onChange={(e) => setPlanSlug(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold bg-base border border-line/10 text-muted"
            >
              <option value="pro-monthly" className="bg-raised">Pro Monthly</option>
              <option value="pro-yearly" className="bg-raised">Pro Yearly</option>
              <option value="free" className="bg-raised">Free</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={granting}
            className="px-5 py-2.5 rounded-xl bg-accent text-accent-ink text-xs font-bold hover:brightness-110 transition disabled:opacity-50"
          >
            {granting ? "Granting..." : "Grant plan"}
          </button>
        </div>
      </form>

      <div className="flex items-center gap-3">
        <label htmlFor="sub-status" className="sr-only">Filter by status</label>
        <select
          id="sub-status"
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="px-3 py-2.5 rounded-xl text-xs font-semibold bg-raised border border-line/10 text-muted"
        >
          {["all", "ACTIVE", "CANCELED", "EXPIRED", "PAST_DUE"].map((s) => (
            <option key={s} value={s} className="bg-raised">{s === "all" ? "All statuses" : s}</option>
          ))}
        </select>
        <p className="text-xs text-faint" role="status">{total} subscriptions</p>
      </div>

      <div className="rounded-2xl border border-line/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-xs">
            <thead>
              <tr className="text-left text-faint border-b border-line/10 bg-raised/80">
                <th scope="col" className="px-4 py-3 font-semibold">User</th>
                <th scope="col" className="px-4 py-3 font-semibold">Plan</th>
                <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                <th scope="col" className="px-4 py-3 font-semibold">Renews</th>
                <th scope="col" className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-faint">Loading subscriptions...</td></tr>
              ) : subs.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-faint">No subscriptions found.</td></tr>
              ) : subs.map((s) => (
                <tr key={s.id} className="border-b border-line/5 last:border-0 hover:bg-line/5">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-strong">{s.user.name}</p>
                    <p className="text-faint">{s.user.email}</p>
                  </td>
                  <td className="px-4 py-3 text-strong font-semibold">{s.plan.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${STATUS_STYLE[s.status] || "bg-line/5 border-line/15 text-muted"}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {s.currentPeriodEnd ? new Date(s.currentPeriodEnd).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {s.status === "ACTIVE" ? (
                      <button onClick={() => setSubStatus(s.id, "CANCELED", "Subscription canceled")} className="px-2.5 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition">Cancel</button>
                    ) : (
                      <button onClick={() => setSubStatus(s.id, "ACTIVE", "Subscription reactivated")} className="px-2.5 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition">Reactivate</button>
                    )}
                  </td>
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
