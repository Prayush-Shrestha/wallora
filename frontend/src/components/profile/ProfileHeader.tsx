"use client";

import { LogOut } from "lucide-react";
import { User } from "../../types/user";

interface ProfileHeaderProps {
  user: User;
  favoritesCount: number;
  creationsCount: number;
  onLogout: () => void;
}

// Profile top section — avatar, name, stats, sign-out.
export function ProfileHeader({ user, favoritesCount, creationsCount, onLogout }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-8 border-b border-line/10 text-center sm:text-left">
      <div className="flex flex-col sm:flex-row items-center gap-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={user.profileImage || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(user.name)}`}
          alt={user.name}
          className="w-20 h-20 rounded-full object-cover border-2 border-line/20 shadow-lg"
        />
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-strong">{user.name}</h1>
          <p className="text-xs text-muted mt-1">{user.email}</p>
          <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-muted">
            <span>{favoritesCount} Favorites</span>
            <span>•</span>
            <span>{creationsCount} AI Creations</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
