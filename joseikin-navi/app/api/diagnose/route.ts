import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { anthropic, CLAUDE_MODEL, SYSTEM_PROMPT } from "@/lib/claude";

export const runtime = "nodejs";
export const maxDuration = 60;

export type DiagnosisResult = {
  level: "高" | "中" | "低";
  reason: string;
  advice: string;
};

const QUESTION_LABELS: Record<string, string> = {
  employees: "従業員数（正規雇用）",
  insurance: "雇用保険に加入しているか",
  pastGrant: "過去3年以内に助成金を受給したことがあるか",
  trainee: "訓練させたい従業員はいるか",
  itTraining: "訓練内容はIT・デジタル分野か",
};

export async function POST(req: NextRequest) {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { answers } = (await req.json()) as {
    answers: Record<string, string>;
  };
  if (!answers || typeof answers !== "object") {
    return NextResponse.json({ error: "answers is required" }, { status: 400 });
  }

  const answerText = Object.entries(answers)
    .map(([key, value]) => `- ${QUESTION_LABELS[key] ?? key}: ${value}`)
    .join("\n");

  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `以下の事前診断の回答をもとに、人材開発支援助成金（事業展開等リスキリング支援コース・定額制訓練）の受給可能性を診断してください。

${answerText}

判定基準の目安:
- 雇用保険に未加入の場合は受給できないため「低」
- 訓練対象の従業員がいない場合は「低」
- 雇用保険加入かつ対象従業員がいてIT・デジタル分野なら「高」寄り
- 不明回答が多い場合は「中」として確認事項を案内`,
      },
    ],
    output_config: {
      format: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: {
            level: {
              type: "string",
              enum: ["高", "中", "低"],
              description: "受給可能性の判定",
            },
            reason: {
              type: "string",
              description: "判定理由（2〜3文、平易な言葉で）",
            },
            advice: {
              type: "string",
              description: "次のステップ（計画申請）に向けた推奨アクション（2〜3文）",
            },
          },
          required: ["level", "reason", "advice"],
          additionalProperties: false,
        },
      },
    },
  });

  const text = response.content.find((b) => b.type === "text")?.text ?? "";
  let result: DiagnosisResult;
  try {
    result = JSON.parse(text) as DiagnosisResult;
  } catch {
    return NextResponse.json(
      { error: "診断結果の生成に失敗しました。もう一度お試しください。" },
      { status: 502 }
    );
  }

  return NextResponse.json(result);
}
