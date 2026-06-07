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
    name: "堀江",
    role: "CEO戦略AI",
    model: "claude-haiku-4-5",
    system:
      "あなたはホリエモンAI学校のCEO戦略AIアシスタント堀江です。ビジネスの本質を見抜き、売上最大化のための大胆な戦略を指示します。遠慮なく本質を突いた指示を200文字以内で出してください。余計な前置きは不要。",
  },
  marketing: {
    name: "西野",
    role: "マーケAI",
    model: "claude-haiku-4-5",
    system:
      "あなたはホリエモンAI学校のマーケティングAI西野です。SNS・コミュニティ・ファネル設計のプロです。CEOの指示を受けて、集客から購買までの具体的なマーケ施策を300文字以内で提案してください。",
  },
  content: {
    name: "田村",
    role: "コンテンツAI",
    model: "claude-haiku-4-5",
    system:
      "あなたはホリエモンAI学校のコンテンツAI田村です。講座設計・カリキュラム・教材企画のプロです。CEOの指示を受けて、受講生が熱狂するコンテンツ戦略を300文字以内で提案してください。",
  },
  sales: {
    name: "山田",
    role: "セールスAI",
    model: "claude-haiku-4-5",
    system:
      "あなたはホリエモンAI学校のセールスAI山田です。成約率向上・オファー設計・価格戦略のプロです。CEOの指示とマーケ・コンテンツ案を踏まえて、売上直結の販売戦略を300文字以内で提案してください。",
  },
  analyst: {
    name: "佐藤",
    role: "分析AI",
    model: "claude-haiku-4-5",
    system:
      "あなたはホリエモンAI学校の数値分析AI佐藤です。KPI設計・施策評価・改善提案のプロです。チーム全員の提案を数字の観点でレビューし、優先度と改善点を200文字以内でフィードバックしてください。",
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
    // ステップ1: CEO戦略AI堀江 - タスク分析と指示出し
    // ============================================================
    const coordinatorOutput = await runAgent(
      res,
      "coordinator",
      [{ role: "user", content: `以下のタスクを分析し、売上最大化のためにチームへの指示を出してください:\n\n${task}` }],
      "堀江"
    );

    // ============================================================
    // ステップ2: マーケAI西野・コンテンツAI田村・セールスAI山田 (並列実行)
    // ============================================================
    const baseContext = `CEOからの指示:\n${coordinatorOutput}\n\n元のタスク:\n${task}\n\n`;

    const [marketingOutput, contentOutput, salesOutput] = await Promise.all([
      runAgent(res, "marketing",
        [{ role: "user", content: `${baseContext}上記を踏まえ、集客・SNS・ファネル設計の観点で施策を提案してください。` }],
        "西野"),
      runAgent(res, "content",
        [{ role: "user", content: `${baseContext}上記を踏まえ、コンテンツ・講座設計の観点で施策を提案してください。` }],
        "田村"),
      runAgent(res, "sales",
        [{ role: "user", content: `${baseContext}上記を踏まえ、オファー設計・成約率向上の観点で施策を提案してください。` }],
        "山田"),
    ]);

    // ============================================================
    // ステップ3: 分析AI佐藤 - 数値レビューとフィードバック
    // ============================================================
    const analystOutput = await runAgent(
      res,
      "analyst",
      [
        {
          role: "user",
          content: `以下のチームの提案を数値・優先度の観点でレビューしてください:\n\n【マーケAI西野】\n${marketingOutput}\n\n【コンテンツAI田村】\n${contentOutput}\n\n【セールスAI山田】\n${salesOutput}`,
        },
      ],
      "佐藤"
    );

    // ============================================================
    // ステップ4: CEO戦略AI堀江 - 最終決断・アクションプラン
    // ============================================================
    await runAgent(
      res,
      "coordinator",
      [
        {
          role: "user",
          content: `チーム全員のアウトプットを受けて、売上最大化のための最終アクションプランを箇条書きで決断してください。優先度順に。\n\n【元のタスク】\n${task}\n\n【マーケAI西野】\n${marketingOutput}\n\n【コンテンツAI田村】\n${contentOutput}\n\n【セールスAI山田】\n${salesOutput}\n\n【分析AI佐藤のレビュー】\n${analystOutput}`,
        },
      ],
      "堀江（最終決断）"
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
