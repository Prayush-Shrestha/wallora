"use client";

import { Sparkles } from "lucide-react";

interface AIPromptBoxProps {
  prompt: string;
  onChange: (value: string) => void;
}

// Large textarea for the AI image prompt.
export function AIPromptBox({ prompt, onChange }: AIPromptBoxProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor="ai-prompt"
          className="text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-accent" aria-hidden />
          <span>Describe your wallpaper</span>
        </label>
        {prompt && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-faint hover:text-strong transition"
          >
            Clear
          </button>
        )}
      </div>
      <textarea
        id="ai-prompt"
        rows={3}
        value={prompt}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. A realistic mountain landscape at sunrise with a small wooden cabin beside a lake, soft natural lighting, mist in distance, no text or logos..."
        className="w-full rounded-xl bg-base border border-line/10 p-4 text-sm text-strong placeholder:text-faint focus:outline-none focus:border-accent transition-colors resize-none leading-relaxed"
      />
    </div>
  );
}
