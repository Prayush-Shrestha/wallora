"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { FadeIn } from "../../components/ui/FadeIn";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      router.push("/profile");
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <FadeIn className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block font-display font-black text-3xl tracking-tight text-white">
            WALLORA<span className="text-accent">.</span>
          </Link>
          <h1 className="mt-3 font-display text-2xl font-bold text-white tracking-tight">
            Create an account
          </h1>
          <p className="mt-1 text-xs text-neutral-400">
            Join Wallora to save favorites, download 4K wallpapers and generate AI art.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-ink-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
          {error && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Full Name or Creator Handle
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full rounded-xl bg-ink-950 border border-white/10 pl-10 pr-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl bg-ink-950 border border-white/10 pl-10 pr-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Password (min 6 characters)
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-ink-950 border border-white/10 pl-10 pr-11 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-accent text-accent-ink font-bold text-sm py-3.5 hover:brightness-110 active:scale-98 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating your account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-neutral-400">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-accent hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </FadeIn>
    </div>
  );
}

