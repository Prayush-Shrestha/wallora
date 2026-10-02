"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { FadeIn } from "../../components/ui/FadeIn";
import { WallpaperGrid } from "../../components/wallpaper/WallpaperGrid";
import { AICreationCard } from "../../components/ai/AICreationCard";
import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { ProfileTabs, ProfileTab } from "../../components/profile/ProfileTabs";
import { Wallpaper } from "../../types/wallpaper";
import { AIWallpaper } from "../../types/ai";
import * as favoriteService from "../../services/favoriteService";
import * as aiService from "../../services/aiService";

// /profile — header + tabs + saved / created grids.
export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>("favorites");
  const [favorites, setFavorites] = useState<Wallpaper[]>([]);
  const [creations, setCreations] = useState<AIWallpaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    async function loadData() {
      setLoading(true);
      try {
        const [favList, aiList] = await Promise.all([
          favoriteService.fetchFavorites().catch(() => []),
          aiService.fetchUserCreations().catch(() => []),
        ]);
        setFavorites(favList);
        setCreations(aiList);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="mx-auto max-w-shell px-4 sm:px-6 py-8 space-y-10">
      <FadeIn>
        <ProfileHeader
          user={user}
          favoritesCount={favorites.length}
          creationsCount={creations.length}
          onLogout={() => {
            logout();
            router.push("/");
          }}
        />
        <ProfileTabs
          activeTab={activeTab}
          favoritesCount={favorites.length}
          creationsCount={creations.length}
          onChange={setActiveTab}
        />
      </FadeIn>

      {loading ? (
        <div className="text-center py-20 text-faint text-sm">Loading profile data...</div>
      ) : activeTab === "favorites" ? (
        <WallpaperGrid
          wallpapers={favorites}
          favoriteIds={favorites.map((f) => f.id)}
          emptyMessage="You have not saved any wallpapers yet. Browse explore to find art you love!"
        />
      ) : (
        <div>
          {creations.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-line/10 rounded-2xl space-y-3">
              <Sparkles className="w-8 h-8 text-faint mx-auto" />
              <p className="text-muted text-sm">No AI creations generated yet.</p>
              <Link
                href="/ai-studio"
                className="inline-block px-5 py-2 rounded-full bg-accent text-accent-ink text-xs font-bold hover:brightness-110 transition"
              >
                Go to AI Studio
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {creations.map((c) => (
                <AICreationCard key={c.id} creation={c} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
