interface LoadingProps {
  message?: string;
}

// Simple centered loading indicator for pages and sections.
export function Loading({ message = "Loading..." }: LoadingProps) {
  return (
    <div role="status" aria-label={message} className="flex flex-col items-center justify-center py-16 gap-3">
      <div
        aria-hidden
        className="w-8 h-8 rounded-full border-2 border-line/15 border-t-accent animate-spin"
      />
      <p className="text-sm text-muted">{message}</p>
    </div>
  );
}
