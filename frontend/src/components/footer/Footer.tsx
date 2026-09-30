import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink-950 py-12 mt-20">
      <div className="mx-auto max-w-shell px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <Link href="/" className="font-display font-black text-xl tracking-tight text-white">
              WALLORA<span className="text-accent">.</span>
            </Link>
            <p className="mt-1 text-xs text-neutral-400">
              Curated 4K, Desktop, Phone and AI-generated wallpapers for every screen.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-400">
            <Link href="/explore" className="hover:text-white transition">Explore</Link>
            <Link href="/ai-studio" className="hover:text-white transition">AI Studio</Link>
            <Link href="/favorites" className="hover:text-white transition">Favorites</Link>
            <Link href="/login" className="hover:text-white transition">Account</Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Wallora. Full-Stack Wallpaper Platform.</p>
          <p>Educational Architecture: Independent Frontend &amp; Backend</p>
        </div>
      </div>
    </footer>
  );
}

