"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

export const TOAST_EVENT = "wallora:toast";

export function showToast(message: string) {
  window.dispatchEvent(new CustomEvent<string>(TOAST_EVENT, { detail: message }));
}

/** Minimal toast host — mount once in the root layout (spec G). */
export function Toaster() {
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const handler = (e: Event) => {
      setToast((e as CustomEvent<string>).detail);
      clearTimeout(timer);
      timer = setTimeout(() => setToast(null), 2600);
    };
    window.addEventListener(TOAST_EVENT, handler);
    return () => {
      window.removeEventListener(TOAST_EVENT, handler);
      clearTimeout(timer);
    };
  }, []);

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] animate-toast-in"
    >
      <p className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-raised border border-line/15 text-xs font-semibold text-strong shadow-xl">
        <CheckCircle2 className="w-4 h-4 text-accent" aria-hidden />
        <span>{toast}</span>
      </p>
    </div>
  );
}
