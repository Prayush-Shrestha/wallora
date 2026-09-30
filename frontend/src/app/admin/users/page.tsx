"use client";

import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import * as adminService from "../../../services/adminService";
import type { AdminUser } from "../../../services/adminService";
import { showToast } from "../../../components/ui/Toast";

function formatLastLogin(iso?: string | null): string {
  if (!iso) return "Never";
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 0) return "Just now";
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [plan, setPlan] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.fetchAdminUsers({ q, role, status, plan, page, limit: 20 });
      setUsers(data.users);
      setTotalPages(data.pagination.totalPages);
      setTotal(data.pagination.total);
    } catch {
      showToast("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [q, role, status, plan, page]);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (id: string, data: { role?: string; status?: string }, label: string) => {
    try {
      await adminService.updateAdminUser(id, data);
      showToast(label);
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Action failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-faint" aria-hidden />
          <label htmlFor="admin-user-search" className="sr-only">Search users</label>
          <input
            id="admin-user-search"
            type="search"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder="Search name or email..."
            className="w-full rounded-xl bg-raised border border-line/10 pl-10 pr-4 py-2.5 text-sm text-strong placeholder:text-faint focus:outline-none focus:border-accent"
          />
        </div>
        {(
          [
            { id: "role-filter", value: role, set: setRole, opts: ["all", "USER", "ADMIN"], label: "Role" },
            { id: "status-filter", value: status, set: setStatus, opts: ["all", "ACTIVE", "SUSPENDED"], label: "Status" },
            { id: "plan-filter", value: plan, set: setPlan, opts: ["all", "free", "paid"], label: "Plan" },
          ] as const
        ).map((f) => (
          <div key={f.id} className="flex items-center gap-2">
            <label htmlFor={f.id} className="sr-only">{f.label}</label>
            <select
              id={f.id}
              value={f.value}
              onChange={(e) => { f.set(e.target.value); setPage(1); }}
              className="px-3 py-2.5 rounded-xl text-xs font-semibold bg-raised border border-line/10 text-muted capitalize"
            >
              {f.opts.map((o) => (
                <option key={o} value={o} className="bg-raised capitalize">{o === "all" ? `All ${f.label.toLowerCase()}s` : o}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <p className="text-xs text-faint" role="status">{total} {total === 1 ? "user" : "users"}</p>

      <div className="rounded-2xl border border-line/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-xs">
            <thead>
              <tr className="text-left text-faint border-b border-line/10 bg-raised/80">
                <th scope="col" className="px-4 py-3 font-semibold">User</th>
                <th scope="col" className="px-4 py-3 font-semibold">Plan</th>
                <th scope="col" className="px-4 py-3 font-semibold">Activity</th>
                <th scope="col" className="px-4 py-3 font-semibold">Role / Status</th>
                <th scope="col" className="px-4 py-3 font-semibold">Last login</th>
                <th scope="col" className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-faint">Loading users...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-faint">No users match these filters.</td></tr>
              ) : users.map((u) => (
                <tr key={u.id} className="border-b border-line/5 last:border-0 hover:bg-line/5">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-strong">{u.name}</p>
                    <p className="text-faint">{u.email}</p>
                    <p className="text-faint text-[11px]">Joined {new Date(u.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-4 py-3">
                    {u.subscriptions.length > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-[10px] font-bold">
                        {u.subscriptions[0].plan.name}
                      </span>
                    ) : (
                      <span className="text-faint">Free</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted whitespace-nowrap">
                    ♥ {u._count.favorites} · ⬇ {u._count.downloads} · ✦ {u._count.aiWallpapers}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-strong font-semibold">{u.role}</span>
                    <span className="text-faint"> / </span>
                    <span className={u.status === "ACTIVE" ? "text-emerald-400" : "text-red-400"}>{u.status}</span>
                  </td>
                  <td className="px-4 py-3 text-muted whitespace-nowrap" title={u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "Never logged in"}>
                    {formatLastLogin(u.lastLoginAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5 flex-wrap">
                      {u.role === "USER" ? (
                        <button onClick={() => act(u.id, { role: "ADMIN" }, `${u.name} is now admin`)} className="px-2.5 py-1.5 rounded-lg border border-line/15 text-muted hover:text-strong hover:border-line/30 transition">Make admin</button>
                      ) : (
                        <button onClick={() => act(u.id, { role: "USER" }, `${u.name} demoted to user`)} className="px-2.5 py-1.5 rounded-lg border border-line/15 text-muted hover:text-strong hover:border-line/30 transition">Remove admin</button>
                      )}
                      {u.status === "ACTIVE" ? (
                        <button onClick={() => act(u.id, { status: "SUSPENDED" }, `${u.name} suspended`)} className="px-2.5 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition">Suspend</button>
                      ) : (
                        <button onClick={() => act(u.id, { status: "ACTIVE" }, `${u.name} reactivated`)} className="px-2.5 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition">Activate</button>
                      )}
                    </div>
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
