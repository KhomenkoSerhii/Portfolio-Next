import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Mocked Resend send, shared with the module mock below.
const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

import { POST } from "@/app/api/contact/route";

function makeReq(body: unknown, ip = "1.2.3.4") {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const validBody = {
  name: "Serhii",
  email: "hi@example.com",
  message: "This is a sufficiently long message.",
  website: "",
};

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.stubEnv("CONTACT_EMAIL", "me@example.com");
    vi.stubEnv("RESEND_API_KEY", "re_test");
    sendMock.mockReset();
    sendMock.mockResolvedValue({ error: null });
  });
  afterEach(() => vi.unstubAllEnvs());

  it("returns 503 when email/key env is not configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const res = await POST(makeReq(validBody, "10.0.0.6"));
    expect(res.status).toBe(503);
  });

  it("returns 400 on malformed JSON", async () => {
    const res = await POST(makeReq("{ not json", "10.0.0.3"));
    expect(res.status).toBe(400);
  });

  it("returns 400 on schema-invalid input", async () => {
    const res = await POST(
      makeReq({ ...validBody, email: "nope" }, "10.0.0.2")
    );
    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("silently accepts a filled honeypot without sending", async () => {
    const res = await POST(
      makeReq({ ...validBody, website: "bot" }, "10.0.0.4")
    );
    // schema rejects a non-empty honeypot -> 400, never reaches send
    expect([200, 400]).toContain(res.status);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("sends the email and returns ok on valid input", async () => {
    const res = await POST(makeReq(validBody, "10.0.0.1"));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
    expect(sendMock).toHaveBeenCalledOnce();
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "me@example.com",
        replyTo: "hi@example.com",
        subject: expect.stringContaining("Serhii"),
      })
    );
  });

  it("returns 502 when Resend reports an error", async () => {
    sendMock.mockResolvedValue({ error: { message: "nope" } });
    const res = await POST(makeReq(validBody, "10.0.0.5"));
    expect(res.status).toBe(502);
  });

  it("rate-limits after 5 messages from the same IP", async () => {
    const ip = "10.0.0.99";
    for (let i = 0; i < 5; i++) {
      const ok = await POST(makeReq(validBody, ip));
      expect(ok.status).toBe(200);
    }
    const blocked = await POST(makeReq(validBody, ip));
    expect(blocked.status).toBe(429);
  });
});
