"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import {
  getOrCreateApplication,
  saveStepNotes,
  completeStep,
  parseNotes,
  type Application,
} from "@/lib/application";
import { STEP4_DOCS, STEP4_DOC_DESCRIPTIONS } from "@/lib/steps";
import StepShell from "@/components/StepShell";

type Step4Notes = {
  checked: string[];
  submittedAt: string | null;
};

export default function Step4Page() {
  const [application, setApplication] = useState<Application | null>(null);
  const [checked, setChecked] = useState<string[]>([]);
  const [submittedAt, setSubmittedAt] = useState("");
  const [done, setDone] = useState(false);
  const [aiCheck, setAiCheck] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    getOrCreateApplication(supabase).then(({ application, steps }) => {
      setApplication(application);
      const step = steps.find((s) => s.step_number === 4);
      const saved = parseNotes<Step4Notes>(step?.notes ?? null);
      if (saved) {
        setChecked(saved.checked ?? []);
        if (saved.submittedAt) setSubmittedAt(saved.submittedAt);
      }
      setDone(step?.status === "done");
    });
  }, []);

  async function persist(nextChecked: string[], nextSubmittedAt: string) {
    if (!application) return;
    const supabase = createClient();
    await saveStepNotes(supabase, application.id, 4, {
      checked: nextChecked,
      submittedAt: nextSubmittedAt || null,
    } satisfies Step4Notes);
  }

  function toggle(doc: string) {
    const next = checked.includes(doc)
      ? checked.filter((d) => d !== doc)
      : [...checked, doc];
    setChecked(next);
    void persist(next, submittedAt);
  }

  async function runAiCheck() {
    setChecking(true);
    setAiCheck(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purpose: "step4_check",
          checked,
          unchecked: STEP4_DOCS.filter((d) => !checked.includes(d)),
        }),
      });
      const data = await res.json();
      setAiCheck(data.text ?? "チェックに失敗しました。");
    } catch {
      setAiCheck("チェックに失敗しました。もう一度お試しください。");
    } finally {
      setChecking(false);
    }
  }

  async function submit() {
    if (!application || !submittedAt) return;
    setSaving(true);
    try {
      await persist(checked, submittedAt);
      const supabase = createClient();
      await completeStep(supabase, application.id, 4);
      setDone(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <StepShell
      step={4}
      adviceContext={`書類${STEP4_DOCS.length}点中${checked.length}点準備済み`}
    >
      <div className="space-y-6">
        {/* STEP4はSTEP2と異なり受講後の申請 */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-bold text-blue-800 mb-1">
            STEP4は「受講後」に提出する支給申請です
          </p>
          <p className="text-xs text-blue-700">
            STEP2（計画書）は受講前に提出済みのはずです。このステップでは受講完了の証拠書類とともに支給申請を提出します。
            訓練終了日の翌日から<strong>2ヶ月以内</strong>に提出が必要です。
          </p>
        </div>

        <div className="card">
          <h2 className="mb-1 text-lg font-bold">支給申請書類チェックリスト</h2>
          <p className="mb-4 text-sm text-gray-500">
            全書類を揃えてから提出してください。実際の記入・提出はご自身で行ってください。
          </p>
          <ul className="space-y-2">
            {STEP4_DOCS.map((doc) => (
              <li key={doc}>
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-3">
                  <input
                    type="checkbox"
                    checked={checked.includes(doc)}
                    onChange={() => toggle(doc)}
                    className="mt-0.5 h-5 w-5 shrink-0 rounded border-gray-300 text-brand-600"
                  />
                  <div>
                    <span
                      className={`text-sm font-medium ${checked.includes(doc) ? "text-gray-400 line-through" : ""}`}
                    >
                      {doc}
                    </span>
                    {STEP4_DOC_DESCRIPTIONS[doc] && !checked.includes(doc) && (
                      <p className="mt-0.5 text-xs text-gray-400">
                        → {STEP4_DOC_DESCRIPTIONS[doc]}
                      </p>
                    )}
                  </div>
                </label>
              </li>
            ))}
          </ul>
          <button
            onClick={runAiCheck}
            disabled={checking}
            className="btn-secondary mt-4"
          >
            {checking ? "AIがチェック中..." : "不足書類をAIにチェックしてもらう"}
          </button>
          {aiCheck && (
            <div className="mt-4 rounded-lg bg-brand-50 p-4">
              <h3 className="mb-2 text-sm font-semibold text-brand-700">
                AIチェック結果
              </h3>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                {aiCheck}
              </p>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="mb-3 text-lg font-bold">提出日の記録</h2>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">
                本申請の提出日
              </label>
              <input
                type="date"
                className="input"
                value={submittedAt}
                onChange={(e) => setSubmittedAt(e.target.value)}
              />
            </div>
            <button
              onClick={submit}
              disabled={!submittedAt || saving || done}
              className="btn-primary"
            >
              {done ? "提出済み ✓" : saving ? "保存中..." : "提出完了として保存"}
            </button>
          </div>
          {done && (
            <p className="mt-3 text-sm text-green-700">
              本申請の提出を記録しました。{" "}
              <Link href="/step/5" className="font-semibold underline">
                ステップ5: 問い合わせ対応へ →
              </Link>
            </p>
          )}
        </div>
      </div>
    </StepShell>
  );
}
