import { NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { anthropic, CLAUDE_MODEL, SYSTEM_PROMPT, stepContext } from "@/lib/claude";

export const runtime = "nodejs";
export const maxDuration = 60;

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages, step } = (await req.json()) as {
    messages: ChatMessage[];
    step?: number;
  };
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("messages is required", { status: 400 });
  }

  const system = step ? SYSTEM_PROMPT + stepContext(step) : SYSTEM_PROMPT;

  const stream = anthropic.messages.stream({
    model: CLAUDE_MODEL,
    max_tokens: 2048,
    system,
    messages: messages.slice(-20),
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    start(controller) {
      stream.on("text", (text) => controller.enqueue(encoder.encode(text)));
      stream.on("end", () => controller.close());
      stream.on("error", (err) => controller.error(err));
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
