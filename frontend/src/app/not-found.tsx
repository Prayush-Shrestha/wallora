import Link from "next/link";
import { ImageOff } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center space-y-4">
      <ImageOff className="w-10 h-10 text-faint mx-auto" aria-hidden />
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
        404
      </p>
      <h1 className="font-display text-2xl font-bold text-strong tracking-tight">
        This wall went blank
      </h1>
      <p className="text-sm text-muted">
        The page you&apos;re looking for doesn&apos;t exist or was moved.
      </p>
      <Link
        href="/explore"
        className="inline-flex items-center px-6 py-3 rounded-full bg-accent text-accent-ink text-sm font-bold hover:brightness-110 transition"
      >
        Explore wallpapers
      </Link>
    </div>
  );
}
