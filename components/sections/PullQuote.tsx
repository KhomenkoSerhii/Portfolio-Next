import { pullQuote, recommendations } from "@/lib/data";
import { ScrollWords } from "@/components/fx/ScrollWords";
import Swarm from "@/components/visuals/Swarm";

// one strong reference straight after the hero; its words light up as you scroll through it
export default function PullQuote() {
  const source = recommendations.find((r) => r.name === pullQuote.author);
  if (!source) return null;

  return (
    <section aria-label="Reference" className="on-accent relative">
      <ScrollWords
        text={pullQuote.lead}
        punch={pullQuote.punch}
        background={<Swarm figure="quotes" />}
        footer={
          <div className="section-shell mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 text-base font-semibold">
            <span>
              {source.name}, {source.role}
            </span>
            <a href="#reviews" className="text-link">
              Read all references
            </a>
          </div>
        }
      />
    </section>
  );
}
