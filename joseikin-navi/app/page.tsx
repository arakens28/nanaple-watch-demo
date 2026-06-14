import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* ヒーローセクション */}
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="mb-2 inline-block rounded-full bg-brand-100 px-4 py-1 text-sm font-semibold text-brand-700">
          ホリエモンAI学校受講企業向け
        </p>
        <p className="mb-3 text-xs text-gray-500">
          人材開発支援助成金（事業展開等リスキリング支援コース）定額制訓練
        </p>
        <h1 className="mb-4 text-4xl font-bold leading-tight text-gray-900">
          助成金、自分で申請できます。
        </h1>
        <p className="mb-2 text-lg text-gray-600">
          社労士に丸投げせず、自社で進める助成金申請サポートツール
        </p>
        <p className="mb-8 text-sm text-gray-500">
          「自社が対象か」「いくら出るか」を最短で確認。
          書類の準備から提出完了まで、6つのステップで整理します。
        </p>

        {/* 2大入口 */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/signup"
            className="flex flex-col items-center rounded-xl border-2 border-brand-600 bg-brand-600 px-6 py-5 text-white transition hover:bg-brand-700"
          >
            <span className="text-2xl mb-1">🎯</span>
            <span className="font-bold">自社が対象か診断する</span>
            <span className="mt-1 text-xs text-brand-100">無料・約2分</span>
          </Link>
          <Link
            href="/signup"
            className="flex flex-col items-center rounded-xl border-2 border-gray-300 bg-white px-6 py-5 text-gray-700 transition hover:border-brand-400 hover:text-brand-700"
          >
            <span className="text-2xl mb-1">💰</span>
            <span className="font-bold">いくら出るか確認する</span>
            <span className="mt-1 text-xs text-gray-400">受講人数・費用から試算</span>
          </Link>
        </div>

        <Link href="/login" className="text-sm text-gray-500 underline hover:text-gray-700">
          すでにアカウントをお持ちの方はこちら
        </Link>
      </div>

      {/* 重要事項 */}
      <div className="border-y border-amber-200 bg-amber-50 py-4">
        <p className="mx-auto max-w-3xl px-6 text-center text-sm text-amber-800">
          <strong>このサービスは申請代行ではありません。</strong>
          書類の記入・提出は必ずご自身で行っていただきます。
          最終的な制度の判断は管轄の労働局にご確認ください。
        </p>
      </div>

      {/* 対象コース説明 */}
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-blue-600 mb-2">対象制度</p>
          <p className="font-bold text-blue-900 text-base">
            人材開発支援助成金（事業展開等リスキリング支援コース）定額制訓練
          </p>
          <p className="mt-2 text-sm text-blue-800 leading-relaxed">
            令和4年12月〜令和8年度の期間限定。DX・新規事業展開に伴い従業員に新分野のIT研修を受けさせる事業主を支援する制度です。
            ホリエモンAI学校のような定額制（サブスクリプション）型のeラーニング研修が対象です。
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-white border border-blue-200 p-3 text-center">
              <p className="text-xs text-blue-600 font-semibold">中小企業</p>
              <p className="text-xl font-bold text-blue-900">75%</p>
              <p className="text-xs text-blue-600">経費助成率</p>
            </div>
            <div className="rounded-lg bg-white border border-blue-200 p-3 text-center">
              <p className="text-xs text-blue-600 font-semibold">大企業</p>
              <p className="text-xl font-bold text-blue-900">60%</p>
              <p className="text-xs text-blue-600">経費助成率</p>
            </div>
            <div className="rounded-lg bg-white border border-blue-200 p-3 text-center">
              <p className="text-xs text-blue-600 font-semibold">上限</p>
              <p className="text-xl font-bold text-blue-900">2万円</p>
              <p className="text-xs text-blue-600">1人・1ヶ月</p>
            </div>
          </div>
          <a
            href="https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/38819_00010.html#事業展開等リスキリング支援コース"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-xs text-blue-700 underline hover:text-blue-900"
          >
            厚生労働省 公式ページ（様式・詳細）↗
          </a>
        </div>
      </div>

      {/* 申請の流れ */}
      <div className="mx-auto max-w-3xl px-6 pb-12">
        <h2 className="mb-6 text-center text-xl font-bold text-gray-800">
          申請の流れ（6ステップ）
        </h2>
        <div className="grid gap-3">
          {[
            { step: 1, name: "事前診断", desc: "対象か・いくら出るかを確認" },
            { step: 2, name: "計画書提出", desc: "受講開始1ヶ月前までに労働局へ（計画届）" },
            { step: 3, name: "研修受講", desc: "対象従業員が合計10時間以上受講" },
            { step: 4, name: "支給申請", desc: "訓練終了日翌日から2ヶ月以内に申請" },
            { step: 5, name: "問い合わせ対応", desc: "労働局からの確認に回答" },
            { step: 6, name: "着金確認", desc: "入金確認で完了" },
          ].map(({ step, name, desc }) => (
            <div
              key={step}
              className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                {step}
              </span>
              <div>
                <span className="font-semibold text-gray-800">{name}</span>
                <span className="ml-2 text-sm text-gray-500">{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
