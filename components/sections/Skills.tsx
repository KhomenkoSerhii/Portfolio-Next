"use client";

import { Reveal } from "@/components/ui/Reveal";

const capabilities = [
  {
    index: "A",
    title: "Frontend architecture",
    copy: "Component systems, state boundaries, API contracts, and maintainable foundations for products that keep changing.",
    tools: "React · TypeScript · Next.js · Redux Toolkit · TanStack Query",
  },
  {
    index: "B",
    title: "Backend & APIs",
    copy: "Node.js REST APIs, business logic, MongoDB data integrations, payments, and third-party services, deployed to AWS through CI/CD.",
    tools: "Node.js · REST · MongoDB · GraphQL · Stripe · AWS · CI/CD",
  },
  {
    index: "C",
    title: "AI product UX",
    copy: "LLM-powered matching, search, and parsing wired to OpenAI APIs, with streaming responses, progress and failure states that make uncertain output dependable.",
    tools: "OpenAI API · Streaming UX · Prompt design · Claude Code",
  },
  {
    index: "D",
    title: "Real-time & performance",
    copy: "Socket.IO flows with reconnection handling, plus bundle strategy, lazy loading, and measurement-led optimisation tied to business outcomes.",
    tools: "Socket.IO · Vite · Webpack · Sentry · Testing Library",
  },
] as const;

const stack = [
  "REACT",
  "TYPESCRIPT",
  "NEXT.JS",
  "NODE.JS",
  "REST / GRAPHQL",
  "MONGODB",
  "SOCKET.IO",
  "AI / LLM",
  "STRIPE",
  "AWS / CI-CD",
];

export default function Skills() {
  return (
    <section id="capabilities" className="content-auto border-y border-[var(--line-strong)] bg-[var(--ink)] text-[var(--paper)]">
      <div className="section-shell section-pad">
        <Reveal>
          <div className="section-heading border-white/15">
            <div>
              <p className="section-index text-lime-300">03 / CAPABILITIES</p>
              <h2>Interface, API, and data. End to end.</h2>
            </div>
            <p className="max-w-md text-base leading-relaxed text-white/55 md:pt-3">
              Frontend is where I go deepest. Owning the API and data work
              behind it is what lets me ship whole features, not just screens.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid border-l border-t border-white/15 md:grid-cols-2 2xl:grid-cols-4">
          {capabilities.map((capability, index) => (
            <Reveal key={capability.title} delay={index * 0.05} className="h-full">
              <article className="capability-cell flex h-full min-h-[16rem] min-w-0 flex-col border-b border-r border-white/15 p-5 sm:min-h-[17rem] sm:p-8 2xl:p-6">
                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-white/40">
                  <span>/{capability.index}</span>
                  <span>0{index + 1}</span>
                </div>
                <h3 className="mt-8 [overflow-wrap:anywhere] font-display text-[clamp(1.35rem,4.8vw,1.9rem)] font-extrabold uppercase leading-[1.02] tracking-[-0.04em] sm:mt-10 sm:text-3xl 2xl:text-[1.4rem]">
                  {capability.title}
                </h3>
                <p className="mt-5 break-words text-sm leading-[1.65] text-white/55 2xl:text-[13px]">
                  {capability.copy}
                </p>
                <p className="mt-auto break-words border-t border-white/15 pt-5 font-mono text-[8px] uppercase leading-relaxed tracking-[0.1em] text-lime-200/75 sm:text-[9px] sm:tracking-[0.13em] 2xl:text-[8px]">
                  {capability.tools}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="section-shell py-8 sm:py-10">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-lime-300">
                Core stack index
              </p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/50">
                The tools I use in production, kept still so the list is easy
                to scan instead of chasing it across the screen.
              </p>
            </div>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">
              10 production tools / 2026
            </p>
          </div>

          <div className="grid grid-cols-2 border-l border-t border-white/15 sm:grid-cols-3 lg:grid-cols-5">
            {stack.map((item, index) => (
              <div
                key={item}
                className="group flex min-h-24 min-w-0 flex-col justify-between border-b border-r border-white/15 p-3 transition-colors hover:bg-white/[0.035] sm:min-h-28 sm:p-4"
              >
                <span className="font-mono text-[8px] tracking-[0.18em] text-white/30">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="break-words font-display text-base font-extrabold uppercase leading-none tracking-[-0.025em] text-white/80 transition-colors group-hover:text-lime-200 sm:text-lg">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
