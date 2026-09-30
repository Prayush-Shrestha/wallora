"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, ImagePlus, Check, X } from "lucide-react";
import { CATEGORIES } from "@/lib/data";
import { useStore } from "@/components/StoreProvider";

const DEVICES = ["phone", "tablet", "laptop", "desktop", "ultrawide"];

export default function UploadPage() {
  const router = useRouter();
  const { addUpload } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("nature");
  const [tags, setTags] = useState("");
  const [device, setDevice] = useState<string[]>(["desktop"]);
  const [done, setDone] = useState(false);

  const onFile = (f: File | undefined) => {
    if (!f || !f.type.startsWith("image/")) return;
    const url = URL.createObjectURL(f);
    setPreview(url);
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
  };

  const toggleDevice = (d: string) =>
    setDevice((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const publish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!preview || !title.trim()) return;
    addUpload({ id: `upload-${Date.now()}`, title: title.trim(), image: preview, category, createdAt: new Date().toISOString() });
    setDone(true);
    setTimeout(() => router.push("/profile"), 1200);
  };

  return (
    <div className="mx-auto max-w-[860px] px-4 sm:px-6 py-8">
      <h1 className="font-display text-[28px] sm:text-[34px] font-bold tracking-tight">Upload wallpaper</h1>
      <p className="text-neutral-400 light:text-neutral-500 text-[14px] mt-1">Share photography or art. JPG/PNG/WebP, at least 1920px on the long edge.</p>

      {done ? (
        <div className="mt-8 rounded-2xl border border-accent/50 bg-accent/10 p-6 text-center" role="status">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-ink"><Check className="h-6 w-6" /></span>
          <p className="font-bold text-[18px] mt-3">Published.</p>
          <p className="text-[14px] text-neutral-400 mt-1">Taking you to your profile…</p>
        </div>
      ) : (
        <form onSubmit={publish} className="mt-6 grid gap-5">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); onFile(e.dataTransfer.files?.[0]); }}
            onClick={() => fileRef.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
            tabIndex={0}
            role="button"
            aria-label="Upload wallpaper image — drag and drop or choose file"
            className={`rounded-2xl border-2 border-dashed overflow-hidden cursor-pointer transition-colors ${dragOver ? "border-accent bg-accent/5" : "border-white/15 light:border-black/15 bg-ink-900 light:bg-white"} ${preview ? "p-0" : "p-8 sm:p-12 text-center"}`}
          >
            <input ref={fileRef} type="file" accept="image/*" className="hidden" aria-hidden onChange={(e) => onFile(e.target.files?.[0])} />
            {preview ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Upload preview" className="w-full max-h-[420px] object-contain bg-black" />
                <button type="button" onClick={(e) => { e.stopPropagation(); setPreview(null); }} aria-label="Remove image" className="absolute top-3 right-3 p-2 rounded-full bg-black/70 text-white"><X className="h-4 w-4" /></button>
              </div>
            ) : (
              <>
                <ImagePlus className="h-8 w-8 mx-auto text-neutral-500" aria-hidden />
                <p className="font-semibold text-[15px] mt-3">Drag and drop, or <span className="underline">choose file</span></p>
                <p className="text-[13px] text-neutral-500 mt-1">Your file stays in this browser demo — nothing leaves your device.</p>
              </>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="grid gap-1.5 text-[13.5px] font-semibold">
              Title *
              <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Fog over the north ridge" className="rounded-xl bg-ink-900 light:bg-white border border-white/10 light:border-black/15 px-4 py-3 text-[14.5px] font-normal focus:outline-none focus:border-accent/70 min-h-[48px]" />
            </label>
            <label className="grid gap-1.5 text-[13.5px] font-semibold">
              Category
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl bg-ink-900 light:bg-white border border-white/10 light:border-black/15 px-4 py-3 text-[14.5px] font-normal min-h-[48px]" aria-label="Category">
                {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
              </select>
            </label>
          </div>

          <label className="grid gap-1.5 text-[13.5px] font-semibold">
            Description
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Where was this taken? What mood does it carry?" className="rounded-xl bg-ink-900 light:bg-white border border-white/10 light:border-black/15 px-4 py-3 text-[14.5px] font-normal focus:outline-none focus:border-accent/70" />
          </label>

          <label className="grid gap-1.5 text-[13.5px] font-semibold">
            Tags <span className="font-normal text-neutral-500">(comma separated)</span>
            <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="fog, forest, calm, green" className="rounded-xl bg-ink-900 light:bg-white border border-white/10 light:border-black/15 px-4 py-3 text-[14.5px] font-normal focus:outline-none focus:border-accent/70 min-h-[48px]" />
          </label>

          <fieldset>
            <legend className="text-[13.5px] font-semibold">Best on</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {DEVICES.map((d) => (
                <button type="button" key={d} onClick={() => toggleDevice(d)} aria-pressed={device.includes(d)} className={`capitalize text-[13.5px] rounded-full px-4 py-2.5 min-h-[44px] border ${device.includes(d) ? "bg-accent text-accent-ink border-transparent font-bold" : "border-white/12 light:border-black/12"}`}>{d}</button>
              ))}
            </div>
          </fieldset>

          <button type="submit" disabled={!preview || !title.trim()} className="inline-flex items-center justify-center gap-2 bg-accent text-accent-ink font-bold text-[15px] rounded-full px-6 py-4 min-h-[56px] disabled:opacity-40">
            <Upload className="h-4 w-4" /> Publish Wallpaper
          </button>
        </form>
      )}
    </div>
  );
}
