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
import { STEP2_DOCS, STEP2_DOCS_MULTI_BUREAU, STEP2_DOC_DESCRIPTIONS } from "@/lib/steps";
import { BUREAU_PREFECTURE_KEY } from "@/lib/bureauData";
import StepShell from "@/components/StepShell";
import { openChatWith } from "@/components/ChatDrawer";

type Step2Notes = {
  checked: string[];
  submittedAt: string | null;
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

export default function Step2Page() {
  const [application, setApplication] = useState<Application | null>(null);
  const [checked, setChecked] = useState<string[]>([]);
  const [submittedAt, setSubmittedAt] = useState("");
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [trainingStartDate, setTrainingStartDate] = useState("");
  const [isMultiBureau, setIsMultiBureau] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    getOrCreateApplication(supabase).then(({ application, steps }) => {
      setApplication(application);
      const step2 = steps.find((s) => s.step_number === 2);
      const step1 = steps.find((s) => s.step_number === 1);
      const saved = parseNotes<Step2Notes>(step2?.notes ?? null);
      if (saved) {
        setChecked(saved.checked ?? []);
        if (saved.submittedAt) setSubmittedAt(saved.submittedAt);
      }
      setDone(step2?.status === "done");
      // STEP1で入力した受講開始日・複数労働局フラグを読み込む
      const step1Notes = parseNotes<{ answers: Record<string, string>; bureauList?: { prefecture: string }[] }>(step1?.notes ?? null);
      if (step1Notes?.answers?.startDate) {
        setTrainingStartDate(step1Notes.answers.startDate);
      }
      if (step1Notes?.bureauList && step1Notes.bureauList.filter((b) => b.prefecture).length > 1) {
        setIsMultiBureau(true);
      } else {
        // localStorageで複数都道府県が設定されているかチェック（フォールバック）
        const pref = typeof window !== "undefined" ? localStorage.getItem(BUREAU_PREFECTURE_KEY) : null;
        setIsMultiBureau(false);
        void pref;
      }
    });
  }, []);

  async function persist(nextChecked: string[], nextSubmittedAt: string) {
    if (!application) return;
    const supabase = createClient();
    await saveStepNotes(supabase, application.id, 2, {
      checked: nextChecked,
      submittedAt: nextSubmittedAt || null,
    } satisfies Step2Notes);
  }

  function toggle(doc: string) {
    const next = checked.includes(doc)
      ? checked.filter((d) => d !== doc)
      : [...checked, doc];
    setChecked(next);
    void persist(next, submittedAt);
  }

  async function submit() {
    if (!application || !submittedAt) return;
    setSaving(true);
    try {
      await persist(checked, submittedAt);
      const supabase = createClient();
      await completeStep(supabase, application.id, 2);
      setDone(true);
    } finally {
      setSaving(false);
    }
  }

  const deadline = calcDeadline(trainingStartDate);

  return (
    <StepShell step={2}>
      <div className="space-y-6">

        {/* STEP2の役割説明（STEP4との混同防止） */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-bold text-blue-800 mb-1">
            STEP2は「受講前」に提出する計画書です
          </p>
          <p className="text-xs text-blue-700">
            STEP4（本申請・支給申請）は受講後に提出します。このステップでは計画書を提出することで、受講が認められます。
          </p>
        </div>

        {/* 提出期限バナー（最重要・常に表示） */}
        {deadline ? (
          <div className="rounded-xl border-2 border-red-400 bg-red-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-red-500 mb-1">
              ⚠️ 計画書の提出期限（制度上の固定ルール）
            </p>
            <p className="text-2xl font-bold text-red-700">
              {formatJP(deadline)} までに労働局必着
            </p>
            <p className="mt-1 text-sm text-red-600">
              受講開始 {formatJP(trainingStartDate)} の <strong>1ヶ月前</strong> です。
            </p>
            <p className="mt-2 text-xs text-red-500">
              「前日まで」ではありません。郵送の場合は到着日を確認してください。
              不安な場合は労働局へ直接持参・確認することをおすすめします。
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-bold text-amber-800">
              ⚠️ 計画書は受講開始日の1ヶ月前までに労働局必着
            </p>
            <p className="text-xs text-amber-600 mt-1">
              STEP1で受講開始日を入力すると、具体的な期限日を表示できます。
            </p>
          </div>
        )}

        {/* 様式ダウンロード */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">様式ダウンロード（厚生労働省 公式）</p>
          <a
            href="https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/38819_00010.html#事業展開等リスキリング支援コース"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-brand-700 underline hover:text-brand-900"
          >
            <span>📄</span>
            人材開発支援助成金（事業展開等リスキリング支援コース）様式一覧 ↗
          </a>
          <p className="mt-1 text-xs text-gray-500">
            様式第1-1号、第1-3号、第3-2号、第11号などがダウンロードできます
          </p>
        </div>

        {/* ホリエモンAI学校提供資料ダウンロード */}
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-bold text-green-800 mb-2">
            📥 ホリエモンAI学校の公式資料（⑤・⑧に使用可）
          </p>
          <p className="text-xs text-green-700 mb-3">
            以下の資料は提出書類の一部として使用できます。ダウンロードして書類に同封してください。
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <a
              href="/horiemon-ai-hojin.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-green-300 bg-white px-3 py-2 text-sm font-medium text-green-800 hover:bg-green-100"
            >
              <span>📄</span>
              <div>
                <p className="font-semibold">法人資料（パンフレット）</p>
                <p className="text-xs text-green-600">⑤ 訓練カリキュラム・受講案内として使用可</p>
              </div>
            </a>
            <a
              href="/joseikin-sankoshorui.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-green-300 bg-white px-3 py-2 text-sm font-medium text-green-800 hover:bg-green-100"
            >
              <span>📄</span>
              <div>
                <p className="font-semibold">助成金申請参考資料</p>
                <p className="text-xs text-green-600">⑤⑧ コース一覧・標準学習時間として使用可</p>
              </div>
            </a>
          </div>
        </div>

        <div className="card">
          <h2 className="mb-1 text-lg font-bold">必要書類チェックリスト（定額制サービス用）</h2>
          <p className="mb-4 text-sm text-gray-500">
            書き方に迷ったら各書類の「AIに聞く」を押してください。実際の記入・提出はご自身で行ってください。
          </p>
          <ul className="space-y-3">
            {STEP2_DOCS.map((doc) => (
              <li
                key={doc}
                className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3"
              >
                <label className="flex flex-1 cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={checked.includes(doc)}
                    onChange={() => toggle(doc)}
                    className="h-5 w-5 shrink-0 rounded border-gray-300 text-brand-600"
                  />
                  <div>
                    <span
                      className={`text-sm font-medium ${checked.includes(doc) ? "text-gray-400 line-through" : ""}`}
                    >
                      {doc}
                    </span>
                    {STEP2_DOC_DESCRIPTIONS[doc] && !checked.includes(doc) && (
                      <p className="mt-0.5 text-xs text-gray-400">
                        → {STEP2_DOC_DESCRIPTIONS[doc]}
                      </p>
                    )}
                  </div>
                </label>
                <button
                  onClick={() =>
                    openChatWith(`「${doc}」の書き方と注意点を、記入例つきで教えてください。`)
                  }
                  className="btn-secondary shrink-0 text-xs"
                >
                  書き方をAIに聞く
                </button>
              </li>
            ))}
          </ul>

          {/* 複数労働局にまたがる場合のみ */}
          {isMultiBureau && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="mb-2 text-sm font-bold text-amber-800">
                複数の労働局にまたがる場合は以下も必要です
              </p>
              <ul className="space-y-2">
                {STEP2_DOCS_MULTI_BUREAU.map((doc) => (
                  <li key={doc} className="flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-white p-3">
                    <label className="flex flex-1 cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={checked.includes(doc)}
                        onChange={() => toggle(doc)}
                        className="h-5 w-5 shrink-0 rounded border-gray-300 text-brand-600"
                      />
                      <div>
                        <span className={`text-sm font-medium ${checked.includes(doc) ? "text-gray-400 line-through" : ""}`}>
                          {doc}
                        </span>
                        {STEP2_DOC_DESCRIPTIONS[doc] && !checked.includes(doc) && (
                          <p className="mt-0.5 text-xs text-gray-400">→ {STEP2_DOC_DESCRIPTIONS[doc]}</p>
                        )}
                      </div>
                    </label>
                    <button
                      onClick={() => openChatWith(`「${doc}」の書き方と注意点を教えてください。`)}
                      className="btn-secondary shrink-0 text-xs"
                    >
                      AIに聞く
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="mb-3 text-lg font-bold">提出完了の記録</h2>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">
                労働局への提出完了日
              </label>
              <input
                type="date"
                className="input"
                value={submittedAt}
                onChange={(e) => setSubmittedAt(e.target.value)}
              />
            </div>
            <div>
              <button
                onClick={submit}
                disabled={!submittedAt || saving || done}
                className="btn-primary"
              >
                {done ? "提出済み ✓" : saving ? "保存中..." : "提出完了として保存"}
              </button>
              {!submittedAt && !done && (
                <p className="mt-1 text-xs text-amber-600">
                  ▲ 提出完了日を入力すると保存できます
                </p>
              )}
            </div>
          </div>
          {done && (
            <p className="mt-3 text-sm text-green-700">
              計画申請の提出を記録しました。{" "}
              <Link href="/step/3" className="font-semibold underline">
                ステップ3: 研修受講へ進む →
              </Link>
            </p>
          )}
        </div>
      </div>
    </StepShell>
  );
}
