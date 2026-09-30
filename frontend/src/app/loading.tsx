import { SkeletonGrid } from "../components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-shell px-4 sm:px-6 py-8">
      <SkeletonGrid />
    </div>
  );
}
