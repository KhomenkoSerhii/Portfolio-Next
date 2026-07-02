import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";

export const runtime = "nodejs";

// simple in-memory rate limit: max 5 submissions per IP per hour
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

export async function POST(req: Request) {
  const contactEmail = process.env.CONTACT_EMAIL;
  const resendKey = process.env.RESEND_API_KEY;
  if (!contactEmail || !resendKey) {
    console.error("Contact form: CONTACT_EMAIL or RESEND_API_KEY not set");
    return Response.json(
      { error: "Contact form is not configured" },
      { status: 503 }
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return Response.json(
      { error: "Too many messages. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  // honeypot filled -> silently accept so bots don't learn
  if (parsed.data.website !== undefined && parsed.data.website !== "") {
    return Response.json({ ok: true });
  }

  const { name, email, message } = parsed.data;

  try {
    const resend = new Resend(resendKey);
    const { error } = await resend.emails.send({
      // after verifying your own domain in Resend, change to e.g. "Portfolio <contact@yourdomain.dev>"
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: contactEmail,
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });
    if (error) {
      console.error("Resend error:", error);
      return Response.json(
        { error: "Failed to send message" },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("Contact form error:", err);
    return Response.json({ error: "Failed to send message" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
