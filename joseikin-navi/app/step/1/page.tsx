"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import {
  getOrCreateApplication,
  saveStepNotes,
  completeStep,
  parseNotes,
  type Application,
} from "@/lib/application";
import StepShell from "@/components/StepShell";
import Link from "next/link";

type Answers = Record<string, string>;
type Diagnosis = { level: "高" | "中" | "低"; reason: string; advice: string };

const INELIGIBLE_LIST = ["社長・代表者", "役員", "業務委託・個人事業主", "雇用保険未加入の方"];

const LEVEL_STYLES: Record<Diagnosis["level"], { badge: string; border: string }> = {
  高: { badge: "bg-green-100 text-green-800", border: "border-green-300 bg-green-50" },
  中: { badge: "bg-yellow-100 text-yellow-800", border: "border-yellow-300 bg-yellow-50" },
  低: { badge: "bg-red-100 text-red-800", border: "border-red-300 bg-red-50" },
};

function calcDeadline(startDate: string): string {
  if (!startDate) return "";
  const [y, m, d] = startDate.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setMonth(date.getMonth() - 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatJP(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  return `${y}年${m}月${d}日`;
}

const REQUIRED_KEYS = ["insurance", "startDate", "traineeCount", "itTraining", "employees"];

const KEY_LABELS: Record<string, string> = {
  insurance: "雇用保険の加入状況",
  startDate: "受講開始予定日",
  traineeCount: "受講人数",
  itTraining: "研修内容",
  employees: "会社の従業員数",
};

export default function Step1Page() {
  const [application, setApplication] = useState<Application | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<Diagnosis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    getOrCreateApplication(supabase).then(({ application, steps }) => {
      setApplication(application);
      const saved = parseNotes<{ answers: Answers; result: Diagnosis }>(
        steps.find((s) => s.step_number === 1)?.notes ?? null
      );
      if (saved) {
        setAnswers(saved.answers ?? {});
        setResult(saved.result ?? null);
      }
    });
  }, []);

  function setAnswer(key: string, value: string) {
    setAnswers((a) => ({ ...a, [key]: value }));
  }

  const deadline = calcDeadline(answers.startDate ?? "");
  const allAnswered = REQUIRED_KEYS.every((k) => answers[k]);
  const missingItems = REQUIRED_KEYS.filter((k) => !answers[k]).map((k) => KEY_LABELS[k]);

  async function diagnose() {
    if (!application || !allAnswered) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as Diagnosis;
      setResult(data);
      const supabase = createClient();
      await saveStepNotes(supabase, application.id, 1, { answers, result: data });
      await completeStep(supabase, application.id, 1);
    } catch {
      setError("診断に失敗しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <StepShell step={1}>
      <div className="space-y-6">

        {/* 対象外の方（常に表示） */}
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="mb-2 text-sm font-bold text-red-800">
            ⚠️ 次の方は助成金の対象外です（受講人数にカウントしないでください）
          </p>
          <div className="flex flex-wrap gap-2">
            {INELIGIBLE_LIST.map((item) => (
              <span
                key={item}
                className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700"
              >
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
            <p className="mb-2 text-xs text-gray-500">
              雇用保険番号（被保険者番号）を持っている方が対象です
            </p>
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
                  <input
                    type="radio"
                    name="insurance"
                    value={opt}
                    checked={answers.insurance === opt}
                    onChange={() => setAnswer("insurance", opt)}
                    className="sr-only"
                  />
                  {opt}
                </label>
              ))}
            </div>
            {answers.insurance === "いいえ" && (
              <div className="mt-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <strong>対象外の可能性が高いです。</strong>
                雇用保険に未加入の場合、この助成金は受給できません。
                まず雇用保険への加入について、管轄の労働局にご相談ください。
              </div>
            )}
            {answers.insurance === "わからない" && (
              <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                雇用保険の加入状況は給与明細や雇用保険被保険者証で確認できます。
                不明な場合は労働局にお問い合わせください。
              </div>
            )}
          </fieldset>

          {/* Q2: 受講開始日 */}
          <fieldset>
            <legend className="mb-1 text-sm font-semibold">
              Q2. 受講開始予定日はいつですか？
            </legend>
            <p className="mb-2 text-xs text-gray-500">
              入力すると計画書の提出期限を自動計算します
            </p>
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
                <p className="text-xl font-bold text-red-700">
                  {formatJP(deadline)} までに労働局必着
                </p>
                <p className="mt-1 text-sm text-amber-800">
                  受講開始 {formatJP(answers.startDate)} の <strong>1ヶ月前</strong> です。
                </p>
                <p className="mt-1 text-xs text-amber-600">
                  ※「開始前日まで」ではありません。1ヶ月前に必着するよう余裕を持って手配してください。
                </p>
              </div>
            )}
          </fieldset>

          {/* Q3: 受講人数 */}
          <fieldset>
            <legend className="mb-1 text-sm font-semibold">
              Q3. 受講させたい従業員は何名ですか？
            </legend>
            <p className="mb-2 text-xs text-gray-500">
              社長・役員を除いた、雇用保険加入の従業員のみカウントしてください
            </p>
            <div className="flex flex-wrap gap-2">
              {["1名", "2〜4名", "5〜9名", "10名以上"].map((opt) => (
                <label
                  key={opt}
                  className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm transition ${
                    answers.traineeCount === opt
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:border-brand-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="traineeCount"
                    value={opt}
                    checked={answers.traineeCount === opt}
                    onChange={() => setAnswer("traineeCount", opt)}
                    className="sr-only"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Q4: IT研修か */}
          <fieldset>
            <legend className="mb-1 text-sm font-semibold">
              Q4. 研修内容はAI・IT・デジタル分野ですか？
            </legend>
            <p className="mb-2 text-xs text-gray-500">
              AI活用、プログラミング、DX、デジタルマーケティング等が該当します
            </p>
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
                  <input
                    type="radio"
                    name="itTraining"
                    value={opt}
                    checked={answers.itTraining === opt}
                    onChange={() => setAnswer("itTraining", opt)}
                    className="sr-only"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Q5: 従業員数 */}
          <fieldset>
            <legend className="mb-1 text-sm font-semibold">
              Q5. 会社の従業員数（正規雇用）は何名ですか？
            </legend>
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
                  <input
                    type="radio"
                    name="employees"
                    value={opt}
                    checked={answers.employees === opt}
                    onChange={() => setAnswer("employees", opt)}
                    className="sr-only"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </fieldset>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
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
          </div>
        </div>

        {/* 診断結果 */}
        {result && (
          <div className={`card border-2 space-y-4 ${LEVEL_STYLES[result.level].border}`}>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold">診断結果</h2>
              <span className={`rounded-full px-3 py-1 text-sm font-bold ${LEVEL_STYLES[result.level].badge}`}>
                受給可能性: {result.level}
              </span>
            </div>

            <p className="text-sm leading-relaxed text-gray-700">{result.reason}</p>

            {/* 期限（AIではなくルールベースで計算） */}
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

            {/* AIアドバイス */}
            <div className="rounded-lg bg-brand-50 p-4">
              <h3 className="mb-1 text-sm font-semibold text-brand-700">次のステップへのアドバイス</h3>
              <p className="text-sm leading-relaxed text-gray-700">{result.advice}</p>
            </div>

            {/* 労働局に確認すべきこと */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="mb-2 text-xs font-bold text-gray-700">労働局に確認しておくとよいこと</p>
              <ul className="space-y-1.5 text-xs text-gray-600">
                <li>• この研修（ホリエモンAI学校等の定額制IT研修）は対象になりますか？</li>
                <li>• 受講人数 {answers.traineeCount} で全員が対象になりますか？</li>
                {deadline && (
                  <li>• {formatJP(answers.startDate)} 開始の場合、計画書の必着日は {formatJP(deadline)} でよいですか？</li>
                )}
                <li>• 必要書類に不足・不備がないか事前に確認させてもらえますか？</li>
              </ul>
            </div>

            <Link href="/step/2" className="btn-primary inline-block">
              STEP2: 計画書の準備へ進む →
            </Link>
          </div>
        )}
      </div>
    </StepShell>
  );
}
