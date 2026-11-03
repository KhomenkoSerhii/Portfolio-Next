import { describe, it, expect, beforeEach } from "vitest";
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

  it("defaults to Blue Hour and offers all colour themes", async () => {
    renderNavbar();
    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: /choose colour theme/i }));
    expect(screen.getByRole("menuitemradio", { name: "Blue Hour" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("menuitemradio", { name: "Light" })).toBeInTheDocument();
    expect(screen.getByRole("menuitemradio", { name: "Dark" })).toBeInTheDocument();
    expect(document.documentElement).toHaveClass("blue-hour");
  });

  it("restores a saved dark preference", async () => {
    localStorage.setItem("theme", "dark");
    renderNavbar();
    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: /choose colour theme/i }));
    expect(screen.getByRole("menuitemradio", { name: "Dark" })).toHaveAttribute("aria-checked", "true");
    expect(document.documentElement).toHaveClass("dark");
    expect(document.documentElement).not.toHaveClass("blue-hour");
  });

  it("selects Light, persists the choice, and drops the theme classes", async () => {
    const user = userEvent.setup();
    renderNavbar();

    await user.click(await screen.findByRole("button", { name: /choose colour theme/i }));
    await user.click(screen.getByRole("menuitemradio", { name: "Light" }));

    expect(localStorage.getItem("theme")).toBe("light");
    expect(document.documentElement).not.toHaveClass("blue-hour");
    expect(document.documentElement).not.toHaveClass("dark");
  });

  it("falls back to Blue Hour for a value saved under the old theme name", async () => {
    localStorage.setItem("theme", "calyptus");
    renderNavbar();
    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: /choose colour theme/i }));
    expect(screen.getByRole("menuitemradio", { name: "Blue Hour" })).toHaveAttribute("aria-checked", "true");
  });
});
