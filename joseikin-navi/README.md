# 助成金ナビ（Joseikin Navi）

人材開発支援助成金（事業展開等リスキリング支援コース・定額制訓練）の申請進捗を6ステップで管理し、AIのアドバイスを受けながら申請を完遂できるSaaSです。

> 本サービスは情報提供とツールの提供を行うものであり、申請の代行は行いません。

## 技術スタック

- Next.js 14（App Router）+ TypeScript + Tailwind CSS
- Supabase（認証 + PostgreSQL + Storage、RLSでユーザーごとにデータ分離）
- Claude API（`claude-sonnet-4-6`）
  - ※ 仕様書記載の `claude-sonnet-4-20250514` は2026年6月15日廃止のため後継モデルを使用

## セットアップ

### 1. Supabase プロジェクトの準備

1. [supabase.com](https://supabase.com) でプロジェクトを作成
2. SQL Editor で `supabase/schema.sql` を実行（テーブル + RLS + Storageバケットが作成されます）
3. 開発中にメール確認を省略したい場合: Authentication > Providers > Email で「Confirm email」をオフ

### 2. 環境変数

```bash
cp .env.example .env.local
```

`.env.local` に以下を設定:

| 変数 | 取得元 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase > Settings > API |
| `ANTHROPIC_API_KEY` | [platform.claude.com](https://platform.claude.com) |

### 3. 起動

```bash
npm install
npm run dev
```

http://localhost:3000 でアクセス。サインアップ → マイページ → ステップ1の診断から始められます。

## 画面構成

| パス | 内容 |
|---|---|
| `/` | ランディング |
| `/login` `/signup` | 認証（Supabase Auth） |
| `/dashboard` | マイページ（進捗バー・6ステップ一覧・AIアドバイス） |
| `/step/1` | 事前診断（5問 → AIが受給可能性を判定） |
| `/step/2` | 計画申請書（書類チェックリスト + 書き方をAIに質問 + 提出日記録） |
| `/step/3` | 研修受講管理（時間記録・12hプログレスバー・ファイルアップロード） |
| `/step/4` | 本申請（チェックリスト + 不足書類AIチェック + 提出日記録） |
| `/step/5` | 問い合わせ対応（AI回答下書き生成 + コピー） |
| `/step/6` | 着金確認（入金記録 + 完了サマリー） |

全ページ右下にフローティングAIチャット（ストリーミング応答、会話はセッション中のみ保持）。

## APIルート

| パス | 役割 |
|---|---|
| `POST /api/chat` | AIチャット（テキストストリーミング） |
| `POST /api/diagnose` | 事前診断（構造化出力で 高/中/低 + 理由 + アドバイス） |
| `POST /api/advice` | 現在ステップのアドバイス生成（ダッシュボード右パネル） |
| `POST /api/generate` | 一括生成（ステップ4の不足チェック / ステップ5の回答下書き） |

すべてSupabaseセッションで認証チェックを行い、`ANTHROPIC_API_KEY` はサーバーサイドのみで使用します。

## 今後の予定（Phase 3）

- Stripe 月額課金
- モバイル最適化の仕上げ
- 会話履歴のDB保存
