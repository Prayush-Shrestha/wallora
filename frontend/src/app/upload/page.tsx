"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload as UploadIcon, Loader2, AlertCircle, ImagePlus } from "lucide-react";
import { FadeIn } from "../../components/ui/FadeIn";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { CATEGORIES } from "../../lib/data";
import * as uploadService from "../../services/uploadService";
import { useAuth } from "../../hooks/useAuth";

// /upload — file drop + preview + metadata + publish.
export default function UploadPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("nature");
  const [tags, setTags] = useState("");
  const [deviceType, setDeviceType] = useState("desktop");
  const [resolution, setResolution] = useState("4K");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Revoke the previous preview URL so repeated picks don't leak memory.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFile = (f: File | undefined) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Please choose an image file (PNG, JPG, or WebP).");
      return;
    }
    setError(null);
    setFile(f);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(f);
    });
    if (!title) setTitle(f.name.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " "));
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!user) {
      router.push("/login");
      return;
    }
    if (!file) {
      setError("Please select an image to upload.");
      return;
    }
    if (!title.trim()) {
      setError("Please give your wallpaper a title.");
      return;
    }
    setLoading(true);
    try {
      const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);
      const wallpaper = await uploadService.uploadWallpaper({
        file,
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        tags: tagList,
        deviceType,
        resolution,
      });
      router.push(`/wallpaper/${wallpaper.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 space-y-8">
      <FadeIn>
        <h1 className="font-display text-3xl font-black text-strong tracking-tight">
          Upload Wallpaper
        </h1>
        <p className="mt-1 text-sm text-muted">
          Share your art with the community — JPG, PNG, or WebP, up to 20MB.
        </p>
      </FadeIn>

      {error && (
        <div role="alert" className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePublish} className="space-y-6 rounded-3xl border border-line/10 bg-raised/60 p-6 sm:p-8">
        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
            Image file
          </label>
          <label
            htmlFor="upload-file"
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line/20 bg-base/50 px-6 py-10 text-center cursor-pointer hover:border-accent/60 transition"
          >
            {previewUrl ? (
              <span className="relative block w-full max-w-sm aspect-[16/10] rounded-xl overflow-hidden border border-line/10">
                <Image src={previewUrl} alt="Upload preview" fill sizes="(max-width: 768px) 100vw, 600px" className="object-contain bg-black/20" />
              </span>
            ) : (
              <>
                <ImagePlus className="w-8 h-8 text-faint" aria-hidden />
                <span className="text-sm text-muted">
                  Drag &amp; drop or <span className="text-accent font-semibold">browse files</span>
                </span>
                <span className="text-[11px] text-faint">PNG, JPG, WebP — recommended 1920×1080 or higher</span>
              </>
            )}
          </label>
          <input
            id="upload-file"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          {file && (
            <p className="mt-2 text-xs text-muted">
              Selected: <span className="text-strong font-medium">{file.name}</span>
            </p>
          )}
        </div>

        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Midnight drive through neon rain"
          required
        />

        <div>
          <label htmlFor="upload-desc" className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
            Description
          </label>
          <textarea
            id="upload-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell the story behind this wallpaper..."
            className="w-full rounded-xl bg-base border border-line/10 p-3.5 text-sm text-strong placeholder:text-faint focus:outline-none focus:border-accent resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="upload-category" className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              id="upload-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl bg-base border border-line/10 px-3.5 py-3 text-sm text-strong focus:outline-none focus:border-accent"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.slug} className="bg-base">
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="neon, night, city"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="upload-device" className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
              Device type
            </label>
            <select
              id="upload-device"
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value)}
              className="w-full rounded-xl bg-base border border-line/10 px-3.5 py-3 text-sm text-strong focus:outline-none focus:border-accent"
            >
              <option value="desktop">Desktop</option>
              <option value="phone">Phone</option>
              <option value="tablet">Tablet</option>
              <option value="ultrawide">Ultrawide</option>
            </select>
          </div>
          <div>
            <label htmlFor="upload-resolution" className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
              Resolution
            </label>
            <select
              id="upload-resolution"
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full rounded-xl bg-base border border-line/10 px-3.5 py-3 text-sm text-strong focus:outline-none focus:border-accent"
            >
              <option value="HD">HD</option>
              <option value="FHD">Full HD</option>
              <option value="4K">4K Ultra HD</option>
              <option value="8K">8K</option>
            </select>
          </div>
        </div>

        <Button type="submit" loading={loading} icon={!loading ? <UploadIcon className="w-4 h-4" /> : undefined} className="w-full">
          {loading ? "Publishing..." : "Publish wallpaper"}
        </Button>
        {!user && (
          <p className="text-center text-xs text-muted">
            You&apos;ll be asked to log in before publishing.
          </p>
        )}
        {loading && <Loader2 className="w-4 h-4 animate-spin mx-auto text-faint" aria-hidden />}
      </form>
    </div>
  );
}
