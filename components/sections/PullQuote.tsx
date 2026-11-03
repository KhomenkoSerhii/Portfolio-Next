import { pullQuote, recommendations } from "@/lib/data";
import { Reveal } from "@/components/ui/Reveal";

// one strong reference straight after the hero, so it lands before anyone scrolls far
export default function PullQuote() {
  const source = recommendations.find((r) => r.name === pullQuote.author);
  if (!source) return null;

  return (
    <section aria-label="Reference" className="on-accent">
      <div className="section-shell py-14 sm:py-20">
        <Reveal>
          <figure className="min-w-0">
            <blockquote className="max-w-5xl text-3xl font-medium leading-[1.12] tracking-[-0.025em] sm:text-4xl lg:text-[3.4rem]">
              {pullQuote.lead} <span className="display font-extrabold">{pullQuote.punch}</span>
            </blockquote>
            <figcaption className="mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 text-base font-semibold">
              <span>
                {source.name}, {source.role}
              </span>
              <a href="#reviews" className="text-link">
                Read all references
              </a>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
