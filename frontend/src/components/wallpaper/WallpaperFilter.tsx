"use client";

import { Monitor, Smartphone, Tablet, SlidersHorizontal, Sparkles } from "lucide-react";
import { WallpaperFilterParams } from "../../types/wallpaper";

interface WallpaperFilterProps {
  filters: WallpaperFilterParams;
  onChange: (updated: Partial<WallpaperFilterParams>) => void;
  categories?: { id: string; name: string; slug: string }[];
}

export function WallpaperFilter({ filters, onChange, categories = [] }: WallpaperFilterProps) {
  const devices = [
    { id: "all", label: "All Devices", icon: SlidersHorizontal },
    { id: "desktop", label: "Desktop", icon: Monitor },
    { id: "phone", label: "Phone", icon: Smartphone },
    { id: "tablet", label: "Tablet", icon: Tablet },
  ];

  const orientations = [
    { id: "all", label: "All Layouts" },
    { id: "landscape", label: "Landscape" },
    { id: "portrait", label: "Portrait" },
    { id: "ultrawide", label: "Ultrawide" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        {/* Device Types */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {devices.map((d) => {
            const Icon = d.icon;
            const active = (filters.deviceType || "all") === d.id;
            return (
              <button
                key={d.id}
                onClick={() => onChange({ deviceType: d.id, page: 1 })}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  active
                    ? "bg-accent text-accent-ink"
                    : "bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{d.label}</span>
              </button>
            );
          })}
        </div>

        {/* Orientations & Sort */}
        <div className="flex items-center gap-3">
          {/* Orientation pills */}
          <div className="hidden sm:flex items-center bg-white/5 rounded-full p-1 border border-white/10">
            {orientations.map((o) => {
              const active = (filters.orientation || "all") === o.id;
              return (
                <button
                  key={o.id}
                  onClick={() => onChange({ orientation: o.id, page: 1 })}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    active ? "bg-white/20 text-white font-semibold" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>

          {/* AI Only Toggle */}
          <button
            onClick={() => onChange({ isAI: filters.isAI ? undefined : true, page: 1 })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
              filters.isAI
                ? "bg-accent/10 border-accent text-accent"
                : "border-white/10 text-neutral-400 hover:text-white hover:border-white/20"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Only</span>
          </button>
        </div>
      </div>
    </div>
  );
}

