import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ===== ナビゲーションバー（白） ===== */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <Image src="/logo-black.png" alt="ホリエモンAI学校" width={160} height={44} className="h-8 w-auto" />
          <a href="/login" className="rounded-lg border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
            ログイン
          </a>
        </div>
      </header>

      {/* ===== ヒーロー（黄色・コンパクト） ===== */}
      <section className="relative overflow-hidden bg-[#FFD600]">
        <div className="mx-auto max-w-5xl px-5">
          <div className="relative flex items-center py-10 sm:py-12">

            {/* 左: テキスト＋CTA */}
            <div className="w-full sm:w-3/5 pr-4 sm:pr-0">
              <h1 className="mb-3 text-3xl font-black leading-tight text-gray-900 sm:text-4xl md:text-5xl">
                AI研修の費用、<br />
                最大<span className="text-4xl sm:text-5xl md:text-6xl">75%</span>が<br />
                戻ってきます。
              </h1>
              <p className="mb-5 text-sm text-gray-800 sm:text-base">
                人材開発支援助成金を活用すれば、<br className="hidden sm:block" />
                ホリエモンAI学校の受講料の大半が助成されます。
              </p>
              <Link
                href="/check"
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3.5 text-sm font-black text-white shadow-lg transition hover:bg-gray-700 sm:text-base sm:px-7 sm:py-4"
              >
                🎯 自社が対象か2分で診断する →
              </Link>
              <p className="mt-2 text-xs text-gray-600">登録不要・完全無料</p>
            </div>

            {/* 右: 堀江さん写真（絶対配置） */}
            <div className="absolute right-0 top-0 w-40 sm:w-56 md:w-64 lg:w-72 pointer-events-none select-none">
              <Image
                src="/horiemon.png"
                alt="堀江貴文"
                width={288}
                height={432}
                className="w-full object-contain object-bottom"
                priority
              />
            </div>
          </div>
        </div>
        {/* 注釈 */}
        <div className="border-t border-black/10 bg-black/5">
          <p className="mx-auto max-w-5xl px-5 py-1 text-[10px] text-gray-600">
            ※「法人向け生成AI研修サービス」に関する市場調査《No.1検証調査》満足度No.1獲得（㈱未来トレンド研究機構 調べ）※2025年11月10日時点
          </p>
        </div>
      </section>

      {/* ===== 実績＋No.1（白背景） ===== */}
      <section className="border-b border-gray-100 bg-white py-8">
        <div className="mx-auto max-w-5xl px-5">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* No.1バッジ */}
            <div className="flex items-center gap-3">
              <Image src="/no1.png" alt="No.1" width={80} height={80} className="h-20 w-20 object-contain" />
              <div>
                <p className="text-sm font-black text-gray-900">法人向け生成AI研修サービス</p>
                <p className="text-sm font-bold text-gray-700">満足度 No.1 獲得</p>
              </div>
            </div>
            {/* 実績数字 */}
            <div className="grid grid-cols-4 gap-4 sm:gap-8">
              {[
                { num: "400社", label: "受講企業数" },
                { num: "4,000名", label: "受講人数" },
                { num: "75%", label: "中小企業助成率" },
                { num: "24万円", label: "1人あたり年間上限" },
              ].map(({ num, label }) => (
                <div key={label} className="text-center">
                  <p className="text-xl font-black text-gray-900 sm:text-2xl">{num}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 申請代行禁止バナー ===== */}
      <div className="border-b border-amber-200 bg-amber-50 py-2">
        <p className="mx-auto max-w-5xl px-5 text-center text-xs text-amber-800">
          <strong>このサービスは申請代行ではありません。</strong>書類の記入・提出は必ずご自身で行っていただきます。最終的な判断は管轄の労働局にご確認ください。
        </p>
      </div>

      {/* ===== こんな方に ＋ 6ステップ（2カラム） ===== */}
      <section className="bg-gray-50 py-10">
        <div className="mx-auto max-w-5xl px-5">
          <div className="grid gap-8 md:grid-cols-2">

            {/* こんな方に */}
            <div>
              <h2 className="mb-4 text-lg font-black text-gray-900">こんな方にぴったりです</h2>
              <div className="grid gap-2">
                {[
                  { icon: "💭", text: "受講を検討中だが、費用負担が気になる" },
                  { icon: "📋", text: "助成金を使いたいが、何から始めれば良いか分からない" },
                  { icon: "💼", text: "社労士に頼むほどじゃないが、自社で申請できるか確認したい" },
                  { icon: "⏰", text: "受講前に計画書の締め切りをすぐ把握しておきたい" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex gap-3 rounded-xl bg-white border border-gray-200 p-3 shadow-sm">
                    <span className="text-lg">{icon}</span>
                    <p className="text-sm text-gray-700">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 6ステップ */}
            <div>
              <h2 className="mb-4 text-lg font-black text-gray-900">診断後は6ステップで完結</h2>
              <div className="grid gap-1.5">
                {[
                  { step: 1, name: "事前診断", desc: "対象か・いくら出るかを確認", highlight: true },
                  { step: 2, name: "計画書提出", desc: "受講開始1ヶ月前までに労働局へ" },
                  { step: 3, name: "研修受講", desc: "対象従業員が10時間以上受講" },
                  { step: 4, name: "支給申請", desc: "訓練終了後2ヶ月以内に申請" },
                  { step: 5, name: "問い合わせ対応", desc: "労働局からの確認に回答" },
                  { step: 6, name: "着金確認", desc: "入金確認で完了" },
                ].map(({ step, name, desc, highlight }) => (
                  <div key={step} className={`flex items-center gap-3 rounded-lg border p-2.5 ${highlight ? "border-yellow-400 bg-yellow-50" : "border-gray-200 bg-white"}`}>
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${highlight ? "bg-gray-900" : "bg-gray-400"}`}>{step}</span>
                    <span className={`text-sm font-semibold ${highlight ? "text-gray-900" : "text-gray-700"}`}>{name}</span>
                    <span className="text-xs text-gray-500">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/check" className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-8 py-3.5 text-base font-black text-white shadow-lg transition hover:bg-gray-700">
              🎯 今すぐ無料診断する →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 解説動画 ===== */}
      <section className="bg-white py-10">
        <div className="mx-auto max-w-2xl px-5">
          <h2 className="mb-1 text-center text-base font-semibold text-gray-700">制度の詳細を動画で確認</h2>
          <p className="mb-4 text-center text-xs text-gray-400">約10分 / 人材開発支援助成金の仕組みを解説</p>
          <div className="relative w-full overflow-hidden rounded-xl shadow-lg" style={{ paddingBottom: "56.25%" }}>
            <iframe className="absolute inset-0 h-full w-full" src="https://www.youtube.com/embed/HisOKh8i_64" title="人材開発支援助成金 解説動画" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        </div>
      </section>

      {/* ===== 下部CTA（黄色） ===== */}
      <section className="bg-[#FFD600] py-12">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <Image src="/logo-black.png" alt="ホリエモンAI学校" width={140} height={38} className="mx-auto mb-5 h-7 w-auto" />
          <Link href="/check" className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-8 py-4 text-lg font-black text-white shadow-xl transition hover:bg-gray-700">
            🎯 無料で診断する →
          </Link>
          <p className="mt-3 text-xs text-gray-600">登録不要・約2分</p>
          <p className="mt-3 text-xs text-gray-600">
            すでにアカウントをお持ちの方は <a href="/login" className="underline hover:text-gray-900">こちら</a>
          </p>
        </div>
      </section>

    </main>
  );
}
