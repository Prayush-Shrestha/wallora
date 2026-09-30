"use client";
import { Smartphone, Tablet, Laptop, Monitor, RectangleHorizontal } from "lucide-react";
import type { DeviceKind } from "@/lib/data";

const DEVICES: { value: DeviceKind | "all"; label: string; sub: string; icon: any; box: string }[] = [
  { value: "all", label: "All", sub: "Every ratio", icon: RectangleHorizontal, box: "w-10 h-7" },
  { value: "phone", label: "Phone", sub: "1080×2400", icon: Smartphone, box: "w-5 h-9" },
  { value: "tablet", label: "Tablet", sub: "1668×2420", icon: Tablet, box: "w-7 h-9" },
  { value: "laptop", label: "Laptop", sub: "1920×1080", icon: Laptop, box: "w-10 h-7" },
  { value: "desktop", label: "Desktop", sub: "4K · 3840×2160", icon: Monitor, box: "w-10 h-7" },
  { value: "ultrawide", label: "Ultrawide", sub: "3440×1440", icon: RectangleHorizontal, box: "w-12 h-6" },
];

export default function DeviceFilter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1" role="radiogroup" aria-label="Filter by device">
      {DEVICES.map((d) => {
        const active = value === d.value;
        const Icon = d.icon;
        return (
          <button
            key={d.value}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(d.value)}
            className={`shrink-0 flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors min-h-[56px] ${
              active
                ? "border-accent/70 bg-accent/[0.08] light:bg-accent/20"
                : "border-white/10 light:border-black/10 bg-ink-900 light:bg-white hover:border-white/25 light:hover:border-black/25"
            }`}
          >
            <span className={`flex items-center justify-center rounded-[6px] border ${active ? "border-accent/50 bg-ink-950 light:bg-white" : "border-white/15 light:border-black/15 bg-ink-950 light:bg-neutral-100"} ${d.box}`}>
              <Icon className="h-4 w-4 text-neutral-300 light:text-neutral-600" aria-hidden />
            </span>
            <span>
              <span className={`block text-[13px] font-semibold leading-tight ${active ? "text-white light:text-neutral-900" : "text-neutral-200 light:text-neutral-700"}`}>{d.label}</span>
              <span className="block text-[11px] text-neutral-500 leading-tight mt-0.5">{d.sub}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
