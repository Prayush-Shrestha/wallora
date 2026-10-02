"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2, ShieldAlert } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { getStoredUser } from "../../../services/authService";
import { FadeIn } from "../../../components/ui/FadeIn";

// /admin/login — dedicated admin sign-in. Uses the same auth as /login,
// then only lets ADMIN roles through to /admin.
export default function AdminLoginPage() {
  const router = useRouter();
  const { user, login, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Already-signed-in admins skip the form.
  useEffect(() => {
    if (user?.role === "ADMIN") router.replace("/admin");
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      const signedIn = getStoredUser();
      if (signedIn?.role === "ADMIN") {
        router.push("/admin");
      } else {
        // Don't leave a non-admin session behind on the admin gate.
        logout();
        setError("This account is not an admin. Use an ADMIN account (e.g. demo@wallora.com).");
      }
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Failed to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <FadeIn className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-bold text-accent">
            <ShieldAlert className="w-3.5 h-3.5" aria-hidden />
            <span>Admin Panel</span>
          </span>
          <h1 className="mt-3 font-display text-2xl font-bold text-strong tracking-tight">
            Admin sign in
          </h1>
          <p className="mt-1 text-xs text-muted">
            Restricted area — only ADMIN accounts can continue to the dashboard.
          </p>
        </div>

        <div className="rounded-3xl border border-line/10 bg-raised/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
          {error && (
            <div role="alert" className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-faint pointer-events-none" aria-hidden />
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@wallora.com"
                  className="w-full rounded-xl bg-base border border-line/10 pl-10 pr-4 py-3 text-sm text-strong placeholder:text-faint focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-faint pointer-events-none" aria-hidden />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-base border border-line/10 pl-10 pr-11 py-3 text-sm text-strong placeholder:text-faint focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-pressed={showPassword}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-strong"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" aria-hidden /> : <Eye className="w-4 h-4" aria-hidden />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-accent text-accent-ink font-bold text-sm py-3.5 hover:brightness-110 active:scale-[0.98] transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In as Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-3.5 rounded-xl bg-line/5 border border-line/10 text-xs text-muted">
            <p className="font-semibold text-strong mb-1">Demo Admin Account:</p>
            <p>Email: <span className="text-accent font-mono">demo@wallora.com</span></p>
            <p>Password: <span className="text-accent font-mono">password123</span></p>
          </div>

          <p className="mt-6 text-center text-xs text-muted">
            Not an admin?{" "}
            <Link href="/" className="font-semibold text-accent hover:underline">
              Back to site
            </Link>
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
