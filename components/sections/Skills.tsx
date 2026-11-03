"use client";

import { Reveal } from "@/components/ui/Reveal";

const capabilities = [
  {
    title: "Frontend architecture",
    copy: "Component systems, state boundaries, API contracts, and maintainable foundations for products that keep changing.",
    tools: "React, TypeScript, Next.js, Redux Toolkit, TanStack Query",
  },
  {
    title: "Backend & APIs",
    copy: "Node.js REST APIs, business logic, MongoDB data integrations, payments, and third-party services, deployed to AWS through CI/CD.",
    tools: "Node.js, REST, MongoDB, GraphQL, Stripe, AWS, CI/CD",
  },
  {
    title: "AI product UX",
    copy: "LLM-powered matching, search, and parsing wired to OpenAI APIs, with streaming responses, progress and failure states that make uncertain output dependable.",
    tools: "OpenAI API, Streaming UX, Prompt design, Claude Code",
  },
  {
    title: "Real-time & performance",
    copy: "Socket.IO flows with reconnection handling, plus bundle strategy, lazy loading, and measurement-led optimisation tied to business outcomes.",
    tools: "Socket.IO, Vite, Webpack, Sentry, Testing Library",
  },
] as const;

const stack = [
  "React",
  "TypeScript",
  "Next.js",
  "Node.js",
  "REST / GraphQL",
  "MongoDB",
  "Socket.IO",
  "AI / LLM",
  "Stripe",
  "AWS / CI-CD",
];

export default function Skills() {
  return (
    <section id="capabilities" className="on-ink">
      <div className="section-shell section-pad">
        <Reveal>
          <div className="section-heading">
            <h2>
              Interface, API, and data. <span className="text-[var(--accent)]">End to end.</span>
            </h2>
            <p className="max-w-md text-lg leading-snug text-white/75">
              Frontend is where I go deepest. Owning the API and data work
              behind it is what lets me ship whole features, not just screens.
            </p>
          </div>
        </Reveal>

        <div>
          {capabilities.map((capability, index) => (
            <Reveal key={capability.title} delay={index * 0.05}>
              <article
                className={`capability-cell grid min-w-0 items-start gap-5 border-b border-white/20 py-7 lg:grid-cols-2 lg:gap-12 lg:py-9 ${
                  index % 2 ? "lg:[&>h3]:order-2" : ""
                }`}
              >
                <h3
                  className={`display [overflow-wrap:anywhere] text-[clamp(1.9rem,4.7vw,4.25rem)] leading-[0.98] ${
                    index % 2 ? "" : "text-[var(--accent)]"
                  }`}
                >
                  {capability.title}
                </h3>
                <div className="relative z-10 min-w-0">
                  <p className="break-words text-lg leading-snug">{capability.copy}</p>
                  <p className="mt-3 break-words text-base text-white/70">{capability.tools}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 sm:mt-20">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold">Core stack index</h3>
              <p className="mt-1 max-w-xl text-base leading-snug text-white/70">
                The tools I use in production, kept still so the list is easy
                to scan instead of chasing it across the screen.
              </p>
            </div>
            <p className="text-base text-white/70">10 production tools, 2026</p>
          </div>

          <ul className="mt-6 flex flex-wrap gap-2">
            {stack.map((item) => (
              <li
                key={item}
                className="display border-2 border-white/25 px-3 py-2 text-lg leading-none transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-ink)] sm:px-4 sm:py-3 sm:text-2xl"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
