import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* ヒーロー */}
      <div className="bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-2xl px-6 pt-14 pb-10 text-center">
          <p className="mb-4 inline-block rounded-full bg-brand-100 px-4 py-1 text-sm font-semibold text-brand-700">
            ホリエモンAI学校受講企業向け 無料診断ツール
          </p>
          <h1 className="mb-4 text-4xl font-bold leading-tight text-gray-900">
            自社が助成金の対象か<br className="hidden sm:block" />2分で分かります
          </h1>
          <p className="mb-2 text-lg text-gray-600">
            AI研修の受講料、最大<span className="font-bold text-brand-700">75%</span>が国から助成されます
          </p>
          <p className="mb-8 text-sm text-gray-400">登録不要・無料・AIが即時診断</p>

          <Link
            href="/check"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-10 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-brand-700"
          >
            🎯 無料で診断する
            <span className="text-brand-200 text-base">→</span>
          </Link>
          <p className="mt-3 text-xs text-gray-400">登録不要・約2分</p>
        </div>
      </div>

      {/* 数字3つ */}
      <div className="border-y border-gray-200">
        <div className="mx-auto grid max-w-2xl grid-cols-3 divide-x divide-gray-200">
          <div className="px-4 py-5 text-center">
            <p className="text-3xl font-bold text-brand-700">75%</p>
            <p className="mt-1 text-xs text-gray-500">中小企業の助成率</p>
          </div>
          <div className="px-4 py-5 text-center">
            <p className="text-3xl font-bold text-brand-700">24万円</p>
            <p className="mt-1 text-xs text-gray-500">1人あたり年間の上限</p>
          </div>
          <div className="px-4 py-5 text-center">
            <p className="text-3xl font-bold text-brand-700">R8年度</p>
            <p className="mt-1 text-xs text-gray-500">制度の終了期限</p>
          </div>
        </div>
      </div>

      {/* こんな方に */}
      <div className="mx-auto max-w-2xl px-6 py-10">
        <h2 className="mb-5 text-center text-lg font-bold text-gray-800">こんな方にぴったりです</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: "💭", text: "ホリエモンAI学校の受講を検討中だが、費用負担が気になる" },
            { icon: "📋", text: "助成金を使いたいが、何から始めれば良いか分からない" },
            { icon: "💼", text: "社労士に頼むほどじゃないが、自社で申請できるか確認したい" },
            { icon: "⏰", text: "受講前に計画書の締め切りをすぐに把握しておきたい" },
          ].map(({ icon, text }) => (
            <div key={text} className="flex gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <span className="shrink-0 text-xl">{icon}</span>
              <p className="text-sm text-gray-700">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/check"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-8 py-3.5 text-base font-bold text-white shadow transition hover:bg-brand-700"
          >
            🎯 今すぐ診断する（無料）→
          </Link>
        </div>
      </div>

      {/* 申請代行禁止バナー */}
      <div className="border-y border-amber-200 bg-amber-50 py-4">
        <p className="mx-auto max-w-2xl px-6 text-center text-sm text-amber-800">
          <strong>このサービスは申請代行ではありません。</strong>
          書類の記入・提出は必ずご自身で行っていただきます。
          最終的な制度の判断は管轄の労働局にご確認ください。
        </p>
      </div>

      {/* 申請の流れ */}
      <div className="mx-auto max-w-2xl px-6 py-10">
        <h2 className="mb-5 text-center text-lg font-bold text-gray-800">診断後は6ステップで完結</h2>
        <div className="grid gap-2">
          {[
            { step: 1, name: "事前診断", desc: "対象か・いくら出るかを確認（まずここから）", highlight: true },
            { step: 2, name: "計画書提出", desc: "受講開始1ヶ月前までに労働局へ" },
            { step: 3, name: "研修受講", desc: "対象従業員が合計10時間以上受講" },
            { step: 4, name: "支給申請", desc: "訓練終了後2ヶ月以内に申請" },
            { step: 5, name: "問い合わせ対応", desc: "労働局からの確認に回答" },
            { step: 6, name: "着金確認", desc: "入金確認で完了" },
          ].map(({ step, name, desc, highlight }) => (
            <div
              key={step}
              className={`flex items-center gap-4 rounded-lg border p-3 ${highlight ? "border-brand-300 bg-brand-50" : "border-gray-200 bg-white"}`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${highlight ? "bg-brand-600" : "bg-gray-400"}`}
              >
                {step}
              </span>
              <div>
                <span className={`font-semibold ${highlight ? "text-brand-700" : "text-gray-700"}`}>{name}</span>
                <span className="ml-2 text-sm text-gray-500">{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 解説動画（下部に配置） */}
      <div className="mx-auto max-w-2xl px-6 pb-10">
        <h2 className="mb-1 text-center text-base font-semibold text-gray-700">制度の詳細を動画で確認</h2>
        <p className="mb-4 text-center text-xs text-gray-500">約10分 / 人材開発支援助成金の仕組みを解説</p>
        <div className="relative w-full overflow-hidden rounded-xl" style={{ paddingBottom: "56.25%" }}>
          <iframe
            className="absolute inset-0 h-full w-full"
            src="https://www.youtube.com/embed/HisOKh8i_64"
            title="人材開発支援助成金 解説動画"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="mt-3 text-center text-xs text-gray-400">
          出典: ホリエモンAI学校FC本部【公式】
        </p>
      </div>

      {/* 下部CTA */}
      <div className="bg-brand-600 py-10">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <p className="mb-2 text-sm text-brand-200">まだ診断していない方は</p>
          <Link
            href="/check"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-bold text-brand-700 shadow transition hover:bg-brand-50"
          >
            🎯 無料で診断する →
          </Link>
          <p className="mt-3 text-xs text-brand-300">登録不要・約2分</p>
          <p className="mt-4 text-xs text-brand-400">
            すでにアカウントをお持ちの方は{" "}
            <a href="/login" className="underline hover:text-brand-200">こちら</a>
          </p>
        </div>
      </div>
    </main>
  );
}
