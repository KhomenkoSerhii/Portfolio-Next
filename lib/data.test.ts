import { describe, it, expect } from "vitest";
import {
  profile,
  experience,
  skillTiers,
  recommendations,
  projects,
  services,
  works,
  pullQuote,
} from "@/lib/data";

describe("profile", () => {
  it("has a name, role, and the three social links", () => {
    expect(profile.name).toBeTruthy();
    expect(profile.role).toBeTruthy();
    expect(profile.links.github).toMatch(/^https?:\/\//);
    expect(profile.links.linkedin).toMatch(/^https?:\/\//);
    expect(profile.links.telegram).toMatch(/^https?:\/\//);
  });
});

describe("experience", () => {
  it("every job has the required fields and non-empty stack/highlights", () => {
    expect(experience.length).toBeGreaterThan(0);
    for (const job of experience) {
      expect(job.company).toBeTruthy();
      expect(job.period).toBeTruthy();
      expect(job.title).toBeTruthy();
      expect(job.stack.length).toBeGreaterThan(0);
      expect(job.highlights.length).toBeGreaterThan(0);
    }
  });
});

describe("skillTiers", () => {
  it("every skill level is within the 0..1 range", () => {
    for (const tier of skillTiers) {
      expect(tier.items.length).toBeGreaterThan(0);
      for (const skill of tier.items) {
        expect(skill.level).toBeGreaterThanOrEqual(0);
        expect(skill.level).toBeLessThanOrEqual(1);
        expect(skill.name).toBeTruthy();
      }
    }
  });

  it("uses only known accent values", () => {
    for (const tier of skillTiers) {
      expect(["default", "ai"]).toContain(tier.accent);
    }
  });
});

describe("recommendations", () => {
  it("each entry has name, role, relation, and a quote", () => {
    for (const rec of recommendations) {
      expect(rec.name).toBeTruthy();
      expect(rec.role).toBeTruthy();
      expect(rec.relation).toBeTruthy();
      expect(rec.quote.length).toBeGreaterThan(20);
    }
  });

  it("pull quote is a verbatim excerpt of its author's recommendation", () => {
    const source = recommendations.find((r) => r.name === pullQuote.author);
    expect(source).toBeDefined();
    expect(source?.quote).toContain(`${pullQuote.lead} ${pullQuote.punch}`);
  });

  it("has exactly one featured recommendation", () => {
    expect(recommendations.filter((r) => r.featured)).toHaveLength(1);
  });

  it("features Dan Jones' LinkedIn recommendation", () => {
    expect(recommendations[0]).toMatchObject({
      name: "Dan Jones",
      featured: true,
    });
  });
});

describe("projects", () => {
  it("each project has required fields and a valid accent", () => {
    expect(projects.length).toBeGreaterThan(0);
    for (const p of projects) {
      expect(p.name).toBeTruthy();
      expect(p.tag).toBeTruthy();
      expect(["default", "ai"]).toContain(p.accent);
      expect(p.description).toBeTruthy();
      expect(p.stack.length).toBeGreaterThan(0);
    }
  });
});

describe("works", () => {
  it("each work has required fields, a local screenshot, and a valid link", () => {
    for (const w of works) {
      expect(w.name).toBeTruthy();
      expect(w.role).toBeTruthy();
      expect(w.description).toBeTruthy();
      expect(w.year).toMatch(/^\d{4}/);
      expect(w.stack.length).toBeGreaterThan(0);
      expect(["freelance", "product", "side"]).toContain(w.kind);
      expect(w.image).toMatch(/^\/works\/[\w./-]+\.(png|jpe?g|webp|avif)$/);
      if (w.url) expect(w.url).toMatch(/^https?:\/\//);
    }
  });

  it("has unique names", () => {
    expect(new Set(works.map((w) => w.name)).size).toBe(works.length);
  });

  it("gives every tour screen a local image, a route, a caption and real pixel sizes", () => {
    for (const w of works) {
      const screens = w.screens ?? [];
      for (const s of screens) {
        expect(s.src).toMatch(/^\/works\/[\w./-]+\.(png|jpe?g|webp|avif)$/);
        expect(s.path).toMatch(/^\//);
        expect(s.title).toBeTruthy();
        expect(s.caption).toBeTruthy();
        expect(s.width).toBeGreaterThan(0);
        expect(s.height).toBeGreaterThan(0);
      }
      expect(new Set(screens.map((s) => s.src)).size).toBe(screens.length);
    }
  });
});

describe("services", () => {
  it("has an intro plus featured and secondary entries", () => {
    expect(services.intro).toBeTruthy();
    expect(services.featured.length).toBeGreaterThan(0);
    expect(services.secondary.length).toBeGreaterThan(0);
    for (const s of services.featured) {
      expect(s.title).toBeTruthy();
      expect(s.bullets.length).toBeGreaterThan(0);
      expect(["default", "ai"]).toContain(s.accent);
    }
  });
});
