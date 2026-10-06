import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Portfolio from "./Portfolio";
import type { Work } from "@/lib/data";

const work: Work = {
  name: "Acme Studio",
  url: "https://acme.example.com",
  image: "/works/acme.png",
  role: "Design to production, Next.js build",
  description: "Marketing site with a headless CMS and a booking flow.",
  stack: ["Next.js", "TypeScript"],
  kind: "freelance",
  year: "2025",
};

describe("Portfolio", () => {
  it("renders nothing when there are no works", () => {
    const { container } = render(<Portfolio works={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a card with screenshot, details and a live link", () => {
    render(<Portfolio works={[work]} />);
    expect(screen.getByRole("heading", { name: "Acme Studio" })).toBeInTheDocument();
    expect(screen.getByAltText("Acme Studio website screenshot")).toBeInTheDocument();
    expect(screen.getByText("+ Next.js")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Visit Acme Studio/ })).toHaveAttribute(
      "href",
      "https://acme.example.com"
    );
  });

  it("omits the live link when the work has no url", () => {
    render(<Portfolio works={[{ ...work, url: undefined }]} />);
    expect(screen.queryByRole("link", { name: /Visit/ })).not.toBeInTheDocument();
  });
});
