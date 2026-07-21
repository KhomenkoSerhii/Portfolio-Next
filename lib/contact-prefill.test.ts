import { describe, it, expect, vi, afterEach } from "vitest";
import { prefillContact, CONTACT_PREFILL_EVENT } from "@/lib/contact-prefill";

describe("prefillContact", () => {
  afterEach(() => vi.restoreAllMocks());

  it("dispatches the prefill event carrying the topic", () => {
    const handler = vi.fn();
    window.addEventListener(CONTACT_PREFILL_EVENT, handler);

    prefillContact("Performance Sprint");

    expect(handler).toHaveBeenCalledOnce();
    const event = handler.mock.calls[0][0] as CustomEvent<string>;
    expect(event.detail).toBe("Performance Sprint");

    window.removeEventListener(CONTACT_PREFILL_EVENT, handler);
  });
});
