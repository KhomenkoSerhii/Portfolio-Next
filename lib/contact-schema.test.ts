import { describe, it, expect } from "vitest";
import { contactSchema } from "@/lib/contact-schema";

const valid = {
  name: "Serhii",
  email: "hello@example.com",
  message: "This is a long enough message.",
  website: "",
};

describe("contactSchema", () => {
  it("accepts valid input", () => {
    const res = contactSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it("rejects a too-short name", () => {
    const res = contactSchema.safeParse({ ...valid, name: "S" });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0].message).toMatch(/short/i);
    }
  });

  it("rejects an invalid email", () => {
    const res = contactSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(res.success).toBe(false);
  });

  it("rejects a too-short message", () => {
    const res = contactSchema.safeParse({ ...valid, message: "hi" });
    expect(res.success).toBe(false);
  });

  it("trims surrounding whitespace on parse", () => {
    const res = contactSchema.safeParse({ ...valid, name: "  Serhii  " });
    expect(res.success).toBe(true);
    if (res.success) expect(res.data.name).toBe("Serhii");
  });

  it("treats the honeypot as optional when empty or absent", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
    const noWebsite = {
      name: valid.name,
      email: valid.email,
      message: valid.message,
    };
    expect(contactSchema.safeParse(noWebsite).success).toBe(true);
  });

  it("rejects a filled honeypot", () => {
    const res = contactSchema.safeParse({ ...valid, website: "spam" });
    expect(res.success).toBe(false);
  });

  it("exposes per-field schemas via .shape for inline validation", () => {
    expect(contactSchema.shape.email.safeParse("bad").success).toBe(false);
    expect(
      contactSchema.shape.email.safeParse("ok@ok.com").success
    ).toBe(true);
  });
});
