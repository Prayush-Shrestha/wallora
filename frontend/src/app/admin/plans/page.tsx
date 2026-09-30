"use client";

import { useCallback, useEffect, useState } from "react";
import * as adminService from "../../../services/adminService";
import type { Plan } from "../../../services/adminService";
import { formatMoney } from "../../../services/adminService";
import { showToast } from "../../../components/ui/Toast";

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [interval, setInterval] = useState("MONTH");
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.fetchAdminPlans();
      setPlans(data.plans);
    } catch {
      showToast("Failed to load plans");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const dollars = parseFloat(price);
      if (Number.isNaN(dollars) || dollars < 0) throw new Error("Enter a valid price.");
      await adminService.createPlan({
        name: name.trim(),
        slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
        priceCents: Math.round(dollars * 100),
        interval,
        features: [],
      });
      showToast(`Plan "${name.trim()}" created`);
      setName("");
      setSlug("");
      setPrice("");
      load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Create failed");
    } finally {
      setCreating(false);
    }
  };

  const toggle = async (p: Plan) => {
    try {
      await adminService.updatePlan(p.id, { isActive: !p.isActive });
      showToast(p.isActive ? `${p.name} deactivated` : `${p.name} activated`);
      load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Update failed");
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={create} className="rounded-2xl border border-line/10 bg-raised/60 p-5 space-y-3">
        <h2 className="text-sm font-bold text-strong">Create a plan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_140px_140px_auto] gap-3">
          <div>
            <label htmlFor="plan-name" className="sr-only">Plan name</label>
            <input id="plan-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Pro Monthly" className="w-full rounded-xl bg-base border border-line/10 px-4 py-2.5 text-sm text-strong placeholder:text-faint focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label htmlFor="plan-slug" className="sr-only">Plan slug</label>
            <input id="plan-slug" required value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="pro-monthly" className="w-full rounded-xl bg-base border border-line/10 px-4 py-2.5 text-sm text-strong placeholder:text-faint focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label htmlFor="plan-price" className="sr-only">Price in dollars</label>
            <input id="plan-price" required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="$ 4.99" inputMode="decimal" className="w-full rounded-xl bg-base border border-line/10 px-4 py-2.5 text-sm text-strong placeholder:text-faint focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label htmlFor="plan-interval" className="sr-only">Billing interval</label>
            <select id="plan-interval" value={interval} onChange={(e) => setInterval(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold bg-base border border-line/10 text-muted">
              <option value="NONE" className="bg-raised">One-time / Free</option>
              <option value="MONTH" className="bg-raised">Monthly</option>
              <option value="YEAR" className="bg-raised">Yearly</option>
            </select>
          </div>
          <button type="submit" disabled={creating} className="px-5 py-2.5 rounded-xl bg-accent text-accent-ink text-xs font-bold hover:brightness-110 transition disabled:opacity-50">
            {creating ? "Creating..." : "Add plan"}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-xs text-faint" role="status">Loading plans...</p>
        ) : plans.map((p) => (
          <div key={p.id} className={`rounded-2xl border p-5 space-y-2 ${p.isActive ? "border-line/10 bg-raised/60" : "border-line/5 bg-raised/30 opacity-70"}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-strong">{p.name}</h3>
              <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${p.isActive ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-line/5 border-line/15 text-faint"}`}>
                {p.isActive ? "ACTIVE" : "HIDDEN"}
              </span>
            </div>
            <p className="font-display text-2xl font-black text-strong">
              {formatMoney(p.priceCents, p.currency)}
              <span className="text-xs font-medium text-faint">
                {p.interval === "MONTH" ? " /mo" : p.interval === "YEAR" ? " /yr" : ""}
              </span>
            </p>
            {p.description && <p className="text-xs text-muted">{p.description}</p>}
            <p className="text-[11px] text-faint font-mono">{p.slug}</p>
            <button onClick={() => toggle(p)} className="text-xs font-semibold text-muted hover:text-strong transition pt-1">
              {p.isActive ? "Deactivate" : "Activate"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
