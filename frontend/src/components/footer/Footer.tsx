import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line/10 bg-base py-12">
      <div className="mx-auto max-w-shell px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <Link href="/" className="font-display font-black text-xl tracking-tight text-strong">
              WALLORA<span className="text-accent">.</span>
            </Link>
            <p className="mt-1 text-xs text-muted">
              Curated 4K, Desktop, Phone and AI-generated wallpapers for every screen.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-muted">
            <Link href="/explore" className="hover:text-strong transition">Explore</Link>
            <Link href="/ai-studio" className="hover:text-strong transition">AI Studio</Link>
            <Link href="/favorites" className="hover:text-strong transition">Favorites</Link>
            <Link href="/login" className="hover:text-strong transition">Account</Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-line/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-faint">
          <p>© {new Date().getFullYear()} Wallora. Full-Stack Wallpaper Platform.</p>
          <p>Educational Architecture: Independent Frontend &amp; Backend</p>
        </div>
      </div>
    </footer>
  );
}
