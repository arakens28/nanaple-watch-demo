"use client";

import Link from "next/link";
import AppHeader from "./AppHeader";
import AIAdvisor from "./AIAdvisor";
import ChatDrawer from "./ChatDrawer";
import { STEP_NAMES } from "@/lib/steps";

/** ステップページ共通レイアウト（ヘッダー + 2カラム + チャット） */
export default function StepShell({
  step,
  adviceContext,
  children,
}: {
  step: number;
  adviceContext?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-brand-600"
          >
            ← マイページに戻る
          </Link>
          <h1 className="mt-2 text-2xl font-bold">
            <span className="mr-2 text-brand-600">STEP {step}</span>
            {STEP_NAMES[step]}
          </h1>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
          <div>{children}</div>
          <AIAdvisor step={step} context={adviceContext} />
        </div>
      </main>
      <ChatDrawer step={step} />
    </div>
  );
}
