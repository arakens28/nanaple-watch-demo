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
import { STEP2_DOCS } from "@/lib/steps";
import StepShell from "@/components/StepShell";
import { openChatWith } from "@/components/ChatDrawer";

type Step2Notes = {
  checked: string[];
  submittedAt: string | null;
};

export default function Step2Page() {
  const [application, setApplication] = useState<Application | null>(null);
  const [checked, setChecked] = useState<string[]>([]);
  const [submittedAt, setSubmittedAt] = useState("");
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    getOrCreateApplication(supabase).then(({ application, steps }) => {
      setApplication(application);
      const step = steps.find((s) => s.step_number === 2);
      const saved = parseNotes<Step2Notes>(step?.notes ?? null);
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

  return (
    <StepShell step={2}>
      <div className="space-y-6">
        <div className="card">
          <h2 className="mb-1 text-lg font-bold">必要書類チェックリスト</h2>
          <p className="mb-4 text-sm text-gray-500">
            訓練開始日の1ヶ月前までに労働局へ提出が必要です。書き方に迷ったら各書類の「AIに聞く」を押してください。
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
                    className="h-5 w-5 rounded border-gray-300 text-brand-600"
                  />
                  <span
                    className={`text-sm ${checked.includes(doc) ? "text-gray-400 line-through" : ""}`}
                  >
                    {doc}
                  </span>
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
