"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

interface BotAction {
  label: string;
  href: string;
}

interface ChatMessage {
  from: "user" | "bot";
  text: string;
  action?: BotAction;
}

const QUICK_QUESTIONS = [
  "Where are AI wallpapers?",
  "How do I download?",
  "Demo login?",
  "Open Admin Panel",
];

const GREETING: ChatMessage = {
  from: "bot",
  text: "Hi! Have any question? Ask me about exploring, categories, AI Studio, downloads, or your account.",
};

// Simple keyword-based helper — no external API, easy to extend.
function getBotReply(input: string): ChatMessage {
  const q = input.toLowerCase();

  if (q.includes("admin")) {
    return {
      from: "bot",
      text: "The Admin Panel lives at /admin (Overview, Users, Subscriptions, Payments, Plans). Log in with the demo admin account first, then open it.",
      action: { label: "Open Admin Panel", href: "/admin" },
    };
  }
  if (q.includes("ai") || q.includes("generate")) {
    return {
      from: "bot",
      text: "AI Studio turns your text prompt into a 4K wallpaper — pick a style, device size, and hit Generate.",
      action: { label: "Open AI Studio", href: "/ai-studio" },
    };
  }
  if (q.includes("download")) {
    return {
      from: "bot",
      text: "Open any wallpaper (e.g. from Explore), then press “Download Ultra HD Wallpaper”. The file saves straight to your device.",
      action: { label: "Explore wallpapers", href: "/explore" },
    };
  }
  if (q.includes("demo") || q.includes("login") || q.includes("sign in")) {
    return {
      from: "bot",
      text: "Use the demo account — Email: demo@wallora.com, Password: password123. It works even while the database is offline.",
      action: { label: "Go to login", href: "/login" },
    };
  }
  if (q.includes("register") || q.includes("sign up") || q.includes("account")) {
    return {
      from: "bot",
      text: "Create an account in seconds — just a name, email, and password (min 6 characters).",
      action: { label: "Create account", href: "/register" },
    };
  }
  if (q.includes("categor")) {
    return {
      from: "bot",
      text: "We have 14 categories: Nature, Cars, Anime, Gaming, Minimal, Space, Aesthetic, Technology, Men, Women, Kids, Travel, Animals, Architecture.",
      action: { label: "Browse categories", href: "/categories" },
    };
  }
  if (q.includes("collection")) {
    return {
      from: "bot",
      text: "Collections are curated moods like Midnight Drive, Dark Mode, and Future Cities.",
      action: { label: "View collections", href: "/collections" },
    };
  }
  if (q.includes("favor") || q.includes("save")) {
    return {
      from: "bot",
      text: "Tap the heart on any wallpaper to save it. Everything you save lives on your Favorites page (login required).",
      action: { label: "My favorites", href: "/favorites" },
    };
  }
  if (q.includes("upload")) {
    return {
      from: "bot",
      text: "Share your own art from the Upload page — add a title, category, tags, and device type, then Publish.",
      action: { label: "Upload wallpaper", href: "/upload" },
    };
  }
  if (q.includes("profile")) {
    return {
      from: "bot",
      text: "Your Profile shows your avatar, saved favorites, and AI Studio creations.",
      action: { label: "Open profile", href: "/profile" },
    };
  }
  if (q.includes("explore") || q.includes("search") || q.includes("find")) {
    return {
      from: "bot",
      text: "Explore lets you search and filter by category, device, orientation, and sort order.",
      action: { label: "Open explore", href: "/explore" },
    };
  }
  if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
    return { from: "bot", text: "Hello! What would you like to find — wallpapers, categories, AI Studio, or help with your account?" };
  }
  if (q.includes("thank")) {
    return { from: "bot", text: "You're welcome! Enjoy your new wallpaper." };
  }

  return {
    from: "bot",
    text: "I can help with Explore, Categories, Collections, AI Studio, Upload, Favorites, login, and the Admin Panel. What are you looking for?",
  };
}

export function Chatbot() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open ]);

  const send = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    setMessages((prev) => [...prev, { from: "user", text: clean }, getBotReply(clean)]);
    setDraft("");
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          role="dialog"
          aria-label="Wallora assistant chat"
          className="w-[calc(100vw-2rem)] max-w-sm rounded-3xl border border-line/10 bg-raised shadow-2xl overflow-hidden"
        >
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-line/10 bg-base/50">
            <span className="p-1.5 rounded-full bg-accent/10 border border-accent/30">
              <Sparkles className="w-4 h-4 text-accent" aria-hidden />
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold text-strong">Wallora Assistant</p>
              <p className="text-[11px] text-faint">Have any question? Ask me anything.</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="p-2 rounded-full text-muted hover:text-strong hover:bg-line/10 transition"
            >
              <X className="w-4 h-4" aria-hidden />
            </button>
          </div>

          <div ref={listRef} className="h-72 overflow-y-auto px-4 py-3 space-y-3" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    m.from === "user"
                      ? "bg-accent text-accent-ink rounded-br-md"
                      : "bg-line/5 border border-line/10 text-strong rounded-bl-md"
                  }`}
                >
                  <p>{m.text}</p>
                  {m.action && (
                    <button
                      onClick={() => {
                        setOpen(false);
                        router.push(m.action!.href);
                      }}
                      className="mt-2 inline-block text-xs font-bold text-accent hover:underline"
                    >
                      {m.action.label} →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="px-3 pb-2 flex flex-wrap gap-1.5">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-line/5 border border-line/10 text-muted hover:text-strong hover:border-line/25 transition"
              >
                {q}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
            className="flex items-center gap-2 p-3 border-t border-line/10"
          >
            <label htmlFor="chatbot-input" className="sr-only">
              Ask a question
            </label>
            <input
              id="chatbot-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type your question..."
              autoComplete="off"
              className="flex-1 min-w-0 rounded-full bg-base border border-line/10 px-4 py-2 text-sm text-strong placeholder:text-faint focus:outline-none focus:border-accent"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="p-2.5 rounded-full bg-accent text-accent-ink hover:brightness-110 active:scale-95 transition"
            >
              <Send className="w-4 h-4" aria-hidden />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? "Close assistant" : "Open assistant — have any question?"}
        className="group flex items-center gap-2 pl-4 pr-5 py-3 rounded-full bg-accent text-accent-ink font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition"
      >
        {open ? <X className="w-5 h-5" aria-hidden /> : <MessageCircle className="w-5 h-5" aria-hidden />}
        <span>{open ? "Close" : "Have any question?"}</span>
      </button>
    </div>
  );
}
