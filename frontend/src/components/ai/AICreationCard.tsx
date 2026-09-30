import Image from "next/image";
import { Download } from "lucide-react";
import { AIWallpaper } from "../../types/ai";

interface AICreationCardProps {
  creation: AIWallpaper;
}

export function AICreationCard({ creation }: AICreationCardProps) {
  const isPortrait = creation.orientation === "portrait";

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-ink-900 border border-white/10 hover:border-accent/40 transition">
      <div className={`relative w-full ${isPortrait ? "aspect-[9/16]" : "aspect-[16/10]"}`}>
        <Image
          src={creation.imageUrl}
          alt={creation.prompt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-xs text-white line-clamp-2 italic font-medium">“{creation.prompt}”</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] text-accent font-semibold uppercase">{creation.style || "AI Art"}</span>
            <a
              href={creation.imageUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              title="Download image"
            >
              <Download className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

