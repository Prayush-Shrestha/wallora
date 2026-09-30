"use client";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Search, ArrowRight } from "lucide-react";
import { searchWallpapers } from "@/lib/data";

export default function SearchBar({ large = false, initial = "", autofocus = false }: { large?: boolean; initial?: string; autofocus?: boolean }) {
  const router = useRouter();
  const [q, setQ] = useState(initial);
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (q.trim().length < 2) { setSuggestions([]); setOpen(false); return; }
    const results = searchWallpapers(q).slice(0, 5).map((w) => w.title);
    const tags = Array.from(new Set(searchWallpapers(q).flatMap((w) => w.tags))).filter((t) => t.includes(q.toLowerCase())).slice(0, 3);
    setSuggestions([...tags, ...results].slice(0, 6));
    setOpen(true);
  }, [q]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => { if (!boxRef.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const go = (term: string) => {
    if (!term.trim()) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(term.trim())}`);
  };

  return (
    <div ref={boxRef} className={`relative w-full ${large ? "max-w-xl" : "max-w-md"}`}>
      <form
        role="search"
        onSubmit={(e) => { e.preventDefault(); go(q); }}
        className={`flex items-center gap-2 bg-white light:bg-white border border-white/15 light:border-black/15 shadow-[0_8px_30px_rgba(0,0,0,0.35)] light:shadow-[0_8px_24px_rgba(0,0,0,0.08)] ${large ? "rounded-2xl p-2 pl-4" : "rounded-full p-1.5 pl-4"}`}
      >
        <Search className="h-5 w-5 text-neutral-500 shrink-0" aria-hidden />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => q.trim().length >= 2 && setOpen(true)}
          placeholder="Search wallpapers, styles, colors…"
          aria-label="Search wallpapers, styles, colors"
          autoFocus={autofocus}
          className="flex-1 min-w-0 bg-transparent text-[15px] text-neutral-900 placeholder:text-neutral-500 focus:outline-none"
        />
        {q && (
          <button type="button" onClick={() => setQ("")} className="text-[13px] text-neutral-500 px-2" aria-label="Clear search">Clear</button>
        )}
        <button type="submit" className={`inline-flex items-center gap-1.5 bg-neutral-900 light:bg-neutral-900 text-white text-[14px] font-semibold px-4 py-2.5 ${large ? "rounded-xl" : "rounded-full"} hover:bg-black`} aria-label="Search">
          Search <ArrowRight className="h-4 w-4 hidden sm:inline" aria-hidden />
        </button>
      </form>
      {open && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 inset-x-0 bg-[#161616] light:bg-white border border-white/10 light:border-black/10 rounded-xl overflow-hidden shadow-xl z-40" role="listbox" aria-label="Search suggestions">
          {suggestions.map((s) => (
            <button key={s} role="option" aria-selected="false" onClick={() => go(s)} className="w-full text-left px-4 py-2.5 text-[14px] text-neutral-200 light:text-neutral-700 hover:bg-white/10 light:hover:bg-black/5 flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-neutral-500" aria-hidden /> <span className="truncate">{s}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
