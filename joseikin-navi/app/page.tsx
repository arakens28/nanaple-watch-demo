import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="mb-2 text-sm font-semibold text-brand-600">
        人材開発支援助成金（定額制訓練）対応
      </p>
      <h1 className="mb-4 text-4xl font-bold leading-tight">
        助成金ナビ
      </h1>
      <p className="mb-8 max-w-xl text-gray-600">
        助成金申請の進捗を6つのステップで管理。
        AIアシスタントのアドバイスを受けながら、自分のペースで申請を完遂できます。
        <br />
        <span className="text-sm text-gray-400">
          ※本サービスは情報提供とツールの提供を行うものであり、申請の代行は行いません。
        </span>
      </p>
      <div className="flex gap-4">
        <Link href="/signup" className="btn-primary px-8 py-3 text-base">
          無料ではじめる
        </Link>
        <Link href="/login" className="btn-secondary px-8 py-3 text-base">
          ログイン
        </Link>
      </div>
    </main>
  );
}
