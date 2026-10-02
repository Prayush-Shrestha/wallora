"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Search, Heart, User as UserIcon, Menu, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { ThemeToggle } from "../ui/Theme";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/categories", label: "Categories" },
  { href: "/collections", label: "Collections" },
  { href: "/ai-studio", label: "AI Studio", badge: "New" },
  { href: "/favorites", label: "Favorites" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Throttle scroll updates with rAF — one state write per frame max.
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        ticking = false;
      });
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the mobile menu on navigation + Escape.
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileMenuOpen]);

  const searchRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (query) {
      try {
        const parsed: unknown = JSON.parse(localStorage.getItem("wallora_recent_searches") || "[]");
        const recent = Array.isArray(parsed) ? parsed.filter((r): r is string => typeof r === "string") : [];
        const next = [query, ...recent.filter((r) => r !== query)].slice(0, 6);
        localStorage.setItem("wallora_recent_searches", JSON.stringify(next));
      } catch {
        // Private mode — search still works, history just isn't saved.
      }
      router.push(`/explore?q=${encodeURIComponent(query)}`);
      setMobileMenuOpen(false);
    }
  };

  // The hero keeps its dark photo scrim in both themes, so a transparent
  // navbar floating over it always uses light text.
  const solid = scrolled || pathname !== "/" || mobileMenuOpen;
  const onPhoto = !solid;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        solid
          ? "bg-base/85 backdrop-blur-xl border-b border-line/10 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* Top scrim — guarantees white text stays readable even over a bright sky/street photo */}
      {!solid && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/75 via-black/35 to-transparent"
        />
      )}
      <div className="relative mx-auto max-w-shell px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className={`flex items-center gap-1 shrink-0 font-display font-black text-xl tracking-tight transition-colors ${onPhoto ? "text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]" : "text-strong"}`}>
            WALLORA<span className="text-accent drop-shadow-none">.</span>
          </Link>

          {/* Desktop Nav Links — glass pill over photos, flat on solid bar */}
          <nav
            aria-label="Primary"
            className={`hidden md:flex items-center gap-0.5 rounded-full px-1.5 py-1 shrink-0 transition-all duration-300 ${
              onPhoto
                ? "bg-black/35 backdrop-blur-md border border-white/15 shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
                : "bg-transparent border border-transparent"
            }`}
          >
            {NAV_LINKS.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`px-2.5 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all ${
                    active
                      ? onPhoto
                        ? "bg-white text-black font-semibold shadow"
                        : "text-strong bg-line/10 font-semibold"
                      : onPhoto
                        ? "text-neutral-200 hover:text-white hover:bg-white/15 [text-shadow:0_1px_8px_rgba(0,0,0,0.8)]"
                        : "text-muted hover:text-strong hover:bg-line/5"
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="ml-1.5 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-accent text-accent-ink align-middle whitespace-nowrap">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                aria-current={pathname.startsWith("/admin") ? "page" : undefined}
                className={`px-2.5 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all ${
                  pathname.startsWith("/admin")
                    ? "text-accent-ink bg-accent font-semibold shadow"
                    : onPhoto
                      ? "text-amber-300 hover:text-amber-200 hover:bg-white/15 [text-shadow:0_1px_8px_rgba(0,0,0,0.8)]"
                      : "text-accent hover:bg-accent/10"
                }`}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} role="search" className="hidden lg:flex items-center relative w-40 xl:w-80 min-w-0 flex-1 max-w-xs xl:max-w-none">
            <Search className={`absolute left-3.5 w-4 h-4 pointer-events-none ${onPhoto ? "text-neutral-300" : "text-faint"}`} aria-hidden />
            <label htmlFor="navbar-search" className="sr-only">
              Search wallpapers
            </label>
            <input
              id="navbar-search"
              ref={searchRef}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search 4K wallpapers..."
              autoComplete="off"
              className={`w-full rounded-full border pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-accent transition-all ${
                onPhoto
                  ? "bg-black/40 border-white/25 text-white placeholder:text-neutral-400 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.35)] focus:bg-black/60 focus:border-white/50"
                  : "bg-line/5 border-line/10 text-strong placeholder:text-faint"
              }`}
            />
          </form>

          {/* Actions / Auth */}
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <Link
              href="/favorites"
              aria-label="View favorites"
              className={`p-2 rounded-full border transition-all ${onPhoto ? "bg-black/35 border-white/15 text-neutral-200 hover:text-white hover:bg-white/20 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.3)]" : "border-transparent text-muted hover:text-strong hover:bg-line/10"}`}
            >
              <Heart className="w-5 h-5" aria-hidden />
            </Link>

            <ThemeToggle className={onPhoto ? "bg-black/35 border border-white/15 text-neutral-200 hover:text-white hover:bg-white/20 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.3)]" : "border border-transparent"} />

            {user ? (
              <Link
                href="/profile"
                aria-label={`View profile of ${user.name}`}
                className={`flex items-center gap-2 p-1 rounded-full border transition-all ${onPhoto ? "bg-black/35 border-white/25 hover:border-white/60 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.3)]" : "border-line/15 hover:border-accent"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.profileImage || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(user.name)}`}
                  alt=""
                  width={28}
                  height={28}
                  className="w-7 h-7 rounded-full object-cover"
                />
              </Link>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/login"
                  className={`text-xs font-semibold px-3 py-2 rounded-full whitespace-nowrap transition ${onPhoto ? "text-neutral-300 hover:text-white hover:bg-white/10" : "text-muted hover:text-strong hover:bg-line/5"}`}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="text-xs font-bold bg-accent text-accent-ink px-4 py-2 rounded-full whitespace-nowrap hover:brightness-110 transition shadow-sm"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className={`md:hidden p-2 rounded-full border transition-all ${onPhoto ? "bg-black/35 border-white/15 text-white backdrop-blur-md" : "border-transparent text-muted hover:text-strong"}`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden /> : <Menu className="w-6 h-6" aria-hidden />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-line/10 bg-base px-4 py-4 space-y-3">
          <form onSubmit={handleSearch} role="search" className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-faint" aria-hidden />
            <label htmlFor="navbar-search-mobile" className="sr-only">
              Search wallpapers
            </label>
            <input
              id="navbar-search-mobile"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search wallpapers..."
              autoComplete="off"
              className="w-full rounded-xl bg-line/5 border border-line/10 pl-10 pr-4 py-2.5 text-sm text-strong placeholder:text-faint"
            />
          </form>

          <nav aria-label="Mobile" className="grid gap-1 pt-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={pathname === link.href ? "page" : undefined}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  pathname === link.href ? "bg-line/10 text-strong font-semibold" : "text-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                aria-current={pathname.startsWith("/admin") ? "page" : undefined}
                className="px-3 py-2 rounded-lg text-sm font-bold text-accent"
              >
                Admin Panel
              </Link>
            )}
          </nav>

          <div className="pt-3 border-t border-line/10 flex items-center justify-between">
            <span className="px-3 text-xs font-semibold text-muted">Appearance</span>
            <ThemeToggle />
          </div>

          <div className="pt-3 border-t border-line/10">
            {user ? (
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-line/5 text-sm font-medium text-strong"
              >
                <UserIcon className="w-4 h-4 text-accent" aria-hidden />
                <span>My Profile ({user.name})</span>
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-xl border border-line/15 text-sm font-semibold text-strong"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-xl bg-accent text-accent-ink text-sm font-bold"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
