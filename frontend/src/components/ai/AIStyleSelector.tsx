"use client";

interface AIStyleSelectorProps {
  styles: { id: string; label: string }[];
  selected: string;
  onSelect: (id: string) => void;
}

// Chip selector for visual style (photorealistic, anime, cyberpunk...).
export function AIStyleSelector({ styles, selected, onSelect }: AIStyleSelectorProps) {
  return (
    <div>
      <span className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
        Visual Style
      </span>
      <div className="flex flex-wrap gap-1.5">
        {styles.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s.id)}
            aria-pressed={selected === s.id}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
              selected === s.id
                ? "bg-white text-black font-bold shadow-sm"
                : "bg-line/5 text-muted border border-line/10 hover:bg-line/10 hover:text-strong"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
