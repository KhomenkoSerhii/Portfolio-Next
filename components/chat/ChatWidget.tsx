"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What is Serhii's experience with AI/LLM features?",
  "What do his colleagues say about him?",
  "I heard there are secrets on this page…",
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
          "I'm getting a lot of questions right now – give me a minute and try again."
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
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label={open ? "Close chat" : "Ask AI about Serhii"}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white"
      >
        {/* expanding pulse rings (hidden while open) */}
        {!open && (
          <>
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 [animation:pulse-ring_2.4s_ease-out_infinite]" />
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 [animation:pulse-ring_2.4s_ease-out_1.2s_infinite]" />
          </>
        )}
        {/* soft glow */}
        <span className="absolute inset-0 rounded-full bg-[linear-gradient(120deg,#a855f7,#61dafb)] opacity-60 blur-lg" />
        {/* animated gradient face: violet -> React cyan -> emerald */}
        <span className="absolute inset-0 rounded-full bg-[linear-gradient(120deg,#a855f7,#7c6cf6,#61dafb,#34d399,#a855f7)] bg-[length:300%_300%] [animation:gradient-shift_5s_ease_infinite]" />
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
        {/* AI sparkle badge */}
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 text-cyan-200 [animation:sparkle-twinkle_1.8s_ease-in-out_infinite]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4L12 2z" />
            </svg>
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
            className="fixed bottom-24 right-6 z-50 flex h-[min(34rem,calc(100svh-8rem))] w-[min(24rem,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white/95 shadow-2xl backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95"
          >
            {/* header */}
            <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
              <p className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-300 bg-clip-text font-semibold text-transparent">
                Ask AI about Serhii
              </p>
            </div>

            {/* messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.length === 0 && (
                <div className="space-y-2">
                  <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
                    Hi! I can answer questions about Serhii&apos;s experience,
                    skills, and projects. Try one of these:
                  </p>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-sm text-zinc-600 transition hover:border-emerald-500/40 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:text-white"
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
                      ? "ml-8 rounded-2xl rounded-br-sm bg-emerald-500/15 px-4 py-2.5 text-sm text-emerald-900 dark:text-emerald-50"
                      : "mr-8 whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-zinc-100 px-4 py-2.5 text-sm leading-relaxed text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                  }
                >
                  {m.content ||
                    (loading && i === messages.length - 1 ? (
                      <span className="inline-flex gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400 [animation-delay:0ms]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400 [animation-delay:120ms]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400 [animation-delay:240ms]" />
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
              className="flex gap-2 border-t border-zinc-200 p-3 dark:border-zinc-800"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything…"
                maxLength={4000}
                className="flex-1 rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-emerald-500/50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-600"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
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
