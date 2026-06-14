import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ===== HERO ===== */}
      <div className="relative overflow-hidden bg-[#FFD600] min-h-[88vh] flex flex-col">
        <div className="relative mx-auto w-full max-w-5xl px-6 pt-8 flex-1 flex flex-col">

          {/* ロゴ */}
          <div className="mb-6">
            <Image src="/logo-black.png" alt="ホリエモンAI学校" width={180} height={48} className="h-9 w-auto" />
          </div>

          {/* メインコンテンツ */}
          <div className="flex flex-1 flex-col lg:flex-row items-center lg:items-end gap-4">

            {/* 左: テキスト */}
            <div className="flex-1 pb-10 lg:pb-16">
              {/* No.1バッジ画像 */}
              <div className="mb-4 flex items-center gap-4">
                <Image src="/no1.png" alt="法人向け生成AI研修サービス No.1" width={100} height={100} className="h-24 w-24 object-contain" />
                <div>
                  <p className="text-xs font-bold text-gray-700">法人向け生成AI研修サービス</p>
                  <p className="text-xs text-gray-600">満足度No.1獲得</p>
                </div>
              </div>

              {/* メインコピー */}
              <h1 className="mb-4 text-4xl font-black leading-tight text-gray-900 sm:text-5xl">
                AI研修の費用、<br />
                最大<span className="text-5xl sm:text-6xl">75%</span>が<br />
                戻ってきます。
              </h1>
              <p className="mb-6 text-sm font-medium text-gray-700">
                人材開発支援助成金を活用すれば、ホリエモンAI学校の<br className="hidden sm:block" />受講料の大半が助成されます。
              </p>

              {/* CTA */}
              <Link
                href="/check"
                className="inline-flex items-center gap-3 rounded-2xl bg-gray-900 px-7 py-4 text-lg font-black text-white shadow-xl transition hover:bg-gray-700"
              >
                🎯 自社が対象か2分で診断する
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFD600] text-gray-900 text-sm font-black">→</span>
              </Link>
              <p className="mt-2 text-xs text-gray-600">登録不要・完全無料</p>

              {/* 実績数字 */}
              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  { num: "400社", label: "受講企業数" },
                  { num: "4,000名", label: "受講人数" },
                  { num: "75%", label: "中小企業助成率" },
                  { num: "24万円", label: "1人あたり年間上限" },
                ].map(({ num, label }) => (
                  <div key={label} className="rounded-xl bg-black/10 px-4 py-2.5 text-center">
                    <p className="text-xl font-black text-gray-900">{num}</p>
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
                width={400}
                height={600}
                className="w-56 sm:w-72 lg:w-80 xl:w-96 object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* No.1 注釈 */}
        <div className="bg-black/10 border-t border-black/10">
          <p className="mx-auto max-w-5xl px-6 py-1.5 text-[10px] text-gray-600">
            ※「法人向け生成AI研修サービス」に関する市場調査《No.1検証調査》満足度No.1獲得（㈱未来トレンド研究機構 調べ）※2025年11月10日時点
          </p>
        </div>
      </div>

      {/* ===== 申請代行禁止バナー ===== */}
      <div className="border-b border-amber-200 bg-amber-50 py-2.5">
        <p className="mx-auto max-w-3xl px-6 text-center text-xs text-amber-800">
          <strong>このサービスは申請代行ではありません。</strong>書類の記入・提出は必ずご自身で行っていただきます。最終的な判断は管轄の労働局にご確認ください。
        </p>
      </div>

      {/* ===== こんな方に + 申請の流れ（2カラム） ===== */}
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid gap-10 lg:grid-cols-2">

          {/* こんな方に */}
          <div>
            <h2 className="mb-4 text-xl font-black text-gray-900">こんな方にぴったりです</h2>
            <div className="grid gap-2">
              {[
                { icon: "💭", text: "受講を検討中だが、費用負担が気になる" },
                { icon: "📋", text: "助成金を使いたいが、何から始めれば良いか分からない" },
                { icon: "💼", text: "社労士に頼むほどじゃないが、自社で申請できるか確認したい" },
                { icon: "⏰", text: "受講前に計画書の締め切りをすぐに把握しておきたい" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                  <span className="shrink-0 text-lg">{icon}</span>
                  <p className="text-sm text-gray-700">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 申請の流れ */}
          <div>
            <h2 className="mb-4 text-xl font-black text-gray-900">診断後は6ステップで完結</h2>
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
                  <div className="flex items-baseline gap-2">
                    <span className={`text-sm font-semibold ${highlight ? "text-gray-900" : "text-gray-700"}`}>{name}</span>
                    <span className="text-xs text-gray-500">{desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/check" className="inline-flex items-center gap-3 rounded-2xl bg-gray-900 px-8 py-3.5 text-base font-black text-white shadow-lg transition hover:bg-gray-700">
            🎯 今すぐ無料診断する
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFD600] text-gray-900 text-xs font-black">→</span>
          </Link>
        </div>
      </div>

      {/* ===== 解説動画 ===== */}
      <div className="bg-gray-50 border-y border-gray-200 py-10">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="mb-1 text-center text-base font-semibold text-gray-700">制度の詳細を動画で確認</h2>
          <p className="mb-4 text-center text-xs text-gray-500">約10分 / 人材開発支援助成金の仕組みを解説</p>
          <div className="relative w-full overflow-hidden rounded-xl shadow-lg" style={{ paddingBottom: "56.25%" }}>
            <iframe className="absolute inset-0 h-full w-full" src="https://www.youtube.com/embed/HisOKh8i_64" title="人材開発支援助成金 解説動画" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        </div>
      </div>

      {/* ===== 下部CTA ===== */}
      <div className="bg-[#FFD600] py-12">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Image src="/logo-black.png" alt="ホリエモンAI学校" width={150} height={40} className="mx-auto mb-5 h-8 w-auto" />
          <Link href="/check" className="inline-flex items-center gap-3 rounded-2xl bg-gray-900 px-8 py-4 text-lg font-black text-white shadow-xl transition hover:bg-gray-700">
            🎯 無料で診断する
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFD600] text-gray-900 text-sm font-black">→</span>
          </Link>
          <p className="mt-3 text-xs text-gray-600">登録不要・約2分</p>
          <p className="mt-3 text-xs text-gray-600">
            すでにアカウントをお持ちの方は <a href="/login" className="underline hover:text-gray-900">こちら</a>
          </p>
        </div>
      </div>
    </main>
  );
}
