import { CountUp } from "@/components/fx/CountUp";

const metrics = [
  { to: 7, suffix: "+", label: "years shipping" },
  { to: 100, suffix: "K+", label: "users served" },
  { to: 100, suffix: "+", label: "companies on the platform" },
  { text: "0 to 1", label: "Calyptus frontend, from zero" },
] as const;

// the numbers that used to sit in the hero, counting up as they come into view
export default function Metrics() {
  return (
    <section aria-label="In numbers" className="section-shell">
      <div className="-mx-4 grid grid-cols-2 sm:mx-0 lg:grid-cols-[1fr_1.45fr_1fr_1.25fr]">
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            className={`min-w-0 border-t-4 px-4 pb-6 pt-5 lg:px-5 ${
              index === 0 ? "accent-fill border-[var(--accent)]" : "border-[var(--foreground)]"
            }`}
          >
            <p className={`metric-value display ${"text" in metric ? "metric-value-small" : ""}`}>
              {"text" in metric ? metric.text : <CountUp to={metric.to} suffix={metric.suffix} />}
            </p>
            <p className="mt-2 text-base font-semibold">{metric.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
