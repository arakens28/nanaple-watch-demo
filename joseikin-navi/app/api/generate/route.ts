import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { anthropic, CLAUDE_MODEL, SYSTEM_PROMPT } from "@/lib/claude";
import { STEP4_DOCS } from "@/lib/steps";

export const runtime = "nodejs";
export const maxDuration = 60;

const STEP4_DOCS_SET = new Set(STEP4_DOCS);
const MAX_INQUIRY_LENGTH = 2000;

type GeneratePayload =
  | {
      purpose: "step4_check";
      checked: string[];
      unchecked: string[];
    }
  | {
      purpose: "step5_draft";
      inquiry: string;
    };

export async function POST(req: NextRequest) {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await req.json()) as GeneratePayload;

  let prompt: string;
  if (payload.purpose === "step4_check") {
    // checked/unchecked は既知の書類名リストのみ許可（プロンプトインジェクション対策）
    const checked = (payload.checked ?? []).filter((d) => STEP4_DOCS_SET.has(d));
    const unchecked = (payload.unchecked ?? []).filter((d) => STEP4_DOCS_SET.has(d));

    prompt = `本申請（支給申請）の書類チェックリストの状況です。

準備済み:
${checked.map((d) => `- ${d}`).join("\n") || "（なし）"}

未準備:
${unchecked.map((d) => `- ${d}`).join("\n") || "（なし）"}

未準備の書類について「これが足りていません」という形で指摘し、それぞれの入手方法・作成方法を簡潔に案内してください。すべて準備済みの場合は提出前の最終確認ポイントを案内してください。`;
  } else if (payload.purpose === "step5_draft") {
    const inquiry = String(payload.inquiry ?? "").trim();
    if (!inquiry) {
      return NextResponse.json(
        { error: "問い合わせ内容を入力してください" },
        { status: 400 }
      );
    }
    // 文字数制限（プロンプト過大送信・インジェクション対策）
    const truncated = inquiry.slice(0, MAX_INQUIRY_LENGTH);

    prompt = `労働局から以下の問い合わせを受けました。事業主として返信する回答文の下書きを作成してください。

問い合わせ内容:
<inquiry>
${truncated}
</inquiry>

要件:
- そのままコピーして使える丁寧なビジネス文書の形式
- 事実確認が必要な箇所は【】で囲んだプレースホルダーにする（例:【受講開始日を記入】）
- 回答文の後に、送付前に確認すべきポイントを箇条書きで添える`;
  } else {
    return NextResponse.json({ error: "invalid purpose" }, { status: 400 });
  }

  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content.find((b) => b.type === "text")?.text ?? "";
  return NextResponse.json({ text });
}
