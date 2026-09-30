"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Sparkles, Heart, User } from "lucide-react";

const ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/ai-studio", label: "AI", icon: Sparkles },
  { href: "/favorites", label: "Saved", icon: Heart },
  { href: "/profile", label: "Profile", icon: User },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Bottom navigation" className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-[#111]/97 backdrop-blur border-t border-white/10 light:bg-[#FAF9F6]/97 light:border-black/10" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="grid grid-cols-5">
        {ITEMS.map((it) => {
          const active = it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center gap-1 py-2.5 min-h-[60px] justify-center ${
                active ? "text-accent" : "text-neutral-400 light:text-neutral-500"
              } ${it.href === "/ai-studio" && !active ? "text-neutral-200 light:text-neutral-700" : ""}`}
            >
              <span className={`flex items-center justify-center h-7 w-12 rounded-full ${active ? "bg-accent/15" : ""} ${it.href === "/ai-studio" && !active ? "bg-white/10 light:bg-black/5" : ""}`}>
                <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
              </span>
              <span className="text-[11px] font-medium leading-none">{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
