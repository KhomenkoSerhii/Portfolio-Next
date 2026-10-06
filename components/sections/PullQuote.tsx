import { pullQuote, recommendations } from "@/lib/data";
import { Reveal } from "@/components/ui/Reveal";

// one strong reference straight after the hero, so it lands before anyone scrolls far
export default function PullQuote() {
  const source = recommendations.find((r) => r.name === pullQuote.author);
  if (!source) return null;

  return (
    <section aria-label="Reference" className="section-shell border-b border-[var(--line)] py-14 sm:py-20">
      <Reveal>
        <figure className="grid gap-6 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent-strong)] lg:pt-3">
            Reference
          </p>
          <div className="min-w-0">
            <blockquote className="max-w-4xl text-xl leading-[1.45] tracking-[-0.01em] text-[var(--muted)] sm:text-2xl lg:text-[1.85rem] lg:leading-[1.35]">
              <span aria-hidden className="mr-1 text-[var(--accent-strong)]">
                &ldquo;
              </span>
              {pullQuote.lead} <span className="text-[var(--foreground)]">{pullQuote.punch}</span>
            </blockquote>
            <figcaption className="mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 font-mono text-[10px] uppercase tracking-[0.16em]">
              <span>
                <span className="text-[var(--foreground)]">{source.name}</span>
                <span className="text-[var(--muted)]"> · {source.role}</span>
              </span>
              <a href="#reviews" className="text-link transition-colors hover:text-[var(--accent-strong)]">
                Read all references ↓
              </a>
            </figcaption>
          </div>
        </figure>
      </Reveal>
    </section>
  );
}
