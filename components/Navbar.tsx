"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, Heart, User, Menu, X, Moon, Sun, Sparkles, Upload } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useStore } from "./StoreProvider";
import { useSession } from "next-auth/react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/categories", label: "Categories" },
  { href: "/ai-studio", label: "AI Studio" },
  { href: "/collections", label: "Collections" },
];

export default function Navbar({ transparent = false }: { transparent?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const { favorites } = useStore();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || pathname !== "/" || menuOpen;
  void transparent;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        solid
          ? "bg-[#0D0D0D]/95 backdrop-blur border-b border-white/10 light:bg-[#FAF9F6]/95 light:border-black/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-shell px-4 sm:px-6">
        <div className="flex h-16 items-center gap-3">
          <Link href="/" className="flex items-baseline gap-1 shrink-0" aria-label="Wallora home">
            <span className="font-display text-[19px] tracking-tight text-white light:text-neutral-900" style={{ fontWeight: 800 }}>
              WALLORA
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-accent inline-block" aria-hidden />
          </Link>

          <nav className="hidden lg:flex items-center gap-1 ml-6" aria-label="Primary">
            {LINKS.map((l) => {
              const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`px-3 py-2 text-[14px] rounded-md transition-colors ${
                    active
                      ? "text-white light:text-neutral-900 font-semibold"
                      : "text-neutral-400 hover:text-white light:text-neutral-500 light:hover:text-neutral-900"
                  }`}
                >
                  {l.label}
                  {l.href === "/ai-studio" && (
                    <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wide bg-accent text-accent-ink px-1.5 py-0.5 rounded-sm align-middle">New</span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex-1" />

          {/* desktop search */}
          <form
            className="hidden md:flex items-center"
            onSubmit={(e) => { e.preventDefault(); if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`); }}
            role="search"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" aria-hidden />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search wallpapers…"
                aria-label="Search wallpapers"
                className="w-48 focus:w-64 transition-all text-[13px] bg-white/10 light:bg-black/[0.06] border border-white/10 light:border-black/10 rounded-full pl-9 pr-3 py-2 text-white light:text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-accent/60"
              />
            </div>
          </form>

          <button onClick={toggle} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} className="p-2 rounded-full text-neutral-300 light:text-neutral-600 hover:bg-white/10 light:hover:bg-black/5">
            {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </button>

          <Link href="/favorites" aria-label="Favorites" className="relative hidden sm:flex p-2 rounded-full text-neutral-300 light:text-neutral-600 hover:bg-white/10 light:hover:bg-black/5">
            <Heart className="h-[18px] w-[18px]" />
            {favorites.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-accent-ink text-[11px] font-bold flex items-center justify-center">{favorites.length}</span>
            )}
          </Link>

          <Link href="/upload" className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-semibold bg-white text-black light:bg-neutral-900 light:text-white rounded-full px-4 py-2 hover:bg-accent hover:text-accent-ink light:hover:bg-accent light:hover:text-accent-ink transition-colors">
            <Upload className="h-3.5 w-3.5" /> Upload
          </Link>

          {session?.user ? (
            <Link href="/profile" aria-label="Profile" className="hidden sm:flex items-center gap-2 p-1.5 rounded-full text-neutral-300 light:text-neutral-600 hover:bg-white/10 light:hover:bg-black/5">
              {session.user.image ? (
                <img src={session.user.image} alt={session.user.name || "User"} className="h-7 w-7 rounded-full object-cover border border-white/20" />
              ) : (
                <User className="h-[18px] w-[18px]" />
              )}
            </Link>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login" className="text-[13px] font-medium text-neutral-300 hover:text-white px-2 py-1.5">
                Log in
              </Link>
              <Link href="/register" className="text-[13px] font-semibold bg-accent text-accent-ink rounded-full px-3.5 py-1.5 hover:brightness-110 transition">
                Sign up
              </Link>
            </div>
          )}

          {/* mobile icons */}
          <Link href="/search" aria-label="Search" className="md:hidden p-2 rounded-full text-neutral-200 light:text-neutral-700">
            <Search className="h-5 w-5" />
          </Link>
          <button onClick={() => setMenuOpen((v) => !v)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} className="lg:hidden p-2 rounded-full text-neutral-200 light:text-neutral-700">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* mobile dropdown */}
      {menuOpen && (
        <nav className="lg:hidden border-t border-white/10 light:border-black/10 bg-[#0D0D0D] light:bg-[#FAF9F6] px-4 py-3" aria-label="Mobile">
          <div className="grid gap-1">
            {[...LINKS, { href: "/favorites", label: "Favorites" }, { href: "/upload", label: "Upload" }].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-[15px] ${pathname === l.href ? "bg-white/10 light:bg-black/5 font-semibold text-white light:text-neutral-900" : "text-neutral-300 light:text-neutral-600"}`}
              >
                {l.label}
              </Link>
            ))}

            {session?.user ? (
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-[15px] text-neutral-300 light:text-neutral-600 flex items-center justify-between"
              >
                <span>Profile ({session.user.name || session.user.email?.split("@")[0]})</span>
                <User className="w-4 h-4" />
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl border border-white/15 text-[14px] font-semibold"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl bg-accent text-accent-ink text-[14px] font-bold"
                >
                  Sign up
                </Link>
              </div>
            )}

            <Link href="/ai-studio" onClick={() => setMenuOpen(false)} className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-accent text-accent-ink font-semibold px-4 py-3 text-[15px]">
              <Sparkles className="h-4 w-4" /> Create with AI
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
