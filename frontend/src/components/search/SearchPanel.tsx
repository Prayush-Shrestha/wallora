"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, TrendingUp, Clock, ArrowUpRight } from "lucide-react";

const TRENDING = ["anime", "cars", "minimal", "nature", "aesthetic", "cyberpunk"];

interface SearchPanelProps {
  categories: { name: string; slug: string }[];
  variant?: "hero" | "inline";
}

/** Premium search with recent / trending / categories (spec K). */
export function SearchPanel({ categories, variant = "hero" }: SearchPanelProps) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      setRecent(JSON.parse(localStorage.getItem("wallora_recent_searches") || "[]"));
    } catch {
      setRecent([]);
    }
  }, [open]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const go = (query: string) => {
    const term = query.trim();
    if (!term) return;
    try {
      const next = [term, ...recent.filter((r) => r !== term)].slice(0, 6);
      localStorage.setItem("wallora_recent_searches", JSON.stringify(next));
    } catch {
      // ignore — private mode
    }
    setOpen(false);
    router.push(`/explore?q=${encodeURIComponent(term)}`);
  };

  return (
    <div ref={boxRef} className="relative w-full max-w-xl mx-auto">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          go(q);
        }}
        className={`flex items-center gap-2 rounded-full border bg-ink-950/80 backdrop-blur-md transition-colors ${
          open ? "border-accent/60" : "border-white/15 hover:border-white/25"
        } ${variant === "hero" ? "p-1.5 pl-5" : "p-1 pl-4"}`}
      >
        <Search className="w-4 h-4 text-neutral-400 shrink-0" aria-hidden />
        <label htmlFor="hero-search" className="sr-only">
          Search wallpapers
        </label>
        <input
          id="hero-search"
          type="search"
          value={q}
          autoComplete="off"
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Search wallpapers, styles, moods..."
          className="flex-1 min-w-0 bg-transparent py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 px-5 py-2.5 rounded-full bg-accent text-accent-ink text-xs font-bold hover:brightness-110 active:scale-95 transition"
        >
          Search
        </button>
      </form>

      {open && (
        <div className="absolute inset-x-0 top-full mt-2 rounded-2xl border border-white/10 bg-ink-900/95 backdrop-blur-xl p-4 text-left shadow-2xl z-30 space-y-4">
          {recent.length > 0 && (
            <div>
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500 mb-2">
                <Clock className="w-3 h-3" aria-hidden /> Recent
              </p>
              <div className="flex flex-wrap gap-1.5">
                {recent.map((r) => (
                  <button
                    key={r}
                    onClick={() => go(r)}
                    className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-neutral-300 hover:text-white hover:border-white/25 transition"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500 mb-2">
              <TrendingUp className="w-3 h-3" aria-hidden /> Trending
            </p>
            <div className="flex flex-wrap gap-1.5">
              {TRENDING.map((t) => (
                <button
                  key={t}
                  onClick={() => go(t)}
                  className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-neutral-300 hover:text-accent hover:border-accent/40 transition capitalize"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          {categories.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500 mb-2">
                Collections
              </p>
              <ul className="grid grid-cols-2 gap-1">
                {categories.slice(0, 6).map((c) => (
                  <li key={c.slug}>
                    <button
                      onClick={() => {
                        setOpen(false);
                        router.push(`/category/${c.slug}`);
                      }}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs text-neutral-300 hover:bg-white/5 hover:text-white transition"
                    >
                      <span>{c.name}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
