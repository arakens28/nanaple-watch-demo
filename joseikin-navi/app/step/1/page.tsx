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

const QUESTIONS: { key: string; label: string; options: string[] }[] = [
  {
    key: "employees",
    label: "従業員数（正規雇用）は何名ですか？",
    options: ["1〜9名", "10〜99名", "100名以上"],
  },
  {
    key: "insurance",
    label: "雇用保険に加入していますか？",
    options: ["はい", "いいえ"],
  },
  {
    key: "pastGrant",
    label: "過去3年以内に助成金を受給したことがありますか？",
    options: ["はい", "いいえ", "わからない"],
  },
  {
    key: "trainee",
    label: "訓練させたい従業員はいますか？",
    options: ["はい", "いいえ"],
  },
  {
    key: "itTraining",
    label: "訓練内容はIT・デジタル分野ですか？",
    options: ["はい", "いいえ", "わからない"],
  },
];

const LEVEL_STYLES: Record<Diagnosis["level"], string> = {
  高: "bg-green-100 text-green-800",
  中: "bg-yellow-100 text-yellow-800",
  低: "bg-red-100 text-red-800",
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
        setAnswers(saved.answers);
        setResult(saved.result);
      }
    });
  }, []);

  const allAnswered = QUESTIONS.every((q) => answers[q.key]);

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
      await saveStepNotes(supabase, application.id, 1, {
        answers,
        result: data,
      });
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
        <div className="card space-y-6">
          {QUESTIONS.map((q, i) => (
            <fieldset key={q.key}>
              <legend className="mb-2 text-sm font-semibold">
                Q{i + 1}. {q.label}
              </legend>
              <div className="flex flex-wrap gap-2">
                {q.options.map((opt) => (
                  <label
                    key={opt}
                    className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm transition ${
                      answers[q.key] === opt
                        ? "border-brand-600 bg-brand-600 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-brand-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.key}
                      value={opt}
                      checked={answers[q.key] === opt}
                      onChange={() =>
                        setAnswers((a) => ({ ...a, [q.key]: opt }))
                      }
                      className="sr-only"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            onClick={diagnose}
            disabled={!allAnswered || loading}
            className="btn-primary w-full"
          >
            {loading ? "AIが診断中..." : "診断結果を見る"}
          </button>
        </div>

        {result && (
          <div className="card border-brand-200">
            <div className="mb-3 flex items-center gap-3">
              <h2 className="text-lg font-bold">診断結果</h2>
              <span
                className={`rounded-full px-3 py-1 text-sm font-bold ${LEVEL_STYLES[result.level]}`}
              >
                受給可能性: {result.level}
              </span>
            </div>
            <p className="mb-3 text-sm leading-relaxed text-gray-700">
              {result.reason}
            </p>
            <div className="rounded-lg bg-brand-50 p-4">
              <h3 className="mb-1 text-sm font-semibold text-brand-700">
                次のステップへのアドバイス
              </h3>
              <p className="text-sm leading-relaxed text-gray-700">
                {result.advice}
              </p>
            </div>
            <Link href="/step/2" className="btn-primary mt-4 inline-block">
              ステップ2: 計画申請書へ進む →
            </Link>
          </div>
        )}
      </div>
    </StepShell>
  );
}
