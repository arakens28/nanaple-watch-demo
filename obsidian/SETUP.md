# Obsidian × Claude を MCP で直接つなぐ手順

> 目的：Claude が Obsidian Vault のノートを**直接 読み書き・検索・編集**できるようにする。
>
> ⚠️ 重要な前提：MCP は「Claude が動いている場所」から Obsidian に接続します。
> Obsidian は荒木さんのPC（ローカル）にあるため、**PCのClaude（Claude Desktop か Claude Code CLI）で設定**してください。
> クラウド版（claude.ai/code のこのセッション）はネットワーク的に隔離されていて、ローカルのObsidianには届きません。

---

## ステップ 1｜Obsidian 側：Local REST API プラグインを入れる

1. Obsidian → 設定 → コミュニティプラグイン → **「Local REST API」** を検索してインストール → 有効化
2. 設定画面で **API Key をコピー**（後で使う）
3. 既定のエンドポイント：
   - HTTPS：`https://127.0.0.1:27124`（自己署名証明書）
   - HTTP ：`http://127.0.0.1:27123`（プラグイン設定で有効化すると楽。SSL検証不要）

> プラグイン v4.0 以降推奨。Node.js v24+ もしくは Bun v1.3+ が必要。

---

## ステップ 2｜Claude 側：Obsidian MCP サーバーを追加

### A) Claude Code CLI の場合（ターミナルで1行）

```bash
claude mcp add obsidian \
  -e OBSIDIAN_API_KEY=＜ステップ1のAPIキー＞ \
  -e OBSIDIAN_BASE_URL=http://127.0.0.1:27123 \
  -e OBSIDIAN_VERIFY_SSL=false \
  -- npx -y obsidian-mcp-server@latest
```

### B) Claude Desktop の場合（設定ファイルに追記）

`claude_desktop_config.json`（設定→Developer→Edit Config）に下記を追加：

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "npx",
      "args": ["-y", "obsidian-mcp-server@latest"],
      "env": {
        "OBSIDIAN_API_KEY": "＜ステップ1のAPIキー＞",
        "OBSIDIAN_BASE_URL": "http://127.0.0.1:27123",
        "OBSIDIAN_VERIFY_SSL": "false",
        "MCP_TRANSPORT_TYPE": "stdio"
      }
    }
  }
}
```

保存して Claude を再起動。`obsidian` MCP が認識されれば接続完了。

> このリポジトリ内の `obsidian/mcp.json.template` を雛形として使えます（APIキーだけ差し替え）。
> ※ 環境変数名はサーバー実装で微差あり。`obsidian-mcp-server`（cyanheads）を例示。
> 代替：`mcp-obsidian`（MarkusPfundstein）/ Local REST API プラグイン内蔵のMCP も可。

---

## ステップ 3｜接続確認＆Vault投入

接続できたら、Claude に例えばこう頼めます：
- 「Obsidianに『月商10億円プロジェクト』というノートを作って、事業計画の要点をリンク付きでまとめて」
- 「Vault内の『FC戦略』ノートを開いて、最新の5月実績（営業利益率25%）を追記して」

このリポジトリの成果物（事業計画書・FC戦略・黒字化・DD回答・投資分析）を、
**相互リンク `[[ノート名]]` 付きのVault構造**としてまとめ直すこともできます（接続後に依頼してください）。

---

## どうしてもこのクラウドセッションで完結させたい場合（代替案）

ローカルに繋がない場合は、**このリポジトリ自体をObsidian Vault化**し、
Obsidian の「Obsidian Git」プラグインでGitHubと同期する方法が確実です。
（MCPのリアルタイム読み書きではなく、ファイル同期型）。希望があれば Vault 構造を生成します。

---

### 参考リンク
- Local REST API プラグイン（公式・MCP内蔵）: https://github.com/coddingtonbear/obsidian-local-rest-api
- obsidian-mcp-server（cyanheads）: https://github.com/cyanheads/obsidian-mcp-server
- mcp-obsidian（MarkusPfundstein）: https://github.com/MarkusPfundstein/mcp-obsidian
- セットアップ解説（2026）: https://mcp.directory/blog/obsidian-mcp-complete-guide-2026
