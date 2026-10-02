"use client";

interface AIPromptSuggestionsProps {
  suggestions: string[];
  onSelect: (prompt: string) => void;
}

// "Try:" sample prompt chips.
export function AIPromptSuggestions({ suggestions, onSelect }: AIPromptSuggestionsProps) {
  return (
    <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      <span className="text-[11px] text-faint shrink-0">Try:</span>
      {suggestions.map((sample, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(sample)}
          className="text-[11px] px-2.5 py-1 rounded-full bg-line/5 hover:bg-line/10 text-muted hover:text-strong border border-line/5 whitespace-nowrap transition"
        >
          {sample.slice(0, 32)}...
        </button>
      ))}
    </div>
  );
}
