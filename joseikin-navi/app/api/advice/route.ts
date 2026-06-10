import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { anthropic, CLAUDE_MODEL, SYSTEM_PROMPT, stepContext } from "@/lib/claude";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { step, context } = (await req.json()) as {
    step: number;
    context?: string;
  };
  if (!step || step < 1 || step > 6) {
    return NextResponse.json({ error: "invalid step" }, { status: 400 });
  }

  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 512,
    system: SYSTEM_PROMPT + stepContext(step, context),
    messages: [
      {
        role: "user",
        content:
          "このステップでユーザーが今やるべきことを、見出しなしの短い箇条書き（3〜4項目、各1文）でアドバイスしてください。前置きは不要です。",
      },
    ],
  });

  const advice =
    response.content.find((b) => b.type === "text")?.text ?? "";
  return NextResponse.json({ advice });
}
