"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, BadgeDollarSign, Receipt, Layers, ShieldAlert, ArrowLeft } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: BadgeDollarSign },
  { href: "/admin/payments", label: "Payments", icon: Receipt },
  { href: "/admin/plans", label: "Plans", icon: Layers },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (loading) {
    return (
      <div className="mx-auto max-w-shell px-4 py-24 text-center text-faint text-sm" role="status">
        Checking admin access...
      </div>
    );
  }

  // The admin sign-in page must render without an admin session.
  if (pathname === "/admin/login") {
    return (
      <div className="mx-auto max-w-shell px-4 sm:px-6 py-8">
        {children}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-shell px-4 py-24 text-center">
        <div className="mx-auto max-w-md rounded-2xl border border-line/10 bg-raised/60 p-8 space-y-3">
          <ShieldAlert className="w-8 h-8 text-accent mx-auto" aria-hidden />
          <h1 className="font-display text-lg font-black text-strong">Admin login required</h1>
          <p className="text-sm text-muted">
            You need to log in with an <span className="font-bold text-strong">ADMIN</span> account to view this page.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <Link href="/admin/login" className="px-5 py-2.5 rounded-xl bg-accent text-accent-ink text-xs font-bold hover:brightness-110 transition">
              Go to admin login
            </Link>
            <Link href="/" className="px-5 py-2.5 rounded-xl border border-line/15 text-xs font-semibold text-muted hover:text-strong transition">
              Back to site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-shell px-4 py-24 text-center">
        <div className="mx-auto max-w-md rounded-2xl border border-red-500/20 bg-red-500/5 p-8 space-y-3" role="alert">
          <ShieldAlert className="w-8 h-8 text-red-400 mx-auto" aria-hidden />
          <h1 className="font-display text-lg font-black text-strong">Access denied — admins only</h1>
          <p className="text-sm text-muted">
            You are logged in as <span className="font-bold text-strong">{user.email}</span> with role{" "}
            <span className="font-bold text-strong">{user.role || "USER"}</span>. This area is restricted to ADMIN accounts.
          </p>
          <p className="text-xs text-faint">
            Log out and log back in with an admin account (e.g. <span className="font-mono">demo@wallora.com</span>), or ask an
            existing admin to promote your account from Admin → Users → Make admin.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => { logout(); router.replace("/login"); }}
              className="px-5 py-2.5 rounded-xl bg-accent text-accent-ink text-xs font-bold hover:brightness-110 transition"
            >
              Switch account
            </button>
            <Link href="/" className="px-5 py-2.5 rounded-xl border border-line/15 text-xs font-semibold text-muted hover:text-strong transition">
              Back to site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-shell px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-accent/10 border border-accent/30">
            <ShieldAlert className="w-4 h-4 text-accent" aria-hidden />
          </span>
          <div>
            <h1 className="font-display text-xl font-black text-strong tracking-tight">Admin Panel</h1>
            <p className="text-xs text-faint">Signed in as {user.name}</p>
          </div>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-strong transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden />
          <span className="hidden sm:inline">Back to site</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 items-start">
        <nav aria-label="Admin" className="flex lg:flex-col gap-1.5 overflow-x-auto scrollbar-none lg:sticky lg:top-20 rounded-2xl border border-line/10 bg-raised/60 p-2">
          {LINKS.map((l) => {
            const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  active ? "bg-accent text-accent-ink" : "text-muted hover:text-strong hover:bg-line/5"
                }`}
              >
                <Icon className="w-4 h-4" aria-hidden />
                <span>{l.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
