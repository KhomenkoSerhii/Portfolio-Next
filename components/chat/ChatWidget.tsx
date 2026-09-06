"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What is Serhii's experience with AI/LLM features?",
  "What do his colleagues say about him?",
  "Which roles would be the best fit for Serhii?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    setError(null);
    setInput("");
    const history: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (res.status === 429) {
        throw new Error(
          "I'm getting a lot of questions right now - give me a minute and try again."
        );
      }
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const current = acc;
        setMessages([...history, { role: "assistant", content: current }]);
      }
    } catch (err) {
      setError(
        err instanceof Error && err.message.startsWith("I'm getting")
          ? err.message
          : "Something went wrong. Please try again."
      );
      setMessages(history);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* floating toggle button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        aria-label={open ? "Close chat" : "Ask AI about Serhii"}
        className="action-button fixed bottom-5 right-5 z-50 flex h-13 w-13 items-center justify-center shadow-[6px_6px_0_rgba(0,0,0,0.22)] sm:bottom-6 sm:right-6"
      >
        <span className="relative">
          {open ? (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <path d="M9.5 9.5h.01M14.5 9.5h.01" strokeWidth="2.5" />
            </svg>
          )}
        </span>
        {!open && (
          <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center bg-[#c9f43d] font-mono text-[7px] font-bold text-[#121510]">
            AI
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="fixed bottom-22 right-5 z-50 flex h-[min(34rem,calc(100svh-7rem))] w-[min(25rem,calc(100vw-2.5rem))] flex-col overflow-hidden border border-[var(--line-strong)] bg-[var(--background)]/96 shadow-2xl backdrop-blur-xl sm:bottom-24 sm:right-6"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-[var(--line-strong)] px-5 py-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--foreground)]">
                Portfolio intelligence
              </p>
              <span className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.16em] text-[var(--muted)]"><span className="pulse-dot h-1.5 w-1.5 bg-[var(--accent)]" />Online</span>
            </div>

            {/* messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.length === 0 && (
                <div className="space-y-2">
                  <p className="mb-4 text-sm leading-relaxed text-[var(--muted)]">
                    Hi! I can answer questions about Serhii&apos;s experience,
                    skills, and projects. Try one of these:
                  </p>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="block w-full border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-left text-sm text-[var(--muted)] transition hover:border-[var(--accent-strong)] hover:text-[var(--foreground)]"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.role === "user"
                      ? "ml-8 border border-[var(--accent-strong)] bg-[var(--accent-soft)] px-4 py-2.5 text-sm"
                      : "mr-8 whitespace-pre-wrap border border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 text-sm leading-relaxed"
                  }
                >
                  {m.content ||
                    (loading && i === messages.length - 1 ? (
                      <span className="inline-flex gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce bg-[var(--accent)] [animation-delay:0ms]" />
                        <span className="h-1.5 w-1.5 animate-bounce bg-[var(--accent)] [animation-delay:120ms]" />
                        <span className="h-1.5 w-1.5 animate-bounce bg-[var(--accent)] [animation-delay:240ms]" />
                      </span>
                    ) : null)}
                </div>
              ))}
              {error && <p className="text-xs text-red-400">{error}</p>}
            </div>

            {/* input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex gap-2 border-t border-[var(--line-strong)] p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything…"
                maxLength={4000}
                className="min-w-0 flex-1 border border-[var(--line-strong)] bg-transparent px-3.5 py-2.5 text-sm outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent-strong)]"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="action-button px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
