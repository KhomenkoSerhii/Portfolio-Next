import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Contact from "@/components/sections/Contact";
import { prefillContact } from "@/lib/contact-prefill";

describe("Contact form", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows an inline error when a field blurs invalid", async () => {
    const user = userEvent.setup();
    render(<Contact />);

    const name = screen.getByPlaceholderText("Your name");
    await user.type(name, "S");
    await user.tab(); // blur

    expect(await screen.findByText(/name is too short/i)).toBeInTheDocument();
  });

  it("prefills the message from a prefill event", async () => {
    render(<Contact />);
    prefillContact("Performance Sprint");

    const textarea = await screen.findByDisplayValue(
      /I'd like to discuss: Performance Sprint/
    );
    expect(textarea).toBeInTheDocument();
  });

  it("submits valid data and shows the success state", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    render(<Contact />);

    await user.type(screen.getByPlaceholderText("Your name"), "Serhii");
    await user.type(
      screen.getByPlaceholderText("Your email"),
      "hi@example.com"
    );
    await user.type(
      screen.getByPlaceholderText(/Tell me about your project/i),
      "This is a sufficiently long message."
    );
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText(/message sent/i)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/contact",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("surfaces a server error message on failure", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Failed to send" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    render(<Contact />);

    await user.type(screen.getByPlaceholderText("Your name"), "Serhii");
    await user.type(
      screen.getByPlaceholderText("Your email"),
      "hi@example.com"
    );
    await user.type(
      screen.getByPlaceholderText(/Tell me about your project/i),
      "This is a sufficiently long message."
    );
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() =>
      expect(screen.getByText(/failed to send/i)).toBeInTheDocument()
    );
  });
});
