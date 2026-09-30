"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, Heart, User as UserIcon, Sparkles, Menu, X, LogIn } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      router.push(`/explore?q=${encodeURIComponent(q.trim())}`);
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-200 ${
        scrolled || pathname !== "/" || mobileMenuOpen
          ? "bg-ink-950/90 backdrop-blur-md border-b border-white/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-shell px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 shrink-0 font-display font-black text-xl tracking-tight text-white">
            WALLORA<span className="text-accent">.</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    active
                      ? "text-white bg-white/10 font-semibold"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="ml-1.5 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-accent text-accent-ink align-middle">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center relative w-64 xl:w-80">
            <Search className="absolute left-3.5 w-4 h-4 text-neutral-500 pointer-events-none" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search 4K wallpapers..."
              className="w-full rounded-full bg-white/5 border border-white/10 pl-10 pr-4 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-accent transition-colors"
            />
          </form>

          {/* Actions / Auth */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/favorites"
              className="p-2 rounded-full text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Favorites"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {user ? (
              <Link
                href="/profile"
                className="flex items-center gap-2 p-1 rounded-full border border-white/15 hover:border-accent transition-colors"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.profileImage || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-neutral-300 hover:text-white px-3 py-2 rounded-full hover:bg-white/5 transition"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="text-xs font-bold bg-accent text-accent-ink px-4 py-2 rounded-full hover:brightness-110 transition shadow-sm"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-ink-950 px-4 py-4 space-y-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search wallpapers..."
              className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-neutral-500"
            />
          </form>

          <div className="grid gap-1 pt-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  pathname === link.href ? "bg-white/10 text-white font-semibold" : "text-neutral-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10">
            {user ? (
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 text-sm font-medium"
              >
                <UserIcon className="w-4 h-4 text-accent" />
                <span>My Profile ({user.name})</span>
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-xl border border-white/15 text-sm font-semibold"
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

