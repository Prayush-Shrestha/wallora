"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Heart, Download, Share2, Maximize2, X, ChevronRight, Monitor, Smartphone, Sparkles, Check } from "lucide-react";
import { getWallpaper, relatedWallpapers } from "@/lib/data";
import { WallpaperMasonry } from "@/components/WallpaperCard";
import { useStore } from "@/components/StoreProvider";

const AI_REMIXES = ["Create Similar", "Change Colors", "Make it Minimal", "Make it Dark", "Change Background", "Extend Image", "Create Phone Version"];

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return `${n}`;
}

export default function WallpaperDetailPage() {
  const rawParams = useParams();
  const id = rawParams.id as string;
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useStore();
  const [fullscreen, setFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState<"auto" | "phone" | "desktop">("auto");

  const w = getWallpaper(id);
  if (!w) {
    return (
      <div className="mx-auto max-w-[1320px] px-4 py-20 text-center">
        <p className="font-display text-[24px] font-bold">Wallpaper not found.</p>
        <Link href="/explore" className="mt-4 inline-block rounded-full bg-white text-black px-5 py-2.5 text-[14px] font-semibold">Back to explore</Link>
      </div>
    );
  }

  const fav = isFavorite(w.id);
  const related = relatedWallpapers(w.id, 8);
  const isPortrait = w.orientation === "portrait";
  const showPhoneFrame = previewMode === "phone" || (previewMode === "auto" && isPortrait);

  const download = async () => {
    try {
      const res = await fetch(w.image);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `wallora-${w.id}-${w.width}x${w.height}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(w.image, "_blank");
    }
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: w.title, url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      } catch {}
    }
  };

  return (
    <div className="mx-auto max-w-[1320px] px-4 sm:px-6 py-6 sm:py-8">
      <nav aria-label="Breadcrumb" className="text-[13px] text-neutral-500 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:underline">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <Link href="/explore" className="hover:underline">Explore</Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <Link href={`/category/${w.category}`} className="hover:underline capitalize">{w.category}</Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <span className="text-neutral-200 light:text-neutral-700 font-medium truncate max-w-[200px]">{w.title}</span>
      </nav>

      <div className="mt-5 grid lg:grid-cols-[1.5fr_1fr] gap-6 lg:gap-10">
        {/* Preview — responsive device frame */}
        <div>
          <div className={`flex justify-center rounded-[8px] border border-white/10 light:border-black/10 bg-ink-900 light:bg-neutral-100 p-4 sm:p-8 ${showPhoneFrame ? "" : ""}`}>
            {showPhoneFrame ? (
              <div className="w-[240px] sm:w-[280px] rounded-[28px] border-[6px] border-black light:border-neutral-800 overflow-hidden bg-black shadow-xl" role="img" aria-label={`${w.title} phone preview`}>
                <div className="relative aspect-[9/19.5] w-full">
                  <Image src={w.image} alt={w.title} fill sizes="300px" className="object-cover" priority />
                </div>
              </div>
            ) : (
              <div className="w-full max-w-[760px]" role="img" aria-label={`${w.title} desktop preview`}>
                <div className="rounded-t-[10px] border border-white/10 light:border-black/10 border-b-0 bg-[#1a1a1a] light:bg-neutral-200 px-3 py-2 flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#3a3a3a] light:bg-neutral-400" aria-hidden />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#3a3a3a] light:bg-neutral-400" aria-hidden />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#3a3a3a] light:bg-neutral-400" aria-hidden />
                  <span className="ml-2 text-[11px] text-neutral-500 truncate">wallora.app — {w.title}</span>
                </div>
                <div className="relative w-full overflow-hidden rounded-b-[10px] border border-white/10 light:border-black/10" style={{ aspectRatio: "16/10" }}>
                  <Image src={w.image} alt={w.title} fill sizes="760px" className="object-cover" priority />
                </div>
                <div className="mx-auto mt-0 h-2 w-[120px] bg-[#1a1a1a] light:bg-neutral-300 rounded-b-lg" aria-hidden />
              </div>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-full border border-white/10 light:border-black/10 p-1 text-[13px] font-semibold" role="group" aria-label="Preview mode">
              {(["auto", "phone", "desktop"] as const).map((m) => (
                <button key={m} onClick={() => setPreviewMode(m)} aria-pressed={previewMode === m} className={`rounded-full px-3.5 py-1.5 capitalize min-h-[36px] ${previewMode === m ? "bg-white text-black light:bg-neutral-900 light:text-white" : "text-neutral-400"}`}>
                  {m === "auto" ? "Auto" : m}
                </button>
              ))}
            </div>
            <button onClick={() => setFullscreen(true)} className="inline-flex items-center gap-1.5 text-[13px] font-semibold border border-white/10 light:border-black/10 rounded-full px-4 py-2 min-h-[40px] hover:border-white/30">
              <Maximize2 className="h-3.5 w-3.5" /> Fullscreen
            </button>
            <span className="text-[12.5px] text-neutral-500 ml-auto">{w.width} × {w.height} · {w.orientation}</span>
          </div>
        </div>

        {/* Meta */}
        <div>
          <p className="text-[12px] uppercase tracking-[0.14em] text-neutral-500 font-semibold">
            <Link href={`/category/${w.category}`} className="hover:underline">{w.category}</Link>
            {w.isAI && <span className="ml-2 bg-white/10 light:bg-black/5 rounded px-2 py-0.5 text-[11px]">AI creation</span>}
          </p>
          <h1 className="font-display text-[26px] sm:text-[32px] font-bold tracking-tight leading-tight mt-2">{w.title}</h1>
          <div className="flex items-center gap-2.5 mt-3">
            <Image src={w.authorAvatar} alt="" width={32} height={32} className="rounded-full" />
            <div>
              <p className="text-[13.5px] font-semibold leading-tight">{w.author}</p>
              <p className="text-[12px] text-neutral-500">{new Date(w.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {formatCount(w.downloads)} downloads · {formatCount(w.likes)} saves</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <button onClick={download} className="col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-2 bg-accent text-accent-ink font-semibold text-[14.5px] rounded-full px-5 py-3.5 min-h-[52px] hover:brightness-95">
              <Download className="h-4 w-4" /> Download free
            </button>
            <button onClick={() => toggleFavorite(w.id)} aria-pressed={fav} className={`col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-2 font-semibold text-[14.5px] rounded-full px-5 py-3.5 min-h-[52px] border transition-colors ${fav ? "bg-white text-black light:bg-neutral-900 light:text-white border-transparent" : "border-white/15 light:border-black/15 hover:border-white/35"}`}>
              <Heart className="h-4 w-4" fill={fav ? "currentColor" : "none"} /> {fav ? "Saved" : "Save"}
            </button>
            <button onClick={share} className="inline-flex items-center justify-center gap-2 text-[13.5px] font-semibold border border-white/15 light:border-black/15 rounded-full px-4 py-3 min-h-[48px] hover:border-white/35">
              {copied ? <><Check className="h-4 w-4" /> Link copied</> : <><Share2 className="h-4 w-4" /> Share</>}
            </button>
            <button onClick={() => setFullscreen(true)} className="inline-flex items-center justify-center gap-2 text-[13.5px] font-semibold border border-white/15 light:border-black/15 rounded-full px-4 py-3 min-h-[48px] hover:border-white/35 sm:hidden">
              <Maximize2 className="h-4 w-4" /> Preview
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <button onClick={() => setPreviewMode("phone")} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 light:border-black/10 bg-ink-900 light:bg-white px-4 py-3 text-[13.5px] font-semibold hover:border-accent/60">
              <Smartphone className="h-4 w-4" /> Use for phone
            </button>
            <button onClick={() => setPreviewMode("desktop")} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 light:border-black/10 bg-ink-900 light:bg-white px-4 py-3 text-[13.5px] font-semibold hover:border-accent/60">
              <Monitor className="h-4 w-4" /> Use for desktop
            </button>
          </div>

          <dl className="mt-6 rounded-2xl border border-white/10 light:border-black/10 divide-y divide-white/[0.07] light:divide-black/10 text-[13.5px]">
            {[
              ["Resolution", `${w.width} × ${w.height}`],
              ["Orientation", w.orientation],
              ["Works on", w.device.join(" · ")],
              ["Category", w.category],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between px-4 py-3">
                <dt className="text-neutral-500">{k}</dt>
                <dd className="font-medium capitalize">{v}</dd>
              </div>
            ))}
            <div className="flex justify-between items-center px-4 py-3">
              <dt className="text-neutral-500">Palette</dt>
              <dd className="flex gap-1.5">
                {w.colors.map((c) => (
                  <span key={c} title={c} className="h-6 w-6 rounded-full border border-white/20 light:border-black/15" style={{ background: c }} />
                ))}
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex flex-wrap gap-2">
            {w.tags.map((t) => (
              <Link key={t} href={`/search?q=${encodeURIComponent(t)}`} className="text-[12.5px] border border-white/10 light:border-black/10 rounded-full px-3 py-1.5 text-neutral-300 light:text-neutral-600 hover:border-white/30">#{t}</Link>
            ))}
          </div>

          {/* AI remix */}
          <div className="mt-6 rounded-2xl border border-white/10 light:border-black/10 bg-ink-900 light:bg-white p-4">
            <p className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.12em]"><Sparkles className="h-3.5 w-3.5" /> Remix with AI</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {AI_REMIXES.map((label) => (
                <button key={label} onClick={() => router.push(`/ai-studio?from=${w.id}&mode=${encodeURIComponent(label)}`)} className="text-[13px] font-medium border border-white/12 light:border-black/12 rounded-full px-3.5 py-2 hover:bg-accent hover:text-accent-ink hover:border-transparent transition-colors min-h-[40px]">
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <h2 className="font-display text-[22px] font-bold tracking-tight mt-12">Related wallpapers</h2>
      <div className="mt-4"><WallpaperMasonry items={related} /></div>

      {/* Fullscreen */}
      {fullscreen && (
        <div className="fixed inset-0 z-[80] bg-black flex flex-col" role="dialog" aria-modal="true" aria-label={`${w.title} fullscreen preview`}>
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-white/80 text-[13px] truncate">{w.title} · {w.width}×{w.height}</p>
            <div className="flex gap-2">
              <button onClick={download} aria-label="Download wallpaper" className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20"><Download className="h-5 w-5" /></button>
              <button onClick={() => setFullscreen(false)} aria-label="Close fullscreen" autoFocus className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20"><X className="h-5 w-5" /></button>
            </div>
          </div>
          <div className="flex-1 relative min-h-0" onClick={() => setFullscreen(false)}>
            <Image src={w.image} alt={w.title} fill sizes="100vw" className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
