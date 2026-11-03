"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/lib/data";
import { contactSchema } from "@/lib/contact-schema";
import { CONTACT_PREFILL_EVENT } from "@/lib/contact-prefill";
import SocialLinks from "@/components/ui/SocialLinks";

type Status = "idle" | "sending" | "sent" | "error";

const inputClass =
  "mt-2 w-full border border-white/30 bg-white/[0.06] px-4 py-3.5 text-base font-normal text-[#efefeb] outline-none transition-[border-color,background-color,box-shadow] placeholder:text-white/55 hover:border-white/50 focus:border-[var(--accent)] focus:bg-white/[0.09] focus:shadow-[0_0_0_1px_var(--accent)]";

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
    <section id="contact" className="on-accent relative overflow-hidden">
      <div className="section-shell section-pad relative">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div>
            <h2 className="display max-w-[9ch] text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
              Bring me the hard part.
            </h2>
            <p className="mt-7 max-w-md text-lg leading-snug">
              Open to senior software engineering roles, full-time or contract:
              full-stack (frontend-heavy), product, and AI-powered work. Remote
              from Lviv, overlapping CET.
            </p>
            <div className="mt-10">
              <SocialLinks />
            </div>
          </div>

          <div className="bg-[#0e0e0e] p-5 text-[#efefeb] sm:p-8 lg:p-10">
            {status === "sent" ? (
              <div className="flex min-h-[25rem] flex-col justify-center">
                <p className="display text-5xl text-[var(--accent)]">Message sent!</p>
                <p className="mt-4 max-w-md text-lg text-white/75">Thanks for reaching out. I’ll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="text-sm font-semibold">
                    Your name
                    <input
                      name="name"
                      placeholder="Your name"
                      maxLength={100}
                      onBlur={(event) => validateField("name", event.target.value)}
                      className={inputClass}
                      aria-invalid={Boolean(fieldErrors.name)}
                    />
                    {fieldErrors.name ? <span className="mt-2 block font-normal text-red-300">{fieldErrors.name}</span> : null}
                  </label>
                  <label className="text-sm font-semibold">
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
                    {fieldErrors.email ? <span className="mt-2 block font-normal text-red-300">{fieldErrors.email}</span> : null}
                  </label>
                </div>

                <label className="block text-sm font-semibold">
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
                  {fieldErrors.message ? <span className="mt-2 block font-normal text-red-300">{fieldErrors.message}</span> : null}
                </label>

                <input name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden className="absolute left-[-9999px] h-0 w-0 opacity-0" />
                {error ? <p className="text-sm text-red-300">{error}</p> : null}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="action-button mt-2 inline-flex w-full items-center justify-center px-8 py-4 text-base font-bold transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {status === "sending" ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
          </div>
        </div>

        <footer className="mt-20 flex flex-col gap-2 border-t-4 border-[#0e0e0e] pt-5 text-base font-semibold sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {profile.name}</p>
          <p>Next.js, TypeScript. Built in Lviv.</p>
        </footer>
      </div>
    </section>
  );
}
