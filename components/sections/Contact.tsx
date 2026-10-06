"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/lib/data";
import { contactSchema } from "@/lib/contact-schema";
import { CONTACT_PREFILL_EVENT } from "@/lib/contact-prefill";
import SocialLinks from "@/components/ui/SocialLinks";

type Status = "idle" | "sending" | "sent" | "error";

const inputClass =
  "mt-2 w-full border border-white/20 bg-white/[0.045] px-4 py-3.5 text-base text-[#f4f7ed] outline-none transition-[border-color,background-color,box-shadow] placeholder:text-white/35 hover:border-white/35 focus:border-[#c9f43d] focus:bg-white/[0.075] focus:shadow-[0_0_0_1px_#c9f43d]";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    function onPrefill(event: Event) {
      const topic = (event as CustomEvent<string>).detail;
      if (!topic) return;
      setStatus("idle");
      setMessage(`I'd like to discuss: ${topic}\n\n`);
      requestAnimationFrame(() => {
        const textarea = messageRef.current;
        if (!textarea) return;
        textarea.focus({ preventScroll: true });
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
      });
    }

    window.addEventListener(CONTACT_PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(CONTACT_PREFILL_EVENT, onPrefill);
  }, []);

  function validateField(field: "name" | "email" | "message", value: string) {
    const result = contactSchema.shape[field].safeParse(value);
    setFieldErrors((previous) => {
      const next = { ...previous };
      if (result.success) delete next[field];
      else next[field] = result.error.issues[0]?.message ?? "Invalid value";
      return next;
    });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""),
    };
    const parsed = contactSchema.safeParse(data);

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setError(null);
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? "Failed to send");
      }
      setStatus("sent");
      form.reset();
      setMessage("");
    } catch (submitError) {
      setStatus("error");
      setError(submitError instanceof Error ? submitError.message : "Failed to send");
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden border-t border-[var(--line-strong)] bg-[var(--accent)] text-[#11150d]">
      <div className="pointer-events-none absolute -right-12 -top-24 font-display text-[22rem] font-extrabold leading-none text-black/[0.045]" aria-hidden>
        @
      </div>

      <div className="section-shell section-pad relative">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-black/55">
              06 / CONTACT
            </p>
            <h2 className="mt-5 max-w-[8ch] font-display text-4xl font-extrabold uppercase leading-[0.9] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
              Bring me the hard part.
            </h2>
            <p className="mt-8 max-w-md text-base leading-relaxed text-black/65">
              Open to senior software engineering roles, full-time or contract:
              full-stack (frontend-heavy), product, and AI-powered work. Remote
              from Lviv, overlapping CET.
            </p>
            <div className="mt-10">
              <SocialLinks />
            </div>
          </div>

          <div className="border border-black/35 bg-[#11150d] p-5 text-[#f4f7ed] shadow-[14px_14px_0_rgba(17,21,13,0.14)] sm:p-8 lg:p-10">
            {status === "sent" ? (
              <div className="flex min-h-[25rem] flex-col justify-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#c9f43d]">Transmission received</p>
                <p className="mt-5 font-display text-5xl font-extrabold uppercase tracking-[-0.05em]">Message sent!</p>
                <p className="mt-4 max-w-md text-white/65">Thanks for reaching out. I’ll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/55">
                    Contact form / 01
                  </p>
                  <span className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.16em] text-[#c9f43d]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#c9f43d]" /> Ready
                  </span>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/65">
                    Your name
                    <input
                      name="name"
                      placeholder="Your name"
                      maxLength={100}
                      onBlur={(event) => validateField("name", event.target.value)}
                      className={inputClass}
                      aria-invalid={Boolean(fieldErrors.name)}
                    />
                    {fieldErrors.name ? <span className="mt-2 block normal-case tracking-normal text-red-300">{fieldErrors.name}</span> : null}
                  </label>
                  <label className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/65">
                    Your email
                    <input
                      name="email"
                      type="email"
                      placeholder="Your email"
                      maxLength={200}
                      onBlur={(event) => validateField("email", event.target.value)}
                      className={inputClass}
                      aria-invalid={Boolean(fieldErrors.email)}
                    />
                    {fieldErrors.email ? <span className="mt-2 block normal-case tracking-normal text-red-300">{fieldErrors.email}</span> : null}
                  </label>
                </div>

                <label className="block font-mono text-[9px] uppercase tracking-[0.18em] text-white/65">
                  Context
                  <textarea
                    ref={messageRef}
                    name="message"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onBlur={(event) => validateField("message", event.target.value)}
                    placeholder="Tell me about your project or role…"
                    rows={6}
                    maxLength={5000}
                    className={`${inputClass} min-h-40 resize-y`}
                    aria-invalid={Boolean(fieldErrors.message)}
                  />
                  {fieldErrors.message ? <span className="mt-2 block normal-case tracking-normal text-red-300">{fieldErrors.message}</span> : null}
                </label>

                <input name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden className="absolute left-[-9999px] h-0 w-0 opacity-0" />
                {error ? <p className="text-sm text-red-300">{error}</p> : null}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="action-button mt-2 inline-flex w-full items-center justify-between px-6 py-4 font-mono text-xs uppercase tracking-[0.17em] transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-60"
                >
                  {status === "sending" ? "Sending…" : "Send message"}
                  <span>↗</span>
                </button>
              </form>
            )}
          </div>
        </div>

        <footer className="mt-20 flex flex-col gap-3 border-t border-black/20 pt-6 font-mono text-[9px] uppercase tracking-[0.16em] text-black/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {profile.name}</p>
          <p>Next.js · TypeScript · Built in Lviv</p>
        </footer>
      </div>
    </section>
  );
}
