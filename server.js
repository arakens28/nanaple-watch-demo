/*
 * nanaple AI社員システム - サーバー
 * ====================================
 * マルチエージェントAIダッシュボードのExpressサーバー
 *
 * 起動方法:
 *   1. 依存関係のインストール: npm install
 *   2. 環境変数の設定: cp .env.example .env && .envを編集
 *   3. サーバー起動: npm start
 *   4. ブラウザでアクセス: http://localhost:3000/dashboard.html
 *
 * 必要な環境変数:
 *   ANTHROPIC_API_KEY - Anthropic APIキー (https://console.anthropic.com)
 */

import "dotenv/config";
import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Anthropic クライアントの初期化
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// エージェント定義
const AGENTS = {
  coordinator: {
    name: "田中",
    role: "コーディネーター",
    model: "claude-haiku-4-5",
    system:
      "あなたはnanapleの時計修理事業のAIコーディネーター田中です。チームを率いて業務タスクを管理します。受け取ったタスクを分析し、営業AI山田と企画AI佐藤への具体的な指示を日本語で出してください。200文字以内で簡潔に。",
  },
  sales: {
    name: "山田",
    role: "営業AI",
    model: "claude-haiku-4-5",
    system:
      "あなたはnanapleの営業AIアシスタント山田です。時計修理の営業・顧客提案が専門です。コーディネーターの指示を受けて、営業観点での提案や文案を300文字以内で作成してください。",
  },
  planning: {
    name: "佐藤",
    role: "企画AI",
    model: "claude-haiku-4-5",
    system:
      "あなたはnanapleの企画AIアシスタント佐藤です。事業企画・資料作成が専門です。コーディネーターの指示を受けて、企画・施策の観点からアイデアや構成案を300文字以内で提示してください。",
  },
  qa: {
    name: "鈴木",
    role: "品質AI",
    model: "claude-haiku-4-5",
    system:
      "あなたはnanapleの品質確認AIアシスタント鈴木です。内容のチェックと改善提案が専門です。営業AIと企画AIの出力を確認し、改善点や補足事項を200文字以内でフィードバックしてください。",
  },
};

/**
 * 単一エージェントのストリーミング実行
 * SSEイベントをレスポンスに書き込みながらトークンをストリームする
 */
async function runAgent(res, agentKey, messages, label) {
  const agent = AGENTS[agentKey];
  const agentName = label || agent.name;

  // エージェント開始イベント
  res.write(
    `data: ${JSON.stringify({ type: "agent_start", agent: agentName, role: agent.role })}\n\n`
  );

  let fullText = "";

  const stream = anthropic.messages.stream({
    model: agent.model,
    max_tokens: 1024,
    system: agent.system,
    messages,
  });

  for await (const chunk of stream) {
    if (
      chunk.type === "content_block_delta" &&
      chunk.delta.type === "text_delta"
    ) {
      const token = chunk.delta.text;
      fullText += token;
      res.write(
        `data: ${JSON.stringify({ type: "agent_token", agent: agentName, content: token })}\n\n`
      );
    }
  }

  // エージェント完了イベント
  res.write(
    `data: ${JSON.stringify({ type: "agent_done", agent: agentName, content: fullText })}\n\n`
  );

  return fullText;
}

/**
 * POST /api/task
 * タスクを受け取り、マルチエージェントパイプラインをSSEでストリーミング実行する
 */
app.post("/api/task", async (req, res) => {
  const { task } = req.body;

  if (!task || typeof task !== "string" || task.trim() === "") {
    return res.status(400).json({ error: "タスクを入力してください" });
  }

  // SSE ヘッダーの設定
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  try {
    // ============================================================
    // ステップ1: コーディネーター田中 - タスク分析と指示出し
    // ============================================================
    const coordinatorOutput = await runAgent(
      res,
      "coordinator",
      [{ role: "user", content: `以下のタスクを分析し、チームへの指示を出してください:\n\n${task}` }],
      "田中"
    );

    // ============================================================
    // ステップ2: 営業AI山田 と 企画AI佐藤 (並列実行)
    // ============================================================
    const salesInput = [
      {
        role: "user",
        content: `コーディネーターからの指示:\n${coordinatorOutput}\n\n元のタスク:\n${task}\n\n上記の指示に基づき、営業観点での提案を作成してください。`,
      },
    ];

    const planningInput = [
      {
        role: "user",
        content: `コーディネーターからの指示:\n${coordinatorOutput}\n\n元のタスク:\n${task}\n\n上記の指示に基づき、企画・施策の観点からアイデアを提示してください。`,
      },
    ];

    // 営業AIと企画AIを並列実行
    const [salesOutput, planningOutput] = await Promise.all([
      runAgent(res, "sales", salesInput, "山田"),
      runAgent(res, "planning", planningInput, "佐藤"),
    ]);

    // ============================================================
    // ステップ3: 品質AI鈴木 - レビューとフィードバック
    // ============================================================
    const qaOutput = await runAgent(
      res,
      "qa",
      [
        {
          role: "user",
          content: `以下の営業AIと企画AIの出力を確認し、改善点や補足事項をフィードバックしてください:\n\n【営業AI山田の提案】\n${salesOutput}\n\n【企画AI佐藤のアイデア】\n${planningOutput}`,
        },
      ],
      "鈴木"
    );

    // ============================================================
    // ステップ4: コーディネーター田中 - 最終まとめ
    // ============================================================
    await runAgent(
      res,
      "coordinator",
      [
        {
          role: "user",
          content: `チーム全員のアウトプットをまとめ、最終的なアクションプランを箇条書きで提示してください。\n\n【元のタスク】\n${task}\n\n【営業AI山田の提案】\n${salesOutput}\n\n【企画AI佐藤のアイデア】\n${planningOutput}\n\n【品質AI鈴木のフィードバック】\n${qaOutput}`,
        },
      ],
      "田中（最終まとめ）"
    );

    // パイプライン完了イベント
    res.write(
      `data: ${JSON.stringify({ type: "pipeline_done" })}\n\n`
    );
  } catch (error) {
    console.error("Pipeline error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "不明なエラーが発生しました";
    res.write(
      `data: ${JSON.stringify({ type: "error", content: errorMessage })}\n\n`
    );
  } finally {
    res.end();
  }
});

// ヘルスチェックエンドポイント
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "nanaple AI社員システム稼働中",
    apiKeySet: !!process.env.ANTHROPIC_API_KEY,
  });
});

app.listen(PORT, () => {
  console.log(`\n🕐 nanaple AI社員システム 起動中`);
  console.log(`   ダッシュボード: http://localhost:${PORT}/dashboard.html`);
  console.log(`   ヘルスチェック: http://localhost:${PORT}/api/health`);
  console.log(
    `   APIキー設定: ${process.env.ANTHROPIC_API_KEY ? "✅ 設定済み" : "❌ 未設定 (.envを確認してください)"}\n`
  );
});
