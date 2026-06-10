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
import StepShell from "@/components/StepShell";

type Step5Notes = {
  inquiry: string;
  draft: string;
};

export default function Step5Page() {
  const [application, setApplication] = useState<Application | null>(null);
  const [inquiry, setInquiry] = useState("");
  const [draft, setDraft] = useState("");
  const [done, setDone] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    getOrCreateApplication(supabase).then(({ application, steps }) => {
      setApplication(application);
      const step = steps.find((s) => s.step_number === 5);
      const saved = parseNotes<Step5Notes>(step?.notes ?? null);
      if (saved) {
        setInquiry(saved.inquiry ?? "");
        setDraft(saved.draft ?? "");
      }
      setDone(step?.status === "done");
    });
  }, []);

  async function generate() {
    if (!inquiry.trim() || !application) return;
    setGenerating(true);
    setDraft("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purpose: "step5_draft", inquiry }),
      });
      const data = await res.json();
      const text: string = data.text ?? "";
      setDraft(text);
      const supabase = createClient();
      await saveStepNotes(supabase, application.id, 5, {
        inquiry,
        draft: text,
      } satisfies Step5Notes);
    } catch {
      setDraft("回答案の生成に失敗しました。もう一度お試しください。");
    } finally {
      setGenerating(false);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function finish() {
    if (!application) return;
    const supabase = createClient();
    await completeStep(supabase, application.id, 5);
    setDone(true);
  }

  return (
    <StepShell step={5}>
      <div className="space-y-6">
        <div className="card">
          <h2 className="mb-1 text-lg font-bold">労働局からの問い合わせ内容</h2>
          <p className="mb-3 text-sm text-gray-500">
            届いた問い合わせ・照会の内容を貼り付けると、AIが回答の下書きを作成します。
          </p>
          <textarea
            className="input min-h-32"
            placeholder="例: 「受講履歴に記載の受講時間と申請書の時間数に相違があります。理由をご説明ください。」"
            value={inquiry}
            onChange={(e) => setInquiry(e.target.value)}
          />
          <button
            onClick={generate}
            disabled={!inquiry.trim() || generating}
            className="btn-primary mt-3"
          >
            {generating ? "AIが作成中..." : "回答案を作成する"}
          </button>
        </div>

        {draft && (
          <div className="card">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold">回答案（下書き）</h2>
              <button onClick={copy} className="btn-secondary text-xs">
                {copied ? "コピーしました ✓" : "コピー"}
              </button>
            </div>
            <pre className="whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-gray-800">
              {draft}
            </pre>
            <p className="mt-3 text-xs text-gray-400">
              ※ 内容は必ずご自身で確認・修正のうえ送付してください。判断に迷う場合は社労士にご相談ください。
            </p>
          </div>
        )}

        <div className="card flex items-center justify-between">
          <p className="text-sm text-gray-600">
            問い合わせ対応が完了したら（問い合わせが無い場合もこちら）
          </p>
          {done ? (
            <Link href="/step/6" className="btn-primary">
              ステップ6へ →
            </Link>
          ) : (
            <button onClick={finish} className="btn-primary">
              対応完了にする
            </button>
          )}
        </div>
      </div>
    </StepShell>
  );
}
