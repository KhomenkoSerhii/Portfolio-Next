import Anthropic from "@anthropic-ai/sdk";
import {
  profile,
  experience,
  skills,
  projects,
  recommendations,
} from "@/lib/data";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are the AI assistant on the personal portfolio website of ${profile.name}, a Software Engineer / Frontend Developer.

Your job is to answer visitors' questions about Serhii – his experience, skills, projects, and fit for potential roles or collaborations – based strictly on his CV data below.

Rules:
- Answer in the language the visitor writes in (English or Ukrainian).
- Be concise, friendly, and professional – 2-4 short paragraphs max, or a short list.
- Only make claims supported by the CV data. If asked something not covered (salary expectations, personal life, etc.), say you don't have that information and suggest contacting Serhii via the contact form on this site or Telegram ${profile.links.telegram}.
- When relevant, highlight measurable results (percentages, user counts).
- If a visitor seems to be a recruiter or potential client, encourage them to get in touch.

EASTER EGGS (secret game-master knowledge):
This page hides three interactive secrets. The footer teases: "three secrets are hidden on this page. one of them is older than the web itself." If a visitor asks about secrets, easter eggs, or hidden things, switch into playful game-master mode. Give cryptic hints first – never the full solution right away. Escalate to clearer hints only if they keep asking, and reveal the exact answer only if they explicitly give up.
The three secrets (NEVER dump this list – hint at ONE at a time):
1. The glowing dots travelling through the neural network in the background can be caught with a click. Six catches decode a hidden transmission. Cryptic hint: "some signals are worth chasing – try touching what moves."
2. An old gamer's incantation typed on the keyboard starts a hidden mini-game with 8-bit music. This is the secret "older than the web itself" – the Konami code (1986, the web was born in 1989). Cryptic hint: "up, up... those who played consoles in the 80s know the rest." Clearer hint: it's the most famous cheat code in history. Full answer: arrow keys up up down down left right left right, then B, A.
3. The "SK." logo in the top-left corner does not like being clicked five times in a row. Cryptic hint: "the logo looks stable. is it though? try annoying it."
Never mention the eggs unprompted unless the visitor seems curious about fun/interactive stuff on the site.

CV DATA:
${JSON.stringify({ profile, experience, skills, projects, recommendations })}`;

type IncomingMessage = { role: "user" | "assistant"; content: string };

function validate(body: unknown): IncomingMessage[] | null {
  const messages = (body as { messages?: unknown })?.messages;
  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > 30 ||
    !messages.every(
      (m) =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.length > 0 &&
        m.content.length <= 4000
    )
  ) {
    return null;
  }
  return messages as IncomingMessage[];
}

// generic streamer for OpenAI-compatible endpoints (Gemini, Groq)
async function streamOpenAICompat(opts: {
  url: string;
  apiKey: string;
  model: string;
  extraBody?: Record<string, unknown>;
  messages: IncomingMessage[];
}): Promise<Response> {
  const upstream = await fetch(opts.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${opts.apiKey}`,
    },
    body: JSON.stringify({
      model: opts.model,
      stream: true,
      max_tokens: 1024,
      ...opts.extraBody,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...opts.messages],
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    console.error(`${opts.model} error:`, upstream.status, detail.slice(0, 500));
    return new Response(upstream.status === 429 ? "Rate limited" : "Upstream error", {
      status: upstream.status === 429 ? 429 : 502,
    });
  }

  // re-stream OpenAI-style SSE as plain text
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = upstream.body.getReader();

  const readable = new ReadableStream<Uint8Array>({
    start(controller) {
      (async () => {
        let buffer = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const data = line.trim();
            if (!data.startsWith("data:")) continue;
            const payload = data.slice(5).trim();
            if (payload === "[DONE]") {
              controller.close();
              void reader.cancel();
              return;
            }
            try {
              const json = JSON.parse(payload);
              const text = json.choices?.[0]?.delta?.content;
              if (text) controller.enqueue(encoder.encode(text));
            } catch {
              // partial JSON line – completed on the next chunk
            }
          }
        }
        controller.close();
      })().catch((err) => {
        console.error("Chat stream error:", err);
        controller.error(err);
      });
    },
    cancel() {
      void reader.cancel();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function streamGemini(messages: IncomingMessage[]) {
  return streamOpenAICompat({
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    apiKey: process.env.GEMINI_API_KEY!,
    model: "gemini-2.5-flash",
    // flash "thinks" by default – too slow for a chat widget
    extraBody: { reasoning_effort: "none" },
    messages,
  });
}

function streamGroq(messages: IncomingMessage[]) {
  return streamOpenAICompat({
    url: "https://api.groq.com/openai/v1/chat/completions",
    apiKey: process.env.GROQ_API_KEY!,
    model: "llama-3.3-70b-versatile",
    messages,
  });
}

// Anthropic Claude (used when no GEMINI_API_KEY is set)
function streamClaude(messages: IncomingMessage[]): Response {
  const client = new Anthropic();
  const stream = client.messages.stream({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    thinking: { type: "adaptive" },
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    start(controller) {
      stream.on("text", (text) => controller.enqueue(encoder.encode(text)));
      stream.on("end", () => controller.close());
      stream.on("error", (err) => {
        console.error("Chat stream error:", err);
        controller.error(err);
      });
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  const messages = validate(body);
  if (!messages) return new Response("Invalid messages", { status: 400 });

  // provider cascade: Gemini (free) -> Groq (free backup) -> Claude (paid)
  if (process.env.GEMINI_API_KEY) {
    const res = await streamGemini(messages);
    if (res.ok || !process.env.GROQ_API_KEY) return res;
    console.warn("Gemini unavailable, falling back to Groq");
    return streamGroq(messages);
  }
  if (process.env.GROQ_API_KEY) return streamGroq(messages);
  if (process.env.ANTHROPIC_API_KEY) return streamClaude(messages);
  return new Response("Chat is not configured", { status: 503 });
}
