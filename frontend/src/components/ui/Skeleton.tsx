interface SkeletonGridProps {
  count?: number;
  message?: string;
}

/** Shimmer placeholder grid for loading states (spec R/S). */
export function SkeletonGrid({ count = 8, message = "Loading wallpapers..." }: SkeletonGridProps) {
  return (
    <div role="status" aria-label={message} className="space-y-4">
      <span className="sr-only">{message}</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6" aria-hidden>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`rounded-2xl bg-raised border border-line/10 overflow-hidden ${
              i % 3 === 1 ? "aspect-[9/13]" : "aspect-[16/10]"
            }`}
          >
            <div className="h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-line/10 to-transparent bg-[length:800px_100%]" />
          </div>
        ))}
      </div>
    </div>
  );
}
