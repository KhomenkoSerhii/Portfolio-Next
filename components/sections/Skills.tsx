"use client";

import { Reveal } from "@/components/ui/Reveal";
import Swarm from "@/components/visuals/Swarm";
import { Blueprint } from "@/components/motion/Blueprint";
import { DecodeText } from "@/components/motion/DecodeText";
import { DrawnText } from "@/components/motion/DrawnText";

// short on purpose: the detail is in the CV
const capabilities = [
  { title: "Frontend", copy: "React, Next.js, TypeScript. Where I go deepest." },
  { title: "Backend", copy: "Node.js APIs, MongoDB, payments, AWS." },
  { title: "AI", copy: "LLM features people use: matching, parsing, streaming answers." },
] as const;


export default function Skills() {
  return (
    <section
      id="capabilities"
      className="on-ink inset-reveal relative overflow-hidden"
    >
      <Swarm figure="exchange" />
      <div className="section-shell section-pad relative z-10">
        <Blueprint className="section-heading">
          <h2 data-bp-box>
            <DrawnText>
              From the button <span className="text-[var(--accent)]">to the database.</span>
            </DrawnText>
          </h2>
          <p
            className="max-w-md text-lg leading-snug text-white/75"
            data-bp-box
            style={{ "--i": 1 } as React.CSSProperties}
          >
            <DecodeText
              delay={700}
              text="I build the whole feature: the screen, the API behind it and the data."
            />
          </p>
        </Blueprint>

        <div>
          {capabilities.map((capability, index) => (
            <Reveal key={capability.title} delay={index * 0.05}>
              <article
                className={`capability-cell grid min-w-0 items-start gap-5 border-b border-white/20 py-7 lg:grid-cols-2 lg:gap-12 lg:py-9 ${
                  index % 2 ? "lg:[&>h3]:order-2" : ""
                }`}
              >
                <h3
                  className={`cap-title ${index % 2 ? "cap-right" : ""} display [overflow-wrap:anywhere] text-[clamp(1.9rem,4.7vw,4.25rem)] leading-[0.98] ${
                    index % 2 ? "" : "text-[var(--accent)]"
                  }`}
                >
                  {capability.title}
                </h3>
                <p className="relative z-10 min-w-0 break-words text-xl leading-snug lg:self-center">
                  {capability.copy}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
