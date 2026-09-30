import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 light:border-black/10 mt-16 pb-24 lg:pb-8 bg-[#0A0A0A] light:bg-[#F1EFE9]">
      <div className="mx-auto max-w-shell px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display font-extrabold tracking-tight text-white light:text-neutral-900 text-[18px]">WALLORA<span className="text-accent">.</span></p>
          <p className="text-neutral-400 light:text-neutral-600 text-[14px] mt-3 max-w-xs leading-relaxed">
            Wallpapers for every mood, screen and style. Curated daily, generated when you imagine more.
          </p>
          <div className="flex gap-2 mt-5">
            {["iOS", "Android", "macOS", "Windows"].map((p) => (
              <span key={p} className="text-[12px] border border-white/15 light:border-black/15 rounded-full px-3 py-1.5 text-neutral-400 light:text-neutral-600">{p}</span>
            ))}
          </div>
        </div>
        <nav aria-label="Browse">
          <p className="text-[12px] uppercase tracking-[0.14em] text-neutral-500 font-semibold">Browse</p>
          <ul className="mt-3 space-y-2.5 text-[14px]">
            {[["Explore","/explore"],["Categories","/categories"],["Collections","/collections"],["AI Studio","/ai-studio"],["Upload","/upload"]].map(([l,h]) => (
              <li key={h}><Link href={h} className="text-neutral-300 light:text-neutral-700 hover:text-white light:hover:text-black">{l}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Popular">
          <p className="text-[12px] uppercase tracking-[0.14em] text-neutral-500 font-semibold">Popular</p>
          <ul className="mt-3 space-y-2.5 text-[14px]">
            {[["Anime","/category/anime"],["Dark","/category/dark"],["Minimal","/category/minimal"],["Space","/category/space"],["Cars","/category/cars"]].map(([l,h]) => (
              <li key={h}><Link href={h} className="text-neutral-300 light:text-neutral-700 hover:text-white light:hover:text-black">{l}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Account">
          <p className="text-[12px] uppercase tracking-[0.14em] text-neutral-500 font-semibold">Account</p>
          <ul className="mt-3 space-y-2.5 text-[14px]">
            {[["Favorites","/favorites"],["Profile","/profile"],["Login","/login"],["Register","/register"]].map(([l,h]) => (
              <li key={h}><Link href={h} className="text-neutral-300 light:text-neutral-700 hover:text-white light:hover:text-black">{l}</Link></li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mx-auto max-w-shell px-4 sm:px-6 pt-6 border-t border-white/10 light:border-black/10 flex flex-col sm:flex-row gap-2 justify-between text-[12.5px] text-neutral-500">
        <p>© 2026 Wallora. All wallpapers by their artists.</p>
        <p>Dark by default — light mode respects your eyes too.</p>
      </div>
    </footer>
  );
}
