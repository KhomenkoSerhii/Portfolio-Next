"use client";

import { useState } from "react";
import { profile } from "@/lib/data";
import { contactSchema } from "@/lib/contact-schema";
import { Reveal } from "@/components/ui/Reveal";
import Magnetic from "@/components/ui/Magnetic";

type Status = "idle" | "sending" | "sent" | "error";

const inputCls =
  "w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-emerald-500/60 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-white dark:placeholder-zinc-600";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
      website: String(fd.get("website") ?? ""),
    };

    // client-side validation with the same zod schema the server uses
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!errs[key]) errs[key] = issue.message;
      }
      setFieldErrors(errs);
      return;
    }

    setFieldErrors({});
    setError(null);
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Failed to send");
      }
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to send");
    }
  }

  return (
    <section id="contact" className="relative mx-auto max-w-5xl px-6 pb-20 pt-28">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[min(50rem,95vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-600/10 blur-[100px]"
      />
      <Reveal className="relative">
        <div className="text-center">
          <p className="font-mono text-sm tracking-widest text-emerald-400">
            WHAT&apos;S NEXT?
          </p>
          <h2 className="mt-4 font-display text-4xl font-extrabold uppercase tracking-tight sm:text-6xl">
            Let&apos;s build
            <br />
            something
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-zinc-600 dark:text-zinc-300">
            Open to interesting frontend and AI-product challenges. Drop a
            message below or ping me on Telegram.
          </p>
        </div>

        {status === "sent" ? (
          <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
            <p className="font-display text-2xl font-bold text-emerald-600 dark:text-emerald-300">
              Message sent!
            </p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Thanks for reaching out – I&apos;ll get back to you soon.
            </p>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            noValidate
            className="mx-auto mt-12 max-w-xl space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <input
                  name="name"
                  placeholder="Your name"
                  maxLength={100}
                  className={inputCls}
                  aria-invalid={!!fieldErrors.name}
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-xs text-red-400">{fieldErrors.name}</p>
                )}
              </div>
              <div>
                <input
                  name="email"
                  type="email"
                  placeholder="Your email"
                  maxLength={200}
                  className={inputCls}
                  aria-invalid={!!fieldErrors.email}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
                )}
              </div>
            </div>
            <div>
              <textarea
                name="message"
                placeholder="Tell me about your project or role…"
                rows={5}
                maxLength={5000}
                className={`${inputCls} resize-y`}
                aria-invalid={!!fieldErrors.message}
              />
              {fieldErrors.message && (
                <p className="mt-1 text-xs text-red-400">{fieldErrors.message}</p>
              )}
            </div>
            {/* honeypot – hidden from humans, tempting for bots */}
            <input
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Magnetic>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-block rounded-full bg-emerald-500 px-8 py-3.5 font-semibold text-emerald-950 transition hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {status === "sending" ? "Sending…" : "Send message"}
                </button>
              </Magnetic>
              <Magnetic>
                <a
                  href={profile.links.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block rounded-full border border-zinc-300 px-8 py-3.5 font-medium text-zinc-600 transition hover:border-emerald-500 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-emerald-400 dark:hover:text-white"
                >
                  Telegram
                </a>
              </Magnetic>
            </div>
          </form>
        )}

        <footer className="mt-24 space-y-2 border-t border-zinc-200 pt-8 text-center font-mono text-xs text-zinc-500 dark:border-zinc-900 dark:text-zinc-600">
          <p>
            © {new Date().getFullYear()} {profile.name} · Built with Next.js,
            Framer Motion & React Three Fiber
          </p>
          <p className="text-zinc-400 dark:text-zinc-700">
            PS: three secrets are hidden on this page. one of them is older
            than the web itself.
          </p>
        </footer>
      </Reveal>
    </section>
  );
}
