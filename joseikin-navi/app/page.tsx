import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ===== HERO ===== */}
      <div className="relative overflow-hidden bg-[#0a0a0a]">
        {/* グラデーション背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111827] to-[#1e1b4b] opacity-100" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.15),transparent_60%)]" />

        <div className="relative mx-auto max-w-5xl px-6 pt-12 pb-0">
          <div className="flex flex-col lg:flex-row items-end gap-8">

            {/* 左: テキスト */}
            <div className="flex-1 pb-12">
              {/* ロゴ */}
              <div className="mb-8">
                <Image src="/logo-white.png" alt="ホリエモンAI学校" width={220} height={60} className="h-10 w-auto" />
              </div>

              {/* No.1バッジ */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-yellow-400/40 bg-yellow-400/10 px-4 py-1.5">
                <span className="text-yellow-400 text-sm font-bold">🏆 No.1</span>
                <span className="text-yellow-200 text-xs">法人向け生成AI研修サービス</span>
              </div>

              {/* メインコピー */}
              <h1 className="mb-4 text-4xl font-black leading-tight text-white sm:text-5xl">
                AI研修の費用、<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  最大75%が戻ってきます。
                </span>
              </h1>
              <p className="mb-2 text-lg text-gray-300">
                人材開発支援助成金を活用すれば、<br className="hidden sm:block" />
                ホリエモンAI学校の受講料の大半が助成されます。
              </p>
              <p className="mb-8 text-sm text-gray-500">登録不要・無料・AIが即時診断</p>

              {/* CTA */}
              <Link
                href="/check"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-600"
              >
                🎯 自社が対象か2分で診断する →
              </Link>
              <p className="mt-3 text-xs text-gray-500">登録不要・完全無料</p>

              {/* 実績数字 */}
              <div className="mt-10 flex flex-wrap gap-8">
                <div>
                  <p className="text-3xl font-black text-white">400<span className="text-lg">社</span></p>
                  <p className="text-xs text-gray-400">受講企業数</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-white">4,000<span className="text-lg">名</span></p>
                  <p className="text-xs text-gray-400">受講人数</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-indigo-400">75<span className="text-lg">%</span></p>
                  <p className="text-xs text-gray-400">中小企業の助成率</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-indigo-400">24<span className="text-lg">万円</span></p>
                  <p className="text-xs text-gray-400">1人あたり年間上限</p>
                </div>
              </div>
            </div>

            {/* 右: 堀江さん写真 */}
            <div className="flex-shrink-0 lg:w-72 xl:w-80 flex justify-center lg:justify-end">
              <Image
                src="/horiemon.png"
                alt="堀江貴文"
                width={320}
                height={480}
                className="w-56 lg:w-72 xl:w-80 object-contain drop-shadow-2xl"
                priority
              />
            </div>

          </div>
        </div>

        {/* No.1 注釈 */}
        <div className="relative border-t border-white/5 bg-black/20">
          <p className="mx-auto max-w-5xl px-6 py-2 text-[10px] text-gray-600">
            ※「法人向け生成AI研修サービス」に関する市場調査《No.1検証調査》（㈱未来トレンド研究機構 調べ）※2025年11月10日時点
          </p>
        </div>
      </div>

      {/* ===== 申請代行禁止バナー ===== */}
      <div className="border-b border-amber-200 bg-amber-50 py-3">
        <p className="mx-auto max-w-3xl px-6 text-center text-sm text-amber-800">
          <strong>このサービスは申請代行ではありません。</strong>
          書類の記入・提出は必ずご自身で行っていただきます。最終的な判断は管轄の労働局にご確認ください。
        </p>
      </div>

      {/* ===== こんな方に ===== */}
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h2 className="mb-2 text-center text-2xl font-black text-gray-900">こんな方にぴったりです</h2>
        <p className="mb-8 text-center text-sm text-gray-500">ホリエモンAI学校の受講を検討中の企業様へ</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: "💭", text: "受講を検討中だが、費用負担が気になる" },
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
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-600"
          >
            🎯 今すぐ無料診断する →
          </Link>
        </div>
      </div>

      {/* ===== 数字3つ ===== */}
      <div className="bg-gray-50 border-y border-gray-200">
        <div className="mx-auto grid max-w-3xl grid-cols-3 divide-x divide-gray-200">
          <div className="px-4 py-6 text-center">
            <p className="text-3xl font-black text-indigo-600">75%</p>
            <p className="mt-1 text-xs text-gray-500">中小企業の助成率</p>
          </div>
          <div className="px-4 py-6 text-center">
            <p className="text-3xl font-black text-indigo-600">24万円</p>
            <p className="mt-1 text-xs text-gray-500">1人あたり年間上限</p>
          </div>
          <div className="px-4 py-6 text-center">
            <p className="text-3xl font-black text-indigo-600">R8年度</p>
            <p className="mt-1 text-xs text-gray-500">制度の終了期限</p>
          </div>
        </div>
      </div>

      {/* ===== 申請の流れ ===== */}
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h2 className="mb-2 text-center text-2xl font-black text-gray-900">診断後は6ステップで完結</h2>
        <p className="mb-8 text-center text-sm text-gray-500">このナビに沿って進めるだけで申請まで辿り着けます</p>
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
              className={`flex items-center gap-4 rounded-lg border p-3 ${highlight ? "border-indigo-300 bg-indigo-50" : "border-gray-200 bg-white"}`}
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${highlight ? "bg-indigo-500" : "bg-gray-400"}`}>
                {step}
              </span>
              <div>
                <span className={`font-semibold ${highlight ? "text-indigo-700" : "text-gray-700"}`}>{name}</span>
                <span className="ml-2 text-sm text-gray-500">{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 解説動画 ===== */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <h2 className="mb-1 text-center text-base font-semibold text-gray-700">制度の詳細を動画で確認</h2>
          <p className="mb-4 text-center text-xs text-gray-500">約10分 / 人材開発支援助成金の仕組みを解説</p>
          <div className="relative w-full overflow-hidden rounded-xl shadow-lg" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 h-full w-full"
              src="https://www.youtube.com/embed/HisOKh8i_64"
              title="人材開発支援助成金 解説動画"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="mt-3 text-center text-xs text-gray-400">出典: ホリエモンAI学校FC本部【公式】</p>
        </div>
      </div>

      {/* ===== 下部CTA ===== */}
      <div className="bg-[#0a0a0a] py-14">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Image src="/logo-white.png" alt="ホリエモンAI学校" width={160} height={44} className="mx-auto mb-6 h-8 w-auto opacity-80" />
          <p className="mb-2 text-sm text-gray-400">まだ診断していない方は</p>
          <Link
            href="/check"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-600"
          >
            🎯 無料で診断する →
          </Link>
          <p className="mt-3 text-xs text-gray-600">登録不要・約2分</p>
          <p className="mt-4 text-xs text-gray-700">
            すでにアカウントをお持ちの方は{" "}
            <a href="/login" className="underline hover:text-gray-400">こちら</a>
          </p>
        </div>
      </div>
    </main>
  );
}
