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
    document.documentElement.classList.remove("dark");
  });

  it("defaults to light and offers to switch to dark", async () => {
    renderNavbar();
    expect(
      await screen.findByRole("button", { name: /switch to dark theme/i })
    ).toBeInTheDocument();
    expect(document.documentElement).not.toHaveClass("dark");
  });

  it("restores a saved dark preference", async () => {
    localStorage.setItem("theme", "dark");
    renderNavbar();
    expect(
      await screen.findByRole("button", { name: /switch to light theme/i })
    ).toBeInTheDocument();
    expect(document.documentElement).toHaveClass("dark");
  });

  it("toggles to dark, persists the choice, and flips the label", async () => {
    const user = userEvent.setup();
    renderNavbar();

    const toggle = await screen.findByRole("button", {
      name: /switch to dark theme/i,
    });
    await user.click(toggle);

    expect(localStorage.getItem("theme")).toBe("dark");
    expect(document.documentElement).toHaveClass("dark");
    expect(
      screen.getByRole("button", { name: /switch to light theme/i })
    ).toBeInTheDocument();
  });
});
