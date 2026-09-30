"use client";

import { TriangleAlert } from "lucide-react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center space-y-4">
      <TriangleAlert className="w-10 h-10 text-faint mx-auto" aria-hidden />
      <h1 className="font-display text-2xl font-bold text-strong tracking-tight">
        Something didn&apos;t load
      </h1>
      <p className="text-sm text-muted">
        Please check your connection — and that the backend is running — then try again.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center px-6 py-3 rounded-full bg-accent text-accent-ink text-sm font-bold hover:brightness-110 transition"
      >
        Try again
      </button>
    </div>
  );
}
