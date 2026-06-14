import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ===== HERO ===== */}
      <div className="relative overflow-hidden bg-[#FFD600]">
        {/* 背景の装飾円 */}
        <div className="absolute top-[-60px] right-[-60px] h-64 w-64 rounded-full bg-yellow-300/50" />
        <div className="absolute bottom-[-40px] left-[20%] h-40 w-40 rounded-full bg-yellow-300/30" />

        <div className="relative mx-auto max-w-5xl px-6 pt-10 pb-0">
          {/* ロゴ */}
          <div className="mb-6">
            <Image src="/logo-black.png" alt="ホリエモンAI学校" width={200} height={54} className="h-10 w-auto" />
          </div>

          <div className="flex flex-col lg:flex-row items-end gap-0">
            {/* 左: テキスト */}
            <div className="flex-1 pb-12">
              {/* No.1バッジ */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-black px-4 py-1.5">
                <span className="text-yellow-400 text-sm font-black">🏆 No.1</span>
                <span className="text-white text-xs font-medium">法人向け生成AI研修サービス</span>
              </div>

              {/* メインコピー */}
              <h1 className="mb-4 text-4xl font-black leading-tight text-gray-900 sm:text-5xl">
                AI研修の費用、<br />
                最大<span className="text-5xl sm:text-6xl underline decoration-black/20 decoration-4">75%</span>が<br />
                戻ってきます。
              </h1>
              <p className="mb-8 text-base font-medium text-gray-800">
                人材開発支援助成金を活用すれば、<br />
                ホリエモンAI学校の受講料の大半が助成されます。<br />
                <span className="text-sm font-normal text-gray-600">登録不要・無料・AIが即時診断</span>
              </p>

              {/* CTA */}
              <Link
                href="/check"
                className="inline-flex items-center gap-3 rounded-2xl bg-gray-900 px-8 py-4 text-lg font-black text-white shadow-xl transition hover:bg-gray-700"
              >
                🎯 自社が対象か2分で診断する
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400 text-gray-900 text-sm font-black">→</span>
              </Link>
              <p className="mt-3 text-xs text-gray-600">登録不要・完全無料</p>

              {/* 実績数字 */}
              <div className="mt-10 flex flex-wrap gap-6">
                {[
                  { num: "400社", label: "受講企業数" },
                  { num: "4,000名", label: "受講人数" },
                  { num: "24万円", label: "1人あたり年間上限" },
                ].map(({ num, label }) => (
                  <div key={label} className="rounded-xl bg-black/10 px-4 py-3 text-center">
                    <p className="text-2xl font-black text-gray-900">{num}</p>
                    <p className="text-xs text-gray-700">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 右: 堀江さん写真 */}
            <div className="flex-shrink-0 lg:w-80 xl:w-96 flex justify-center lg:justify-end self-end">
              <Image
                src="/horiemon.png"
                alt="堀江貴文"
                width={384}
                height={576}
                className="w-64 lg:w-80 xl:w-96 object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* No.1 注釈 */}
        <div className="bg-yellow-500/30 border-t border-black/10">
          <p className="mx-auto max-w-5xl px-6 py-1.5 text-[10px] text-gray-600">
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

      {/* ===== 数字3つ ===== */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto grid max-w-3xl grid-cols-3 divide-x divide-gray-200">
          <div className="px-4 py-6 text-center">
            <p className="text-3xl font-black text-gray-900">75%</p>
            <p className="mt-1 text-xs text-gray-500">中小企業の助成率</p>
          </div>
          <div className="px-4 py-6 text-center">
            <p className="text-3xl font-black text-gray-900">24万円</p>
            <p className="mt-1 text-xs text-gray-500">1人あたり年間上限</p>
          </div>
          <div className="px-4 py-6 text-center">
            <p className="text-3xl font-black text-gray-900">R8年度</p>
            <p className="mt-1 text-xs text-gray-500">制度の終了期限</p>
          </div>
        </div>
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
            className="inline-flex items-center gap-3 rounded-2xl bg-gray-900 px-8 py-3.5 text-base font-black text-white shadow-lg transition hover:bg-gray-700"
          >
            🎯 今すぐ無料診断する
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-gray-900 text-xs font-black">→</span>
          </Link>
        </div>
      </div>

      {/* ===== 申請の流れ ===== */}
      <div className="bg-gray-50 border-y border-gray-200">
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
                className={`flex items-center gap-4 rounded-lg border p-3 ${highlight ? "border-yellow-400 bg-yellow-50" : "border-gray-200 bg-white"}`}
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${highlight ? "bg-gray-900" : "bg-gray-400"}`}>
                  {step}
                </span>
                <div>
                  <span className={`font-semibold ${highlight ? "text-gray-900" : "text-gray-700"}`}>{name}</span>
                  <span className="ml-2 text-sm text-gray-500">{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== 解説動画 ===== */}
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

      {/* ===== 下部CTA ===== */}
      <div className="bg-[#FFD600] py-14">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Image src="/logo-black.png" alt="ホリエモンAI学校" width={160} height={44} className="mx-auto mb-6 h-8 w-auto" />
          <p className="mb-2 text-sm font-medium text-gray-700">まだ診断していない方は</p>
          <Link
            href="/check"
            className="inline-flex items-center gap-3 rounded-2xl bg-gray-900 px-8 py-4 text-lg font-black text-white shadow-xl transition hover:bg-gray-700"
          >
            🎯 無料で診断する
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400 text-gray-900 text-sm font-black">→</span>
          </Link>
          <p className="mt-3 text-xs text-gray-600">登録不要・約2分</p>
          <p className="mt-4 text-xs text-gray-600">
            すでにアカウントをお持ちの方は{" "}
            <a href="/login" className="underline hover:text-gray-900">こちら</a>
          </p>
        </div>
      </div>
    </main>
  );
}
