"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Settings, Grid3X3, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { WALLPAPERS } from "@/lib/data";
import { WallpaperMasonry } from "@/components/WallpaperCard";
import { useStore } from "@/components/StoreProvider";

const TABS = ["Saved", "Created", "Uploads"] as const;

export default function ProfilePage() {
  const { data: session } = useSession();
  const { favorites, creations, uploads } = useStore();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Saved");

  const saved = WALLPAPERS.filter((w) => favorites.includes(w.id));
  const displayName = session?.user?.name || session?.user?.email?.split("@")[0] || "Explorer";
  const userAvatar = session?.user?.image || "https://picsum.photos/seed/wallora-avatar/160/160";

  return (
    <div className="mx-auto max-w-[1320px] px-4 sm:px-6 py-8">
      <div className="flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={userAvatar}
          alt={displayName}
          className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover border border-white/10 light:border-black/10"
        />
        <div className="flex-1">
          <h1 className="font-display text-[24px] sm:text-[28px] font-bold tracking-tight">
            {displayName}
          </h1>
          <p className="text-[13.5px] text-neutral-500">
            {session?.user?.email && <span className="mr-2 text-neutral-400">{session.user.email} ·</span>}
            {saved.length} saved · {creations.length} AI creations · {uploads.length} uploads
          </p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          title="Sign out"
          aria-label="Sign out"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs font-semibold transition"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>

      <div className="mt-6 flex gap-1 border-b border-white/10 light:border-black/10" role="tablist" aria-label="Profile sections">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-[14px] font-semibold border-b-2 -mb-px min-h-[48px] ${tab === t ? "border-accent" : "border-transparent text-neutral-500"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "Saved" && (
          saved.length === 0 ? (
            <Empty title="Nothing saved yet" body="Tap the heart on any wallpaper to keep it here." action="Explore wallpapers" href="/explore" />
          ) : <WallpaperMasonry items={saved} />
        )}
        {tab === "Created" && (
          creations.length === 0 ? (
            <Empty title="No AI creations yet" body="Describe an idea in AI Studio and it will live here." action="Open AI Studio" href="/ai-studio" />
          ) : (
            <div className="masonry columns-2 md:columns-3 xl:columns-4">
              {creations.map((c) => (
                <div key={c.id} className="relative overflow-hidden rounded-[10px] border border-white/[0.07] light:border-black/10" style={{ aspectRatio: c.options.orientation === "portrait" ? "9/14" : "16/10" }}>
                  <Image src={c.image} alt={c.prompt} fill sizes="300px" className="object-cover" loading="lazy" />
                  <p className="absolute bottom-2 inset-x-2 bg-black/60 backdrop-blur rounded-lg px-2.5 py-1.5 text-white text-[11.5px] truncate">“{c.prompt}”</p>
                </div>
              ))}
            </div>
          )
        )}
        {tab === "Uploads" && (
          uploads.length === 0 ? (
            <Empty title="No uploads yet" body="Share your own photography and art with Wallora." action="Upload a wallpaper" href="/upload" />
          ) : (
            <div className="masonry columns-2 md:columns-3 xl:columns-4">
              {uploads.map((u) => (
                <div key={u.id} className="relative overflow-hidden rounded-[10px] border border-white/[0.07] light:border-black/10 aspect-[4/3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={u.image} alt={u.title} className="h-full w-full object-cover" loading="lazy" />
                  <p className="absolute bottom-2 inset-x-2 bg-black/60 backdrop-blur rounded-lg px-2.5 py-1.5 text-white text-[11.5px] truncate">{u.title}</p>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

function Empty({ title, body, action, href }: { title: string; body: string; action: string; href: string }) {
  return (
    <div className="text-center py-14 border border-dashed border-white/15 light:border-black/15 rounded-2xl">
      <Grid3X3 className="h-6 w-6 mx-auto text-neutral-600" aria-hidden />
      <p className="font-semibold text-[16px] mt-3">{title}</p>
      <p className="text-neutral-500 text-[14px] mt-1">{body}</p>
      <Link href={href} className="mt-4 inline-block rounded-full bg-white text-black light:bg-neutral-900 light:text-white text-[13.5px] font-semibold px-5 py-2.5">{action}</Link>
    </div>
  );
}
