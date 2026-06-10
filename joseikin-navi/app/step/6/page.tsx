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

type Step6Notes = {
  expectedAt: string | null;
  receivedAt: string | null;
  amount: number | null;
};

export default function Step6Page() {
  const [application, setApplication] = useState<Application | null>(null);
  const [expectedAt, setExpectedAt] = useState("");
  const [receivedAt, setReceivedAt] = useState("");
  const [amount, setAmount] = useState("");
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    getOrCreateApplication(supabase).then(({ application, steps }) => {
      setApplication(application);
      const step = steps.find((s) => s.step_number === 6);
      const saved = parseNotes<Step6Notes>(step?.notes ?? null);
      if (saved) {
        setExpectedAt(saved.expectedAt ?? "");
        setReceivedAt(saved.receivedAt ?? "");
        setAmount(saved.amount != null ? String(saved.amount) : "");
      }
      setDone(step?.status === "done");
    });
  }, []);

  async function save(markDone: boolean) {
    if (!application) return;
    setSaving(true);
    try {
      const supabase = createClient();
      await saveStepNotes(supabase, application.id, 6, {
        expectedAt: expectedAt || null,
        receivedAt: receivedAt || null,
        amount: amount ? Number(amount) : null,
      } satisfies Step6Notes);
      if (markDone) {
        await completeStep(supabase, application.id, 6);
        setDone(true);
      }
    } finally {
      setSaving(false);
    }
  }

  const startDate = application
    ? new Date(application.created_at).toLocaleDateString("ja-JP")
    : "";

  return (
    <StepShell step={6}>
      <div className="space-y-6">
        <div className="card">
          <h2 className="mb-3 text-lg font-bold">入金の記録</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium">
                入金予定日
              </label>
              <input
                type="date"
                className="input"
                value={expectedAt}
                onChange={(e) => setExpectedAt(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                実際の入金日
              </label>
              <input
                type="date"
                className="input"
                value={receivedAt}
                onChange={(e) => setReceivedAt(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                助成金額（円）
              </label>
              <input
                type="number"
                min="0"
                className="input"
                placeholder="例: 300000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => save(false)}
              disabled={saving}
              className="btn-secondary"
            >
              保存
            </button>
            <button
              onClick={() => save(true)}
              disabled={saving || !receivedAt || !amount || done}
              className="btn-primary"
            >
              {done ? "完了済み ✓" : "着金を確認して完了"}
            </button>
          </div>
        </div>

        {done && (
          <div className="card border-green-200 bg-green-50">
            <h2 className="mb-4 text-lg font-bold text-green-800">
              🎉 申請完了おめでとうございます！
            </h2>
            <dl className="grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-gray-500">申請開始日</dt>
                <dd className="font-semibold">{startDate}</dd>
              </div>
              <div>
                <dt className="text-gray-500">着金日</dt>
                <dd className="font-semibold">
                  {receivedAt
                    ? new Date(receivedAt).toLocaleDateString("ja-JP")
                    : "-"}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">受給額</dt>
                <dd className="font-semibold">
                  {amount ? `${Number(amount).toLocaleString()} 円` : "-"}
                </dd>
              </div>
            </dl>
            <Link href="/dashboard" className="btn-primary mt-5 inline-block">
              マイページで全体を確認する
            </Link>
          </div>
        )}
      </div>
    </StepShell>
  );
}
