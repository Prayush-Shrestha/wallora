import Image from "next/image";
import { Wallpaper } from "../../types/wallpaper";

interface WallpaperPreviewProps {
  wallpaper: Wallpaper;
}

// Large wallpaper preview — keeps portrait pieces narrow, landscape wide.
export function WallpaperPreview({ wallpaper }: WallpaperPreviewProps) {
  const isPortrait = wallpaper.orientation === "portrait";

  return (
    <div className="flex justify-center">
      <div
        className={`relative rounded-3xl overflow-hidden border border-line/10 bg-raised w-full ${
          isPortrait ? "max-w-md aspect-[9/16]" : "aspect-[16/10]"
        }`}
      >
        <Image
          src={wallpaper.imageUrl}
          alt={wallpaper.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-contain"
        />
      </div>
    </div>
  );
}
