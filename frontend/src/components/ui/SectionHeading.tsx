import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  align?: "left" | "split";
}

/** Editorial section heading — eyebrow kickers + tight display type (spec H). */
export function SectionHeading({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
  align = "split",
}: SectionHeadingProps) {
  return (
    <div
      className={
        align === "split"
          ? "flex items-end justify-between gap-6 mb-6"
          : "max-w-xl mb-6"
      }
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent mb-2">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-xl sm:text-2xl font-bold text-strong tracking-tight text-balance">
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 text-sm text-muted max-w-xl">{description}</p>
        )}
      </div>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="shrink-0 hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-accent transition"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden />
        </Link>
      )}
    </div>
  );
}
