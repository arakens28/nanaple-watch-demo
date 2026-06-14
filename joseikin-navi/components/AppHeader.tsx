"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useState } from "react";

const BUREAU_PHONE = "054-275-3010";

const BUREAU_QUESTIONS = [
  "受講予定者は雇用保険加入者ですが、この助成金の対象になりますか？",
  "ホリエモンAI学校のような定額制IT研修は対象になりますか？",
  "○月○日受講開始の場合、計画書の必着日はその1ヶ月前（○月○日）でよいですか？",
  "支給申請は受講後にどの書類が必要ですか？",
];

export default function AppHeader() {
  const router = useRouter();
  const [bureauOpen, setBureauOpen] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  function copyQuestion(text: string, index: number) {
    void navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/dashboard" className="font-bold text-brand-700">
            助成金ナビ
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setBureauOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1.5 text-sm font-bold text-white transition hover:bg-amber-600"
            >
              <span aria-hidden>📞</span>
              <span className="hidden sm:inline">困ったら労働局に確認</span>
              <span className="sm:hidden">労働局</span>
            </button>
            <button
              onClick={logout}
              className="text-sm text-gray-500 hover:text-gray-800"
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>

      {/* 労働局モーダル */}
      {bureauOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setBureauOpen(false);
          }}
        >
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            {/* モーダルヘッダー */}
            <div className="flex items-center justify-between bg-amber-500 px-6 py-4">
              <div>
                <p className="text-xs font-semibold text-amber-100">助成金お問い合わせ窓口</p>
                <h2 className="text-lg font-bold text-white">困ったら労働局に確認</h2>
              </div>
              <button
                onClick={() => setBureauOpen(false)}
                className="text-2xl text-amber-100 hover:text-white"
                aria-label="閉じる"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* 連絡先 */}
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-bold text-amber-900 leading-snug mb-3">
                  静岡労働局 職業安定部<br />
                  職業対策課 助成金センター
                </p>
                <a
                  href={`tel:${BUREAU_PHONE}`}
                  className="flex items-center gap-2 text-2xl font-bold text-amber-700 hover:text-amber-900 transition"
                >
                  <span aria-hidden>📞</span>
                  {BUREAU_PHONE}
                </a>
                <p className="mt-1.5 text-xs text-amber-600">
                  平日 8:30〜17:15（昼休み 12:15〜13:00）
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  〒420-0853 静岡市葵区追手町8-1 日土地静岡ビル4階
                </p>
              </div>

              {/* 質問テンプレ */}
              <div>
                <p className="mb-2 text-sm font-semibold text-gray-700">
                  こう聞くとスムーズです（タップでコピー）
                </p>
                <ul className="space-y-2">
                  {BUREAU_QUESTIONS.map((q, i) => (
                    <li key={i}>
                      <button
                        onClick={() => copyQuestion(q, i)}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-left text-xs text-gray-700 leading-relaxed hover:bg-gray-100 transition"
                      >
                        <span className="block text-gray-400 text-[10px] mb-0.5">
                          {copied === i ? "✓ コピーしました" : "タップでコピー"}
                        </span>
                        「{q}」
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed">
                最終的な制度の判断は必ず労働局にご確認ください。
                このサービスは情報提供・整理のみ行い、申請代行は行いません。
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
