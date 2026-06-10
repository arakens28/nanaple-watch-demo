"use client";

import { useEffect, useState } from "react";
import { STEPS } from "@/lib/steps";
import { openChatWith } from "./ChatDrawer";

export default function AIAdvisor({
  step,
  context,
}: {
  step: number;
  context?: string;
}) {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/advice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step, context }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setAdvice(data.advice ?? null);
      })
      .catch(() => {
        if (!cancelled)
          setAdvice("アドバイスの取得に失敗しました。再読み込みしてください。");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [step, context]);

  const shortcuts = STEPS.find((s) => s.number === step)?.shortcuts ?? [];

  return (
    <aside className="card sticky top-6">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-brand-700">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100">
          ✦
        </span>
        AIアドバイス
      </h2>
      {loading ? (
        <div className="space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-4/6 animate-pulse rounded bg-gray-200" />
        </div>
      ) : (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
          {advice}
        </p>
      )}

      <h3 className="mb-2 mt-5 text-xs font-semibold text-gray-500">
        AIに質問する
      </h3>
      <div className="flex flex-col gap-2">
        {shortcuts.map((q) => (
          <button
            key={q}
            onClick={() => openChatWith(q)}
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-left text-xs text-gray-700 transition hover:border-brand-400 hover:bg-brand-50"
          >
            {q}
          </button>
        ))}
      </div>
    </aside>
  );
}
