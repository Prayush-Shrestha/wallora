"use client";

import { Monitor, Smartphone, Tablet, Square } from "lucide-react";

export type AIOrientation = "landscape" | "portrait" | "square" | "ultrawide" | "tablet";
export type AIResolution = "standard" | "4k";

interface AIResolutionSelectorProps {
  orientation: AIOrientation;
  onOrientationChange: (value: AIOrientation) => void;
  resolution: AIResolution;
  onResolutionChange: (value: AIResolution) => void;
}

// Device/aspect + quality selector for AI Studio.
export function AIResolutionSelector({
  orientation,
  onOrientationChange,
  resolution,
  onResolutionChange,
}: AIResolutionSelectorProps) {
  const devices: { id: AIOrientation; label: string; ratio: string; Icon: typeof Monitor }[] = [
    { id: "landscape", label: "Desktop", ratio: "16:9", Icon: Monitor },
    { id: "portrait", label: "Mobile", ratio: "9:16", Icon: Smartphone },
    { id: "tablet", label: "Tablet", ratio: "3:4", Icon: Tablet },
    { id: "ultrawide", label: "Ultrawide", ratio: "21:9", Icon: Monitor },
    { id: "square", label: "Square", ratio: "1:1", Icon: Square },
  ];

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <span className="block text-xs font-semibold text-muted uppercase tracking-wider">
          Target Device &amp; Aspect Ratio
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {devices.map(({ id, label, ratio, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onOrientationChange(id)}
              aria-pressed={orientation === id}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition ${
                orientation === id
                  ? "border-accent bg-accent/10 text-accent font-semibold"
                  : "border-line/10 bg-line/5 text-muted hover:text-strong"
              } ${id === "square" ? "col-span-2 sm:col-span-1" : ""}`}
            >
              <Icon className="w-4 h-4 mb-1" aria-hidden />
              <span>{label}</span>
              <span className="text-[10px] text-faint">{ratio}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onResolutionChange("standard")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
            resolution === "standard"
              ? "bg-line/20 border-line/30 text-strong"
              : "border-line/10 text-faint hover:text-muted"
          }`}
        >
          FHD (1080p)
        </button>
        <button
          type="button"
          onClick={() => onResolutionChange("4k")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
            resolution === "4k"
              ? "bg-accent/10 border-accent/30 text-accent font-bold"
              : "border-line/10 text-faint hover:text-muted"
          }`}
        >
          Ultra HD (4K)
        </button>
      </div>
    </div>
  );
}
