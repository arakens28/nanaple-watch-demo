import Anthropic from "@anthropic-ai/sdk";
import { STEP_NAMES } from "./steps";

// 仕様書記載の claude-sonnet-4-20250514 は 2026-06-15 廃止のため後継モデルを使用
export const CLAUDE_MODEL = "claude-sonnet-4-6";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const SYSTEM_PROMPT = `あなたは人材開発支援助成金（事業展開等リスキリング支援コース・定額制訓練）の申請をサポートするAIアシスタントです。
ユーザーが自分で申請を進めるためのガイドをしてください。

ルール:
- 申請の代行はできません。情報提供とアドバイスのみ行います。
- 回答は簡潔に、次に取るべきアクションを明確に示してください。
- 法的判断が必要な内容には踏み込まず、「念のため社労士または労働局にご確認ください」と適宜添えてください。
- 難しい専門用語は避け、申請初心者にも分かる言葉で説明してください。`;

export function stepContext(step: number, extra?: string): string {
  const base = `\n\n現在ユーザーは申請ステップ${step}「${STEP_NAMES[step] ?? ""}」に取り組んでいます。`;
  return extra ? `${base}\nユーザーの状況: ${extra}` : base;
}
