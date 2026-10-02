"use client";

import { Heart, Sparkles } from "lucide-react";

export type ProfileTab = "favorites" | "creations";

interface ProfileTabsProps {
  activeTab: ProfileTab;
  favoritesCount: number;
  creationsCount: number;
  onChange: (tab: ProfileTab) => void;
}

// Saved Favorites / AI Creations tab switcher.
export function ProfileTabs({ activeTab, favoritesCount, creationsCount, onChange }: ProfileTabsProps) {
  return (
    <div className="flex items-center gap-2 border-b border-line/10 mt-6">
      <button
        onClick={() => onChange("favorites")}
        className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition -mb-px ${
          activeTab === "favorites"
            ? "border-accent text-accent"
            : "border-transparent text-muted hover:text-strong"
        }`}
      >
        <Heart className="w-4 h-4" />
        <span>Saved Favorites ({favoritesCount})</span>
      </button>

      <button
        onClick={() => onChange("creations")}
        className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition -mb-px ${
          activeTab === "creations"
            ? "border-accent text-accent"
            : "border-transparent text-muted hover:text-strong"
        }`}
      >
        <Sparkles className="w-4 h-4" />
        <span>AI Studio Creations ({creationsCount})</span>
      </button>
    </div>
  );
}
