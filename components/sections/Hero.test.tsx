import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Hero from "@/components/sections/Hero";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";

const scene = {
  setMode: vi.fn(),
  setTimeMode: vi.fn(),
  setDark: vi.fn(),
  resize: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
  renderOnce: vi.fn(),
  dragStart: vi.fn(),
  drag: vi.fn(),
  dragEnd: vi.fn(),
  dispose: vi.fn(),
};
vi.mock("@/components/hero/scene", () => ({ createHeroScene: () => scene }));

function renderHero() {
  return render(
    <ThemeProvider>
      <Hero />
    </ThemeProvider>
  );
}

describe("Hero", () => {
  afterEach(() => vi.restoreAllMocks());

  it("leads with the slogan and the calls to action", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    renderHero();
    expect(screen.getByRole("heading", { level: 1 })).toHaveAccessibleName("Built from zero. Still in production.");
    expect(screen.getByRole("link", { name: "View work" })).toHaveAttribute("href", "#portfolio");
    expect(screen.getByRole("link", { name: "Download CV" })).toBeInTheDocument();
    expect(screen.getByText("Senior Software Engineer · React, Next.js, Node.js")).toBeVisible();
  });

  it("hides the figure controls when WebGL is not available", async () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    renderHero();
    await waitFor(() => expect(screen.queryByRole("group", { name: "Render mode" })).toBeNull());
  });

  it("starts on now and ASCII and passes choices to the scene", async () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({} as RenderingContext);
    const user = userEvent.setup();
    renderHero();

    expect(screen.getByRole("button", { name: "Now" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "ASCII" })).toHaveAttribute("aria-pressed", "true");
    await waitFor(() => expect(scene.setMode).toHaveBeenCalledWith("ascii"));

    await user.click(screen.getByRole("button", { name: "24h in 20s" }));
    expect(scene.setTimeMode).toHaveBeenLastCalledWith("lapse");
    await user.click(screen.getByRole("button", { name: "Blocks" }));
    expect(scene.setMode).toHaveBeenLastCalledWith("blocks");
  });
});
