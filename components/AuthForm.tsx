"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Shell({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[440px] px-4 py-14">
      <Link href="/" className="font-display font-extrabold tracking-tight text-[20px]">WALLORA<span className="text-accent">.</span></Link>
      <h1 className="font-display text-[28px] font-bold tracking-tight mt-6">{title}</h1>
      <p className="text-neutral-400 light:text-neutral-500 text-[14px] mt-1.5">{sub}</p>
      <div className="mt-6 rounded-2xl border border-white/10 light:border-black/10 bg-ink-900 light:bg-white p-5 sm:p-6">{children}</div>
    </div>
  );
}

export function AuthForm({ mode }: { mode: "login" | "register" | "forgot" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "forgot") { setDone(true); return; }
    try { localStorage.setItem("wallora-user", JSON.stringify({ email })); } catch {}
    router.push("/profile");
  };

  if (mode === "forgot" && done) {
    return (
      <Shell title="Check your inbox" sub="If that email exists, a reset link is on its way.">
        <p className="text-[14px]">We sent a reset link to <span className="font-semibold">{email}</span>.</p>
        <Link href="/login" className="mt-4 inline-block rounded-full bg-white text-black text-[14px] font-semibold px-5 py-2.5">Back to login</Link>
      </Shell>
    );
  }

  return (
    <Shell
      title={mode === "login" ? "Welcome back" : mode === "register" ? "Create your account" : "Reset password"}
      sub={mode === "login" ? "Your saved walls and AI creations are waiting." : mode === "register" ? "Save favorites, upload work, generate with AI." : "Enter your account email and we'll send a reset link."}
    >
      <form onSubmit={submit} className="grid gap-3.5">
        <label className="grid gap-1.5 text-[13.5px] font-semibold">
          Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" className="rounded-xl bg-ink-950 light:bg-neutral-100 border border-white/10 light:border-black/10 px-4 py-3 text-[14.5px] font-normal min-h-[48px] focus:outline-none focus:border-accent/70" />
        </label>
        {mode !== "forgot" && (
          <label className="grid gap-1.5 text-[13.5px] font-semibold">
            Password
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete={mode === "login" ? "current-password" : "new-password"} className="rounded-xl bg-ink-950 light:bg-neutral-100 border border-white/10 light:border-black/10 px-4 py-3 text-[14.5px] font-normal min-h-[48px] focus:outline-none focus:border-accent/70" />
          </label>
        )}
        <button type="submit" className="mt-1 rounded-full bg-accent text-accent-ink font-bold text-[14.5px] px-5 py-3.5 min-h-[52px]">
          {mode === "login" ? "Log in" : mode === "register" ? "Create account" : "Send reset link"}
        </button>
      </form>
      <button type="button" onClick={() => { try { localStorage.setItem("wallora-user", JSON.stringify({ email: "google-user@gmail.com" })); } catch {} router.push("/profile"); }} className="mt-3 w-full rounded-full border border-white/15 light:border-black/15 font-semibold text-[14px] px-5 py-3 min-h-[52px] hover:border-white/35">
        Continue with Google
      </button>
      <div className="mt-4 text-[13.5px] text-neutral-500 flex flex-col gap-1.5">
        {mode === "login" && (<><Link href="/register" className="underline underline-offset-2">New here? Create an account</Link><Link href="/forgot-password" className="underline underline-offset-2">Forgot password?</Link></>)}
        {mode === "register" && <Link href="/login" className="underline underline-offset-2">Already have an account? Log in</Link>}
        {mode === "forgot" && <Link href="/login" className="underline underline-offset-2">Back to login</Link>}
      </div>
    </Shell>
  );
}
