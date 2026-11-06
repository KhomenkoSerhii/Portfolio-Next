import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "@/components/layout/Navbar";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";

function renderNavbar() {
  return render(
    <ThemeProvider>
      <Navbar />
    </ThemeProvider>
  );
}

describe("theme toggle", () => {
  beforeEach(() => {
    localStorage.removeItem("theme");
    document.documentElement.classList.remove("dark", "blue-hour");
  });

  it("defaults to Blue Hour and offers dark", async () => {
    renderNavbar();
    expect(await screen.findByRole("button", { name: "Switch to dark theme" })).toBeInTheDocument();
    expect(document.documentElement).toHaveClass("blue-hour");
  });

  it("restores a saved dark preference", async () => {
    localStorage.setItem("theme", "dark");
    renderNavbar();
    expect(await screen.findByRole("button", { name: "Switch to Blue Hour theme" })).toBeInTheDocument();
    expect(document.documentElement).toHaveClass("dark");
    expect(document.documentElement).not.toHaveClass("blue-hour");
  });

  it("switches back and forth and persists the choice", async () => {
    const user = userEvent.setup();
    renderNavbar();

    await user.click(await screen.findByRole("button", { name: "Switch to dark theme" }));
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(document.documentElement).toHaveClass("dark");

    await user.click(screen.getByRole("button", { name: "Switch to Blue Hour theme" }));
    expect(localStorage.getItem("theme")).toBe("blue-hour");
    expect(document.documentElement).toHaveClass("blue-hour");
    expect(document.documentElement).not.toHaveClass("dark");
  });

  it.each(["light", "calyptus"])("falls back to Blue Hour for the retired %s theme", async (saved) => {
    localStorage.setItem("theme", saved);
    renderNavbar();
    expect(await screen.findByRole("button", { name: "Switch to dark theme" })).toBeInTheDocument();
    expect(document.documentElement).toHaveClass("blue-hour");
  });

  it("grows the new theme out of the button when view transitions are available", async () => {
    const startViewTransition = vi.fn((update: () => void) => {
      update();
      return { finished: Promise.resolve(), ready: Promise.resolve(), updateCallbackDone: Promise.resolve() };
    });
    Object.defineProperty(document, "startViewTransition", { value: startViewTransition, configurable: true });

    renderNavbar();
    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: "Switch to dark theme" }));

    expect(startViewTransition).toHaveBeenCalledTimes(1);
    expect(document.documentElement).toHaveClass("dark");
    expect(document.documentElement.style.getPropertyValue("--vt-x")).toMatch(/px$/);
    // @ts-expect-error test cleanup
    delete document.startViewTransition;
  });
});

