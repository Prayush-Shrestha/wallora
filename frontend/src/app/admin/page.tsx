"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, BadgeDollarSign, Image as ImageIcon, Download, Sparkles, TrendingUp, Crown, Activity, PieChart } from "lucide-react";
import * as adminService from "../../services/adminService";
import type { AdminStats } from "../../services/adminService";
import { formatMoney } from "../../services/adminService";

function lastNDays(n: number): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function Bars({ data, days, money }: { data: Record<string, number>; days: string[]; money?: boolean }) {
  const max = Math.max(1, ...days.map((d) => data[d] || 0));
  return (
    <div className="flex items-end gap-1.5 h-28" role="img" aria-label="Daily chart">
      {days.map((d) => {
        const v = data[d] || 0;
        return (
          <div key={d} className="flex-1 flex flex-col items-center gap-1 h-full justify-end" title={`${d}: ${money ? formatMoney(v) : v}`}>
            <div
              className="w-full rounded-t-md bg-accent/80 hover:bg-accent transition min-h-[3px]"
              style={{ height: `${Math.max(4, (v / max) * 100)}%` }}
            />
            <span className="text-[9px] text-faint">{d.slice(5)}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminService.fetchAdminStats().then(setStats).catch((e: unknown) => {
      setError(e instanceof Error ? e.message : "Failed to load stats.");
    });
  }, []);

  if (error) {
    return (
      <div role="alert" className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-400">
        {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div role="status" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-raised border border-line/5 animate-pulse" aria-hidden />
        ))}
      </div>
    );
  }

  const days = lastNDays(14);
  const t = stats.totals as AdminStats["totals"] & {
    favorites?: number; revenueCentsAllTime?: number; totalPayments?: number; paidUsers?: number; freeUsers?: number;
  };
  const topBuyers = stats.topBuyers || [];
  const topActiveUsers = stats.topActiveUsers || [];
  const planBreakdown = stats.planBreakdown || [];

  const cards = [
    { label: "Total users", value: String(t.users), sub: `+${t.newUsers7d} this week`, icon: Users },
    { label: "Paid subscribers", value: String(t.activeSubscriptions), sub: `${t.paidUsers ?? "?"} paid / ${t.freeUsers ?? "?"} free`, icon: BadgeDollarSign },
    { label: "Revenue (30d)", value: formatMoney(t.revenueCents30d), sub: `${formatMoney(t.revenueCentsAllTime || 0)} all time · ${t.totalPayments ?? 0} payments`, icon: TrendingUp },
    { label: "Wallpapers", value: String(t.wallpapers), sub: `${t.downloads} downloads`, icon: ImageIcon },
    { label: "AI generations", value: String(t.aiGenerations), sub: "all time", icon: Sparkles },
    { label: "Engagement", value: String(t.favorites ?? 0), sub: "total favorites saved", icon: Download },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="rounded-2xl border border-line/10 bg-raised/60 p-5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-faint">{c.label}</p>
                <Icon className="w-4 h-4 text-accent" aria-hidden />
              </div>
              <p className="mt-2 font-display text-2xl sm:text-3xl font-black text-strong tracking-tight">{c.value}</p>
              <p className="mt-1 text-xs text-faint">{c.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-line/10 bg-raised/60 p-5">
          <h2 className="text-sm font-bold text-strong mb-4">Signups — last 14 days</h2>
          <Bars data={stats.signupsByDay} days={days} />
        </div>
        <div className="rounded-2xl border border-line/10 bg-raised/60 p-5">
          <h2 className="text-sm font-bold text-strong mb-4">Revenue — last 14 days</h2>
          <Bars data={stats.revenueByDay} days={days} money />
        </div>
      </div>

      {/* Who bought vs who uses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-line/10 bg-raised/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-strong flex items-center gap-2">
              <Crown className="w-4 h-4 text-accent" aria-hidden /> Top buyers
            </h2>
            <Link href="/admin/payments" className="text-xs font-semibold text-accent hover:underline">All payments</Link>
          </div>
          {topBuyers.length === 0 ? (
            <p className="text-xs text-faint">No completed payments yet. Grant a plan from Subscriptions to test.</p>
          ) : (
            <ul className="space-y-3">
              {topBuyers.map((b) => (
                <li key={b.user.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <p className="font-semibold text-strong truncate">{b.user.name}</p>
                    <p className="text-faint truncate">{b.user.email} · {b.payments} payment{b.payments === 1 ? "" : "s"}</p>
                  </div>
                  <span className="shrink-0 font-bold text-strong">{formatMoney(b.totalCents)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-line/10 bg-raised/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-strong flex items-center gap-2">
              <Activity className="w-4 h-4 text-accent" aria-hidden /> Most active users
            </h2>
            <Link href="/admin/users" className="text-xs font-semibold text-accent hover:underline">All users</Link>
          </div>
          {topActiveUsers.length === 0 ? (
            <p className="text-xs text-faint">No usage yet.</p>
          ) : (
            <ul className="space-y-3">
              {topActiveUsers.map((u) => (
                <li key={u.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <p className="font-semibold text-strong truncate">{u.name}</p>
                    <p className="text-faint truncate">♥ {u._count.favorites} · ⬇ {u._count.downloads} · ✦ {u._count.aiWallpapers}</p>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent/10 text-accent border border-accent/30">
                    {u.activityScore} actions
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-line/10 bg-raised/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-strong flex items-center gap-2">
              <PieChart className="w-4 h-4 text-accent" aria-hidden /> Plan breakdown
            </h2>
            <Link href="/admin/subscriptions" className="text-xs font-semibold text-accent hover:underline">Subscriptions</Link>
          </div>
          {planBreakdown.length === 0 ? (
            <p className="text-xs text-faint">No plans yet.</p>
          ) : (
            <ul className="space-y-3">
              {planBreakdown.map((p) => {
                const max = Math.max(1, ...planBreakdown.map((x) => x.activeSubscribers));
                return (
                  <li key={p.id} className="text-xs">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-semibold text-strong truncate">{p.name}</p>
                      <p className="text-faint shrink-0">{p.activeSubscribers} active</p>
                    </div>
                    <div className="h-1.5 rounded-full bg-line/10 overflow-hidden" role="img" aria-label={`${p.name}: ${p.activeSubscribers} active subscribers`}>
                      <div className="h-full rounded-full bg-accent" style={{ width: `${Math.max(3, (p.activeSubscribers / max) * 100)}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-line/10 bg-raised/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-strong">Newest users</h2>
            <Link href="/admin/users" className="text-xs font-semibold text-accent hover:underline">View all</Link>
          </div>
          <ul className="space-y-3">
            {stats.recentUsers.map((u) => (
              <li key={u.id} className="flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <p className="font-semibold text-strong truncate">{u.name}</p>
                  <p className="text-faint truncate">{u.email}</p>
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${u.subscriptions.length > 0 ? "bg-accent/10 text-accent border border-accent/30" : "bg-line/5 text-muted border border-line/10"}`}>
                  {u.subscriptions.length > 0 ? u.subscriptions[0].plan.name : "Free"}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-line/10 bg-raised/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-strong">Latest payments</h2>
            <Link href="/admin/payments" className="text-xs font-semibold text-accent hover:underline">View all</Link>
          </div>
          <ul className="space-y-3">
            {stats.recentPayments.length === 0 && (
              <li className="text-xs text-faint">No payments yet.</li>
            )}
            {stats.recentPayments.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <p className="font-semibold text-strong truncate">{p.user.name}</p>
                  <p className="text-faint truncate">{p.plan?.name} · {new Date(p.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="shrink-0 font-bold text-strong">{formatMoney(p.amountCents, p.currency)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
