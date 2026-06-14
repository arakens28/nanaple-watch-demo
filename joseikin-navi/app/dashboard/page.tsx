"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import {
  getOrCreateApplication,
  parseNotes,
  type Application,
  type StepStatus,
} from "@/lib/application";
import { ProgressBar, StepList } from "@/components/StepProgress";
import AIAdvisor from "@/components/AIAdvisor";
import AppHeader from "@/components/AppHeader";
import ChatDrawer from "@/components/ChatDrawer";
import { getBureauByPrefecture } from "@/lib/bureauData";
import type { BureauEntry } from "@/lib/bureauApplications";

type Step1Notes = {
  answers?: Record<string, string>;
  bureauList?: BureauEntry[];
};

export default function DashboardPage() {
  const [application, setApplication] = useState<Application | null>(null);
  const [steps, setSteps] = useState<StepStatus[]>([]);
  const [bureauList, setBureauList] = useState<BureauEntry[]>([]);
  const [companySize, setCompanySize] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    getOrCreateApplication(supabase)
      .then(({ application, steps }) => {
        setApplication(application);
        setSteps(steps);
        const step1 = steps.find((s) => s.step_number === 1);
        const notes = parseNotes<Step1Notes>(step1?.notes ?? null);
        if (notes?.bureauList && notes.bureauList.length > 0) {
          setBureauList(notes.bureauList.filter((b) => b.prefecture));
        } else if (notes?.answers?.prefecture) {
          setBureauList([{ prefecture: notes.answers.prefecture, employeeCount: 0 }]);
        }
        if (notes?.answers?.employees) {
          setCompanySize(notes.answers.employees);
        }
      })
      .catch(() =>
        setError("データの読み込みに失敗しました。再読み込みしてください。")
      );
  }, []);

  if (error) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto max-w-6xl px-6 py-8">
          <p className="text-sm text-red-600">{error}</p>
        </main>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto max-w-6xl px-6 py-8">
          <div className="h-3 w-full animate-pulse rounded-full bg-gray-200" />
          <div className="mt-6 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-xl bg-gray-100"
              />
            ))}
          </div>
        </main>
      </div>
    );
  }

  const isSME = companySize !== "100名以上";
  const subsidyRate = isSME ? 0.75 : 0.6;

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold">マイページ</h1>

        {/* 労働局ごとの申請カード */}
        {bureauList.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-3 text-sm font-semibold text-gray-600">
              申請案件（労働局ごと）
            </h2>
            <div className={`grid gap-3 ${bureauList.length > 1 ? "sm:grid-cols-2" : ""}`}>
              {bureauList.map((bureau, i) => {
                const info = getBureauByPrefecture(bureau.prefecture);
                const perPerson = Math.min(20000 * subsidyRate, 20000);
                const monthly = bureau.employeeCount > 0 ? Math.floor(perPerson * bureau.employeeCount) : null;
                return (
                  <div key={i} className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-blue-900">{bureau.prefecture}</p>
                        {info && <p className="text-xs text-blue-600">{info.name}</p>}
                      </div>
                      {bureau.employeeCount > 0 && (
                        <span className="rounded-full bg-blue-200 px-2 py-0.5 text-xs font-bold text-blue-800">
                          {bureau.employeeCount}名
                        </span>
                      )}
                    </div>
                    {monthly !== null && (
                      <div className="mt-2">
                        <p className="text-xs text-blue-500 mb-0.5">
                          月額助成試算（{isSME ? "中小75%" : "大企業60%"}・上限2万円/人）
                        </p>
                        <p className="text-lg font-bold text-blue-800">
                          約{monthly.toLocaleString()}円 / 月
                        </p>
                      </div>
                    )}
                    {info && (
                      <a
                        href={`tel:${info.phone.replace(/-/g, "")}`}
                        className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                      >
                        📞 {info.phone}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
            {bureauList.length === 0 && (
              <p className="text-sm text-gray-400">
                <a href="/step/1" className="underline">STEP1</a>で都道府県と受講人数を入力すると、ここに表示されます。
              </p>
            )}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
          <div className="space-y-6">
            <div className="card">
              <ProgressBar steps={steps} />
            </div>
            <StepList steps={steps} currentStep={application.current_step} />
          </div>
          <AIAdvisor step={application.current_step} />
        </div>
      </main>
      <ChatDrawer step={application.current_step} />
    </div>
  );
}
