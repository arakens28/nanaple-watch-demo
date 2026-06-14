"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PREFECTURE_LIST, getBureauByPrefecture } from "@/lib/bureauData";

type Answers = Record<string, string>;
type Diagnosis = { level: "高" | "中" | "低"; reason: string; advice: string };

const INELIGIBLE_LIST = ["社長・代表者", "役員", "業務委託・個人事業主", "雇用保険未加入の方"];

const LEVEL_STYLES: Record<Diagnosis["level"], { badge: string; border: string; icon: string }> = {
  高: { badge: "bg-green-100 text-green-800", border: "border-green-300 bg-green-50", icon: "✅" },
  中: { badge: "bg-yellow-100 text-yellow-800", border: "border-yellow-300 bg-yellow-50", icon: "⚠️" },
  低: { badge: "bg-red-100 text-red-800", border: "border-red-300 bg-red-50", icon: "❌" },
};

function calcDeadline(startDate: string): string {
  if (!startDate) return "";
  const [y, m, d] = startDate.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setMonth(date.getMonth() - 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatJP(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  return `${y}年${m}月${d}日`;
}

function calcSubsidy(traineeCount: string, employees: string): { total: number; perPerson: number; isSME: boolean } | null {
  const count = parseInt(traineeCount, 10);
  if (isNaN(count) || count <= 0) return null;
  const isSME = employees !== "100名以上";
  const perPerson = isSME ? 240000 : 204600;
  return { total: count * perPerson, perPerson, isSME };
}

const REQUIRED_KEYS = ["insurance", "startDate", "traineeCount", "itTraining", "employees"];

const KEY_LABELS: Record<string, string> = {
  insurance: "雇用保険の加入状況",
  startDate: "受講開始予定日",
  traineeCount: "受講人数",
  itTraining: "研修内容",
  employees: "会社の従業員数",
};

export default function CheckPage() {
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<Diagnosis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (result) {
      setTimeout(() => {
        document.getElementById("check-result")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [result]);

  function setAnswer(key: string, value: string) {
    setAnswers((a) => ({ ...a, [key]: value }));
  }

  const deadline = calcDeadline(answers.startDate ?? "");
  const allAnswered = REQUIRED_KEYS.every((k) => answers[k]);
  const missingItems = REQUIRED_KEYS.filter((k) => !answers[k]).map((k) => KEY_LABELS[k]);

  const bureau = answers.prefecture ? getBureauByPrefecture(answers.prefecture) : null;
  const subsidyEstimate =
    answers.traineeCount && answers.employees
      ? calcSubsidy(answers.traineeCount, answers.employees)
      : null;

  async function diagnose() {
    if (!allAnswered) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/diagnose-public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as Diagnosis;
      setResult(data);
      if (typeof window !== "undefined") {
        localStorage.setItem("pending_check_result", JSON.stringify({ answers }));
      }
    } catch {
      setError("診断に失敗しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
          <div>
            <Link href="/" className="text-sm font-bold text-brand-700">
              助成金ナビ
            </Link>
            <span className="ml-2 text-xs text-gray-400">ホリエモンAI学校受講企業向け</span>
          </div>
          <Link href="/login" className="text-xs text-gray-500 underline hover:text-gray-700">
            ログイン
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-6">
          <p className="mb-1 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
            ゲスト診断（無料・登録不要）
          </p>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            助成金の受給可能性を診断する
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            人材開発支援助成金（事業展開等リスキリング支援コース・定額制訓練）の対象かどうかを確認できます
          </p>
        </div>

        {/* 申請代行禁止 */}
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-xs text-amber-800">
            <strong>このサービスは申請代行ではありません。</strong>
            診断はAIによる目安です。最終的な判断は管轄の労働局にご確認ください。
          </p>
        </div>

        {/* 対象外の方 */}
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="mb-2 text-sm font-bold text-red-800">⚠️ 次の方は助成金の対象外です</p>
          <div className="flex flex-wrap gap-2">
            {INELIGIBLE_LIST.map((item) => (
              <span key={item} className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="card space-y-7">
          {/* Q1: 雇用保険 */}
          <fieldset>
            <legend className="mb-1 text-sm font-semibold">
              Q1. 受講させたい従業員は雇用保険に加入していますか？
            </legend>
            <p className="mb-2 text-xs text-gray-500">雇用保険番号（被保険者番号）を持っている方が対象です</p>
            <div className="flex flex-wrap gap-2">
              {["はい", "いいえ", "わからない"].map((opt) => (
                <label
                  key={opt}
                  className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm transition ${
                    answers.insurance === opt
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:border-brand-400"
                  }`}
                >
                  <input type="radio" name="insurance" value={opt} checked={answers.insurance === opt} onChange={() => setAnswer("insurance", opt)} className="sr-only" />
                  {opt}
                </label>
              ))}
            </div>
            {answers.insurance === "いいえ" && (
              <div className="mt-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <strong>対象外の可能性が高いです。</strong>雇用保険に未加入の場合、この助成金は受給できません。
              </div>
            )}
          </fieldset>

          {/* Q2: 受講開始日 */}
          <fieldset>
            <legend className="mb-1 text-sm font-semibold">Q2. 受講開始予定日はいつですか？</legend>
            <p className="mb-2 text-xs text-gray-500">入力すると計画書の提出期限を自動計算します</p>
            <input
              type="date"
              className="input max-w-xs"
              value={answers.startDate ?? ""}
              onChange={(e) => setAnswer("startDate", e.target.value)}
            />
            {deadline && (
              <div className="mt-3 rounded-lg border-2 border-amber-400 bg-amber-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-amber-600 mb-1">
                  計画書の提出期限（自動計算・制度上の固定ルール）
                </p>
                <p className="text-xl font-bold text-red-700">{formatJP(deadline)} までに労働局必着</p>
                <p className="mt-1 text-sm text-amber-800">
                  受講開始 {formatJP(answers.startDate)} の <strong>1ヶ月前</strong> です。
                </p>
              </div>
            )}
          </fieldset>

          {/* Q3: 受講人数（数値直接入力） */}
          <fieldset>
            <legend className="mb-1 text-sm font-semibold">Q3. 受講させたい従業員は何名ですか？</legend>
            <p className="mb-2 text-xs text-gray-500">社長・役員を除いた、雇用保険加入の従業員のみ</p>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max="300"
                className="input w-28"
                placeholder="例: 5"
                value={answers.traineeCount ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "" || (parseInt(v, 10) >= 1 && parseInt(v, 10) <= 300)) {
                    setAnswer("traineeCount", v);
                  }
                }}
              />
              <span className="text-sm text-gray-500">名</span>
            </div>
            {subsidyEstimate && (
              <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3">
                <p className="text-xs text-green-600">助成金試算（制度上の上限額・確定ではありません）</p>
                <p className="text-lg font-bold text-green-800 mt-0.5">
                  最大 {subsidyEstimate.total.toLocaleString()}円/年 の助成が見込まれます
                </p>
                <p className="text-xs text-green-600 mt-0.5">
                  {answers.traineeCount}名 × {subsidyEstimate.perPerson.toLocaleString()}円/年
                  （{subsidyEstimate.isSME ? "中小企業: 月2万円/人上限フル適用" : "大企業: 税込受講料×60%"}）
                </p>
              </div>
            )}
          </fieldset>

          {/* Q4: IT研修か */}
          <fieldset>
            <legend className="mb-1 text-sm font-semibold">Q4. 研修内容はAI・IT・デジタル分野ですか？</legend>
            <p className="mb-2 text-xs text-gray-500">AI活用、プログラミング、DX、デジタルマーケティング等が該当します</p>
            <div className="flex flex-wrap gap-2">
              {["はい", "いいえ", "わからない"].map((opt) => (
                <label
                  key={opt}
                  className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm transition ${
                    answers.itTraining === opt
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:border-brand-400"
                  }`}
                >
                  <input type="radio" name="itTraining" value={opt} checked={answers.itTraining === opt} onChange={() => setAnswer("itTraining", opt)} className="sr-only" />
                  {opt}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Q5: 従業員数 */}
          <fieldset>
            <legend className="mb-1 text-sm font-semibold">Q5. 会社の従業員数（正規雇用）は何名ですか？</legend>
            <div className="flex flex-wrap gap-2">
              {["1〜9名", "10〜99名", "100名以上"].map((opt) => (
                <label
                  key={opt}
                  className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm transition ${
                    answers.employees === opt
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:border-brand-400"
                  }`}
                >
                  <input type="radio" name="employees" value={opt} checked={answers.employees === opt} onChange={() => setAnswer("employees", opt)} className="sr-only" />
                  {opt}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Q6: 都道府県（任意） */}
          <fieldset>
            <legend className="mb-1 text-sm font-semibold">Q6. 会社の所在地（任意）</legend>
            <p className="mb-2 text-xs text-gray-500">管轄労働局の連絡先を表示します</p>
            <select
              className="input max-w-xs"
              value={answers.prefecture ?? ""}
              onChange={(e) => setAnswer("prefecture", e.target.value)}
            >
              <option value="">都道府県を選択...</option>
              {PREFECTURE_LIST.map((pref) => (
                <option key={pref} value={pref}>{pref}</option>
              ))}
            </select>
            {bureau && (
              <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <p className="text-xs text-gray-600">
                  管轄: <strong>{bureau.name}</strong>（{bureau.division}）
                  <span className="ml-2 font-mono">{bureau.phone}</span>
                </p>
              </div>
            )}
          </fieldset>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            {result ? (
              <div className="space-y-2">
                <button
                  onClick={() => document.getElementById("check-result")?.scrollIntoView({ behavior: "smooth" })}
                  className="btn-primary w-full"
                >
                  診断結果を確認する ↓
                </button>
                <button
                  onClick={() => setResult(null)}
                  className="btn-secondary w-full text-xs"
                >
                  回答を変えて再診断する
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={diagnose}
                  disabled={!allAnswered || loading}
                  className="btn-primary w-full"
                >
                  {loading ? "AIが診断中..." : "診断結果を見る"}
                </button>
                {!allAnswered && missingItems.length > 0 && (
                  <p className="mt-1.5 text-xs text-amber-600">
                    ▲ 未入力: {missingItems.join("・")}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* 診断結果 */}
        {result && (
          <div id="check-result" className={`mt-6 card border-2 space-y-4 ${LEVEL_STYLES[result.level].border}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{LEVEL_STYLES[result.level].icon}</span>
              <div>
                <h2 className="text-lg font-bold">診断結果</h2>
                <span className={`rounded-full px-3 py-0.5 text-sm font-bold ${LEVEL_STYLES[result.level].badge}`}>
                  受給可能性: {result.level}
                </span>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-gray-700">{result.reason}</p>

            {/* 助成金試算（受給可能性が高・中の場合） */}
            {result.level !== "低" && subsidyEstimate && (
              <div className="rounded-xl border-2 border-green-400 bg-green-50 p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-wide text-green-600 mb-2">
                  助成金試算（制度上の上限額・確定ではありません）
                </p>
                <p className="text-4xl font-bold text-green-800">
                  {subsidyEstimate.total.toLocaleString()}円
                </p>
                <p className="text-base font-semibold text-green-700 mt-1">年間の助成額（見込み）</p>
                <p className="text-xs text-green-600 mt-2">
                  {answers.traineeCount}名 × {subsidyEstimate.perPerson.toLocaleString()}円/年
                  （{subsidyEstimate.isSME
                    ? "中小企業: 受講料75%・月2万円/人の上限フル適用"
                    : "大企業: 税込受講料×60%"}）
                </p>
              </div>
            )}

            {deadline && (
              <div className="rounded-lg border border-red-300 bg-red-50 p-4">
                <p className="text-xs font-bold text-red-600 mb-1">
                  重要：計画書の提出期限（制度上の固定ルール・AI生成ではありません）
                </p>
                <p className="text-lg font-bold text-red-800">
                  {formatJP(deadline)} までに労働局必着
                </p>
                <p className="text-xs text-red-600 mt-1">
                  受講開始 {formatJP(answers.startDate)} の1ヶ月前です。
                </p>
              </div>
            )}

            <div className="rounded-lg bg-brand-50 p-4">
              <h3 className="mb-1 text-sm font-semibold text-brand-700">次のステップへのアドバイス</h3>
              <p className="text-sm leading-relaxed text-gray-700">{result.advice}</p>
            </div>

            {/* CTA1: 申請をステップ管理する（メイン） */}
            <div className="rounded-xl border-2 border-brand-600 bg-brand-600 p-5 text-center text-white">
              <p className="text-xs font-semibold text-brand-200 mb-1">無料アカウントで申請を最後まで管理</p>
              <p className="text-lg font-bold mb-3">書類チェック・期限管理・AIサポート</p>
              <Link
                href="/signup"
                className="inline-block rounded-full bg-white px-6 py-2 text-sm font-bold text-brand-700 transition hover:bg-brand-50"
              >
                無料でアカウント作成 →
              </Link>
            </div>

            {/* CTA2: ホリエモンAI学校（サブ） */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-center">
              <p className="text-xs text-gray-500 mb-1">ホリエモンAI学校は定額制IT研修として助成金の対象になります</p>
              <p className="text-sm font-semibold text-gray-700 mb-3">受講のご相談はこちら</p>
              <a
                href="https://horiemon.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full border border-gray-300 bg-white px-6 py-2 text-sm font-bold text-gray-700 transition hover:border-brand-400 hover:text-brand-700"
              >
                ホリエモンAI学校を見る →
              </a>
            </div>

            <p className="text-center text-xs leading-relaxed text-gray-400">
              このサービスは申請代行ではありません。最終的な制度の判断は管轄の労働局にご確認ください。
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
