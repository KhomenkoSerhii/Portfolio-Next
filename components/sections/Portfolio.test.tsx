import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Portfolio from "./Portfolio";
import type { Work } from "@/lib/data";

const work: Work = {
  name: "Acme Studio",
  url: "https://acme.example.com",
  role: "Design to production, Next.js build",
  description: "Marketing site with a headless CMS and a booking flow.",
  stack: ["Next.js", "TypeScript"],
  kind: "freelance",
  year: "2025",
  screens: [
    { src: "/works/acme/home.jpg", title: "Home", path: "/", caption: "Landing.", width: 1600, height: 1000 },
    { src: "/works/acme/book.jpg", title: "Booking", path: "/book", caption: "Booking flow.", width: 1600, height: 2400 },
  ],
};

describe("Portfolio", () => {
  it("shows only the works that are not hidden by default", () => {
    render(<Portfolio />);
    expect(screen.getByRole("heading", { level: 3, name: "Calyptus" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3, name: "Fintech IQ" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3, name: "Minute Minder" })).not.toBeInTheDocument();
  });

  it("renders nothing when there are no works", () => {
    const { container } = render(<Portfolio works={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows a client site as a screen deck with details, a site tour and a live link", () => {
    render(<Portfolio works={[work]} />);
    expect(screen.getByRole("heading", { name: "Acme Studio" })).toBeInTheDocument();
    expect(screen.getByAltText("Acme Studio: Home screen")).toBeInTheDocument();
    expect(screen.getByText("+ Next.js")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open site tour" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Visit Acme Studio/ })).toHaveAttribute(
      "href",
      "https://acme.example.com"
    );
  });

  it("uses the site's host in the deck's address bar", () => {
    render(<Portfolio works={[work]} />);
    expect(screen.getAllByText("acme.example.com", { exact: false }).length).toBeGreaterThan(0);
  });

  it("omits the live link when the work has no url", () => {
    render(<Portfolio works={[{ ...work, url: undefined }]} />);
    expect(screen.queryByRole("link", { name: /Visit/ })).not.toBeInTheDocument();
  });

  it("labels the tour after the kind of work", () => {
    render(<Portfolio works={[work]} />);
    fireEvent.click(screen.getByRole("button", { name: "Open site tour" }));
    expect(screen.getByRole("dialog", { name: /Acme Studio \/ Site tour/ })).toBeInTheDocument();
  });

  describe("product showcase", () => {
    const product: Work = {
      ...work,
      name: "Hireboard",
      url: undefined,
      host: "hireboard.io",
      kind: "product",
      screens: [
        { src: "/works/h/pool.png", title: "Pool", path: "/pool", caption: "Ranked matches.", width: 1600, height: 1000 },
        { src: "/works/h/profile.png", title: "Profile", path: "/profile", caption: "Full profile.", width: 1200, height: 2400 },
        { src: "/works/h/tests.png", title: "Tests", path: "/tests", caption: "Assessments.", width: 1600, height: 1000 },
      ],
    };

    it("shows the screen deck instead of a plain card", () => {
      render(<Portfolio works={[product]} />);
      expect(screen.getByRole("heading", { name: "Hireboard" })).toBeInTheDocument();
      expect(screen.getByText("3 screens")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Open Hireboard product tour at Pool" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Show Profile" })).toBeInTheDocument();
    });

    it("brings a back screen to the front when clicked", () => {
      render(<Portfolio works={[product]} />);
      fireEvent.click(screen.getByRole("button", { name: "Show Tests" }));
      expect(screen.getByRole("button", { name: "Open Hireboard product tour at Tests" })).toBeInTheDocument();
    });

    it("opens the tour, steps through screens with the keyboard, and closes on Escape", async () => {
      render(<Portfolio works={[product]} />);
      fireEvent.click(screen.getByRole("button", { name: "Open product tour" }));

      const dialog = screen.getByRole("dialog", { name: /Hireboard/ });
      expect(within(dialog).getByText("01 / 03")).toBeInTheDocument();
      expect(within(dialog).getByText("/pool")).toBeInTheDocument();
      expect(within(dialog).getByRole("button", { name: "Close" })).toHaveFocus();

      fireEvent.keyDown(window, { key: "ArrowRight" });
      expect(within(dialog).getByText("02 / 03")).toBeInTheDocument();
      expect(within(dialog).getByText("/profile")).toBeInTheDocument();

      fireEvent.keyDown(window, { key: "ArrowLeft" });
      fireEvent.keyDown(window, { key: "ArrowLeft" });
      expect(within(dialog).getByText("03 / 03")).toBeInTheDocument();

      fireEvent.keyDown(window, { key: "Escape" });
      await screen.findByRole("button", { name: "Open product tour" });
      await vi.waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    });
  });
});
