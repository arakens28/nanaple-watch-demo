"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import {
  getOrCreateApplication,
  completeStep,
  type Application,
} from "@/lib/application";
import StepShell from "@/components/StepShell";

const TARGET_HOURS = 10;

type TrainingRecord = {
  id: string;
  training_date: string;
  hours: number;
  memo: string | null;
};

type UploadedDoc = {
  id: string;
  file_name: string;
  uploaded_at: string;
};

export default function Step3Page() {
  const [application, setApplication] = useState<Application | null>(null);
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [done, setDone] = useState(false);

  const [date, setDate] = useState("");
  const [hours, setHours] = useState("");
  const [memo, setMemo] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const total = records.reduce((sum, r) => sum + Number(r.hours), 0);
  const percent = Math.min(100, Math.round((total / TARGET_HOURS) * 100));
  const reached = total >= TARGET_HOURS;

  useEffect(() => {
    const supabase = createClient();
    getOrCreateApplication(supabase).then(async ({ application, steps }) => {
      setApplication(application);
      setDone(steps.find((s) => s.step_number === 3)?.status === "done");
      const [{ data: recs }, { data: uploaded }] = await Promise.all([
        supabase
          .from("training_records")
          .select("id, training_date, hours, memo")
          .eq("application_id", application.id)
          .order("training_date"),
        supabase
          .from("documents")
          .select("id, file_name, uploaded_at")
          .eq("application_id", application.id)
          .eq("step_number", 3)
          .order("uploaded_at"),
      ]);
      setRecords(recs ?? []);
      setDocs(uploaded ?? []);
    });
  }, []);

  async function addRecord(e: React.FormEvent) {
    e.preventDefault();
    if (!application || !date || !hours) return;
    setBusy(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("training_records")
        .insert({
          application_id: application.id,
          training_date: date,
          hours: Number(hours),
          memo: memo || null,
        })
        .select("id, training_date, hours, memo")
        .single();
      if (error) throw error;
      setRecords((r) =>
        [...r, data].sort((a, b) =>
          a.training_date.localeCompare(b.training_date)
        )
      );
      setDate("");
      setHours("");
      setMemo("");
    } finally {
      setBusy(false);
    }
  }

  async function removeRecord(id: string) {
    const supabase = createClient();
    await supabase.from("training_records").delete().eq("id", id);
    setRecords((r) => r.filter((rec) => rec.id !== id));
  }

  async function uploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !application) return;
    setUploadError(null);
    setBusy(true);
    try {
      const supabase = createClient();
      const path = `${application.user_id}/${application.id}/step3/${Date.now()}_${file.name}`;
      const { error: storageError } = await supabase.storage
        .from("documents")
        .upload(path, file);
      if (storageError) throw storageError;
      const { data, error } = await supabase
        .from("documents")
        .insert({
          application_id: application.id,
          step_number: 3,
          file_name: file.name,
          storage_path: path,
        })
        .select("id, file_name, uploaded_at")
        .single();
      if (error) throw error;
      setDocs((d) => [...d, data]);
    } catch {
      setUploadError(
        "アップロードに失敗しました。Supabaseに「documents」バケットが作成されているか確認してください。"
      );
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  async function finishStep() {
    if (!application || !reached) return;
    const supabase = createClient();
    await completeStep(supabase, application.id, 3);
    setDone(true);
  }

  return (
    <StepShell
      step={3}
      adviceContext={`現在の合計受講時間は${total.toFixed(1)}時間（目標10時間）`}
    >
      <div className="space-y-6">
        {/* プログレス */}
        <div className="card">
          <div className="mb-1 flex items-end justify-between">
            <h2 className="text-lg font-bold">受講時間の進捗</h2>
            <span className="text-2xl font-bold text-brand-600">
              {total.toFixed(1)}
              <span className="text-sm font-normal text-gray-500">
                {" "}
                / {TARGET_HOURS}h
              </span>
            </span>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full rounded-full transition-all ${reached ? "bg-green-500" : "bg-brand-600"}`}
              style={{ width: `${percent}%` }}
            />
          </div>
          {reached && (
            <p className="mt-2 text-sm font-medium text-green-700">
              🎉 目標の10時間を達成しました！
            </p>
          )}
        </div>

        {/* 記録の追加 */}
        <div className="card">
          <h2 className="mb-3 text-lg font-bold">受講記録を追加</h2>
          <form onSubmit={addRecord} className="flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">受講日</label>
              <input
                type="date"
                required
                className="input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                時間数（h）
              </label>
              <input
                type="number"
                required
                min="0.5"
                step="0.5"
                className="input w-28"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>
            <div className="min-w-40 flex-1">
              <label className="mb-1 block text-sm font-medium">
                メモ（任意）
              </label>
              <input
                type="text"
                className="input"
                placeholder="講座名など"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </div>
            <button type="submit" disabled={busy} className="btn-primary">
              追加
            </button>
          </form>

          {records.length > 0 && (
            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-gray-500">
                  <th className="py-2">受講日</th>
                  <th className="py-2">時間</th>
                  <th className="py-2">メモ</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="py-2">{r.training_date}</td>
                    <td className="py-2">{Number(r.hours).toFixed(1)}h</td>
                    <td className="py-2 text-gray-500">{r.memo}</td>
                    <td className="py-2 text-right">
                      <button
                        onClick={() => removeRecord(r.id)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ホリエモンAI学校の受講証明書 */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-bold text-blue-800 mb-2">
            📄 ホリエモンAI学校からの受講証明書（本申請に必要）
          </p>
          <p className="text-sm text-blue-700 mb-2">
            ホリエモンAI学校はOneStreamというLMSを使用しており、受講データはPDF形式で受講企業へ配布されます。<strong>「再生完了率100%」が受講完了の証拠</strong>となります。
          </p>
          <ul className="text-sm text-blue-700 space-y-1 ml-3 list-disc">
            <li>視聴ログ（受講日時・動画タイトル・再生時間・完了率）</li>
            <li>受講証明書（社名・受講者氏名・受講講座一覧）</li>
          </ul>
          <p className="mt-2 text-xs text-blue-600">
            ▶ 受講後、ホリエモンAI学校の担当者にPDF発行を依頼してください。STEP4の支給申請時に提出します。
          </p>
        </div>

        {/* 受講履歴アップロード */}
        <div className="card">
          <h2 className="mb-1 text-lg font-bold">受講履歴ファイル</h2>
          <p className="mb-3 text-sm text-gray-500">
            ホリエモンAI学校から受け取った受講証明書・視聴ログPDFをアップロードして保管できます。本申請で使用します。
          </p>
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.csv,.xlsx"
            onChange={uploadFile}
            disabled={busy}
            className="text-sm"
          />
          {uploadError && (
            <p className="mt-2 text-sm text-red-600">{uploadError}</p>
          )}
          {docs.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm text-gray-700">
              {docs.map((d) => (
                <li key={d.id}>📄 {d.file_name}</li>
              ))}
            </ul>
          )}
        </div>

        {/* 次のステップへ */}
        <div className="card flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {reached
              ? "10時間を達成しました。次のステップへ進めます。"
              : `次のステップへ進むには、あと${(TARGET_HOURS - total).toFixed(1)}時間の受講が必要です。`}
          </p>
          {done ? (
            <Link href="/step/4" className="btn-primary">
              ステップ4へ →
            </Link>
          ) : (
            <button
              onClick={finishStep}
              disabled={!reached}
              className="btn-primary"
            >
              次のステップへ
            </button>
          )}
        </div>
      </div>
    </StepShell>
  );
}
