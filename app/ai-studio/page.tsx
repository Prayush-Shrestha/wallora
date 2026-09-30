"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Download, Heart, RefreshCw, Pencil, Plus, Check, Loader2 } from "lucide-react";
import { AI_STYLES, AI_ORIENTATIONS, AI_RESOLUTIONS, AI_MOODS, AI_COLORS, generateWallpaper, type AIResult, type AIOptions } from "@/lib/ai";
import { AI_SUGGESTIONS, getWallpaper } from "@/lib/data";
import { useStore } from "@/components/StoreProvider";

function StudioInner() {
  const params = useSearchParams();
  const { addCreation, toggleFavorite, isFavorite } = useStore();

  const fromId = params.get("from");
  const fromMode = params.get("mode");
  const fromWallpaper = fromId ? getWallpaper(fromId) : undefined;

  const [prompt, setPrompt] = useState(
    fromWallpaper ? `${fromWallpaper.title}, ${fromWallpaper.tags.slice(0, 3).join(", ")}${fromMode ? ` — ${fromMode.toLowerCase()}` : ""}` : ""
  );
  const [style, setStyle] = useState("Cinematic");
  const [orientation, setOrientation] = useState<AIOptions["orientation"]>("landscape");
  const [resolution, setResolution] = useState("Full HD");
  const [mood, setMood] = useState("Dramatic");
  const [color, setColor] = useState("Any");
  const [status, setStatus] = useState<"idle" | "generating" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AIResult | null>(null);
  const [refine, setRefine] = useState("");
  const [savedNote, setSavedNote] = useState(false);

  useEffect(() => {
    if (fromWallpaper && orientation === "landscape" && fromMode === "Create Phone Version") {
      setOrientation("portrait");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options: AIOptions = { style, orientation, resolution, mood, color };

  const run = async (customPrompt?: string) => {
    const p = (customPrompt ?? prompt).trim();
    if (!p || status === "generating") return;
    setStatus("generating");
    setProgress(2);
    setResult(null);
    try {
      const r = await generateWallpaper(p, { ...options }, setProgress);
      setResult(r);
      addCreation(r);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  const download = async () => {
    if (!result) return;
    try {
      const res = await fetch(result.image);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `wallora-ai-${result.seed}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(result?.image, "_blank");
    }
  };

  const favId = result ? result.id : "";
  const fav = favId ? isFavorite(favId) : false;

  const applyRefine = () => {
    if (!refine.trim() || !result) return;
    const next = `${result.prompt}, ${refine.trim()}`;
    setPrompt(next);
    setRefine("");
    run(next);
  };

  return (
    <div className="mx-auto max-w-[1320px] px-4 sm:px-6 py-8">
      <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] bg-accent text-accent-ink px-2.5 py-1 rounded"><Sparkles className="h-3 w-3" /> AI Studio</p>
      <h1 className="font-display text-[30px] sm:text-[42px] font-bold tracking-tight mt-3">Create your wallpaper.</h1>
      <p className="text-neutral-400 light:text-neutral-500 text-[15px] mt-2 max-w-[560px]">Describe the wallpaper you imagine. We&apos;ll turn your idea into a wallpaper.</p>

      {fromWallpaper && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 light:border-black/10 bg-ink-900 light:bg-white p-3 max-w-[560px]">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
            <Image src={fromWallpaper.thumbnail} alt={fromWallpaper.title} fill sizes="60px" className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold truncate">Remixing “{fromWallpaper.title}”{fromMode ? ` · ${fromMode}` : ""}</p>
            <Link href={`/wallpaper/${fromWallpaper.id}`} className="text-[12.5px] text-neutral-500 underline underline-offset-2">View original</Link>
          </div>
        </div>
      )}

      <div className="mt-6 grid lg:grid-cols-[1fr_420px] gap-6 items-start">
        {/* Controls */}
        <div className="rounded-2xl border border-white/10 light:border-black/10 bg-ink-900 light:bg-white p-4 sm:p-6">
          <label htmlFor="ai-prompt" className="text-[13px] font-semibold uppercase tracking-[0.1em] text-neutral-500">Describe your wallpaper</label>
          <textarea
            id="ai-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder="A black Porsche driving through Tokyo at night in the rain, cinematic photography, neon reflections"
            className="mt-2 w-full rounded-xl bg-ink-950 light:bg-neutral-100 border border-white/10 light:border-black/10 px-4 py-3.5 text-[15px] leading-relaxed placeholder:text-neutral-600 focus:outline-none focus:border-accent/70 min-h-[120px]"
          />
          <div className="mt-3">
            <p className="text-[12.5px] text-neutral-500 font-medium">Try one:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {AI_SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => setPrompt(s)} className="text-[13px] border border-white/10 light:border-black/10 rounded-full px-3.5 py-2 hover:border-accent/70 hover:bg-accent/10 transition-colors min-h-[40px] text-left">
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-5">
            <fieldset>
              <legend className="text-[13px] font-semibold">Style</legend>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {AI_STYLES.map((s) => (
                  <button key={s} onClick={() => setStyle(s)} aria-pressed={style === s} className={`text-[13px] rounded-lg px-3 py-2 min-h-[40px] border ${style === s ? "bg-white text-black light:bg-neutral-900 light:text-white border-transparent font-semibold" : "border-white/10 light:border-black/10 hover:border-white/30"}`}>{s}</button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-[13px] font-semibold">Mood</legend>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {AI_MOODS.map((m) => (
                  <button key={m} onClick={() => setMood(m)} aria-pressed={mood === m} className={`text-[13px] rounded-lg px-3 py-2 min-h-[40px] border ${mood === m ? "bg-white text-black light:bg-neutral-900 light:text-white border-transparent font-semibold" : "border-white/10 light:border-black/10 hover:border-white/30"}`}>{m}</button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-[13px] font-semibold">Orientation <span className="font-normal text-neutral-500">· {AI_ORIENTATIONS.find((o) => o.value === orientation)?.ratio}</span></legend>
              <div className="mt-2 grid grid-cols-4 gap-1.5">
                {AI_ORIENTATIONS.map((o) => (
                  <button key={o.value} onClick={() => setOrientation(o.value)} aria-pressed={orientation === o.value} className={`rounded-lg border px-2 py-2.5 min-h-[52px] text-[12.5px] font-medium ${orientation === o.value ? "border-accent bg-accent/10 font-bold" : "border-white/10 light:border-black/10"}`}>
                    {o.label}
                    <span className="block text-[10.5px] text-neutral-500 font-normal">{o.ratio}</span>
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="grid grid-cols-2 gap-4">
              <label className="grid gap-2 text-[13px] font-semibold">
                Resolution
                <select value={resolution} onChange={(e) => setResolution(e.target.value)} className="bg-ink-950 light:bg-neutral-100 border border-white/10 light:border-black/10 rounded-lg px-3 py-2.5 text-[14px] font-normal min-h-[44px]" aria-label="Resolution">
                  {AI_RESOLUTIONS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </label>
              <fieldset>
                <legend className="text-[13px] font-semibold">Color</legend>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {AI_COLORS.map((c) => (
                    <button key={c} onClick={() => setColor(c)} aria-pressed={color === c} className={`text-[12px] rounded-full px-2.5 py-1.5 min-h-[36px] border ${color === c ? "bg-white text-black light:bg-neutral-900 light:text-white border-transparent font-semibold" : "border-white/10 light:border-black/10"}`}>{c}</button>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>

          <button
            onClick={() => run()}
            disabled={!prompt.trim() || status === "generating"}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-accent text-accent-ink font-bold text-[15px] rounded-full px-6 py-4 min-h-[56px] disabled:opacity-40 hover:brightness-95"
          >
            {status === "generating" ? <><Loader2 className="h-4.5 w-4.5 animate-spin" /> Creating…</> : <><Sparkles className="h-4.5 w-4.5" /> Generate Wallpaper</>}
          </button>
          <p className="mt-2.5 text-[12px] text-neutral-500 text-center">Free preview · Full HD export · No watermark</p>
        </div>

        {/* Result panel */}
        <div className="rounded-2xl border border-white/10 light:border-black/10 bg-ink-900 light:bg-white p-4 sm:p-5 lg:sticky lg:top-24" aria-live="polite">
          {status === "idle" && !result && (
            <div className="aspect-[4/3] rounded-xl bg-ink-950 light:bg-neutral-100 border border-dashed border-white/15 light:border-black/15 flex flex-col items-center justify-center text-center p-6">
              <Sparkles className="h-6 w-6 text-neutral-600" aria-hidden />
              <p className="mt-3 text-[14.5px] font-semibold">Your wallpaper will appear here</p>
              <p className="text-[13px] text-neutral-500 mt-1 max-w-[260px]">Write a prompt, pick Phone or Desktop, hit Generate.</p>
            </div>
          )}

          {status === "generating" && (
            <div>
              <div className="aspect-[4/3] rounded-xl bg-ink-950 light:bg-neutral-100 overflow-hidden relative flex items-center justify-center">
                <div className="text-center px-6">
                  <p className="text-[15px] font-semibold">Creating your wallpaper…</p>
                  <p className="text-[13px] text-neutral-500 mt-1">Composing light, color and detail · {progress}%</p>
                </div>
                <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10 light:bg-black/10">
                  <div className="h-full bg-accent transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
                <div className="absolute top-0 inset-x-0 h-[2px] overflow-hidden">
                  <div className="ai-line h-full w-2/5 bg-accent/70" />
                </div>
              </div>
              <p className="mt-3 text-[12.5px] text-neutral-500">Tip: add “phone wallpaper, vertical” or “ultrawide 21:9” to the prompt for exact crops.</p>
            </div>
          )}

          {status === "error" && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-[14px]">
              <p className="font-semibold">Generation paused.</p>
              <p className="text-neutral-400 mt-1">The image service hiccuped. Your prompt is saved.</p>
              <button onClick={() => run()} className="mt-3 rounded-full bg-white text-black text-[13.5px] font-semibold px-4 py-2">Try again</button>
            </div>
          )}

          {result && status === "done" && (
            <div className="fade-up">
              <div className="relative w-full overflow-hidden rounded-xl border border-white/10 light:border-black/10" style={{ aspectRatio: orientation === "portrait" ? "9/14" : orientation === "square" ? "1/1" : orientation === "ultrawide" ? "21/9" : "16/10" }}>
                <Image src={result.image} alt={result.prompt} fill sizes="420px" className="object-cover" />
              </div>
              <p className="mt-3 text-[13px] text-neutral-400 light:text-neutral-600 line-clamp-2">“{result.prompt}”</p>
              <p className="text-[12px] text-neutral-500 mt-1">{result.options.style} · {result.options.mood} · {result.options.resolution} · {result.options.orientation}</p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button onClick={download} className="inline-flex items-center justify-center gap-1.5 bg-accent text-accent-ink text-[13.5px] font-bold rounded-full px-4 py-3 min-h-[48px]"><Download className="h-4 w-4" /> Download</button>
                <button onClick={() => { toggleFavorite(result.id); setSavedNote(true); setTimeout(() => setSavedNote(false), 1600); }} aria-pressed={fav} className="inline-flex items-center justify-center gap-1.5 border border-white/15 light:border-black/15 text-[13.5px] font-semibold rounded-full px-4 py-3 min-h-[48px]">
                  {fav || savedNote ? <><Check className="h-4 w-4" /> Saved</> : <><Heart className="h-4 w-4" /> Favorite</>}
                </button>
                <button onClick={() => run()} className="inline-flex items-center justify-center gap-1.5 border border-white/15 light:border-black/15 text-[13.5px] font-semibold rounded-full px-4 py-3 min-h-[48px]"><RefreshCw className="h-4 w-4" /> Regenerate</button>
                <button onClick={() => { setResult(null); setStatus("idle"); document.getElementById("ai-prompt")?.focus(); }} className="inline-flex items-center justify-center gap-1.5 border border-white/15 light:border-black/15 text-[13.5px] font-semibold rounded-full px-4 py-3 min-h-[48px]"><Pencil className="h-4 w-4" /> Edit prompt</button>
              </div>

              <div className="mt-4 rounded-xl bg-ink-950 light:bg-neutral-100 border border-white/10 light:border-black/10 p-3">
                <label htmlFor="ai-refine" className="text-[12.5px] font-semibold">Refine it — e.g. “make it darker”, “add snow”</label>
                <div className="mt-2 flex gap-2">
                  <input id="ai-refine" value={refine} onChange={(e) => setRefine(e.target.value)} onKeyDown={(e) => e.key === "Enter" && applyRefine()} placeholder="Make it cinematic…" className="flex-1 min-w-0 bg-transparent border border-white/10 light:border-black/10 rounded-full px-3.5 py-2.5 text-[13.5px] focus:outline-none focus:border-accent/70" />
                  <button onClick={applyRefine} disabled={!refine.trim()} className="shrink-0 rounded-full bg-white text-black light:bg-neutral-900 light:text-white text-[13px] font-semibold px-4 py-2.5 disabled:opacity-40">Apply</button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {["Make it darker", "Add snow", "Make it cinematic", "Change to phone wallpaper"].map((r) => (
                    <button key={r} onClick={() => { setRefine(r); setPrompt(`${result.prompt}, ${r.toLowerCase()}`); run(`${result.prompt}, ${r.toLowerCase()}`); }} className="text-[12px] border border-white/10 light:border-black/10 rounded-full px-3 py-1.5 hover:border-accent/60">{r}</button>
                  ))}
                </div>
              </div>

              <button onClick={() => { setResult(null); setStatus("idle"); setPrompt(""); }} className="mt-3 w-full inline-flex items-center justify-center gap-1.5 text-[13.5px] font-semibold text-neutral-400 hover:text-white light:hover:text-black py-2"><Plus className="h-4 w-4" /> Generate another</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AIStudioPage() {
  return (
    <Suspense fallback={<div className="p-8 text-neutral-500">Loading studio…</div>}>
      <StudioInner />
    </Suspense>
  );
}
