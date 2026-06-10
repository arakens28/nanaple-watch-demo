"use client";

import Link from "next/link";
import { STEPS } from "@/lib/steps";
import type { StepStatus } from "@/lib/application";

export function ProgressBar({ steps }: { steps: StepStatus[] }) {
  const done = steps.filter((s) => s.status === "done").length;
  const percent = Math.round((done / 6) * 100);
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-medium">全体の進捗</span>
        <span className="text-gray-500">
          {done} / 6 ステップ完了
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-brand-600 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export function StepList({
  steps,
  currentStep,
}: {
  steps: StepStatus[];
  currentStep: number;
}) {
  return (
    <ol className="space-y-3">
      {STEPS.map((def) => {
        const status = steps.find((s) => s.step_number === def.number);
        const isDone = status?.status === "done";
        const isCurrent = def.number === currentStep && !isDone;
        return (
          <li key={def.number}>
            <Link
              href={`/step/${def.number}`}
              className={`flex items-center gap-4 rounded-xl border p-4 transition ${
                isCurrent
                  ? "border-brand-500 bg-brand-50 shadow-sm"
                  : isDone
                    ? "border-gray-200 bg-white"
                    : "border-gray-200 bg-gray-50 text-gray-400"
              } hover:border-brand-400`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  isDone
                    ? "bg-green-500 text-white"
                    : isCurrent
                      ? "bg-brand-600 text-white"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {isDone ? "✓" : def.number}
              </span>
              <span className="min-w-0">
                <span
                  className={`block font-semibold ${
                    isCurrent ? "text-brand-700" : ""
                  }`}
                >
                  {def.name}
                  {isCurrent && (
                    <span className="ml-2 rounded-full bg-brand-600 px-2 py-0.5 text-xs font-medium text-white">
                      現在のステップ
                    </span>
                  )}
                </span>
                <span className="block truncate text-sm text-gray-500">
                  {def.description}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
