"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import {
  getOrCreateApplication,
  type Application,
  type StepStatus,
} from "@/lib/application";
import { ProgressBar, StepList } from "@/components/StepProgress";
import AIAdvisor from "@/components/AIAdvisor";
import AppHeader from "@/components/AppHeader";
import ChatDrawer from "@/components/ChatDrawer";

export default function DashboardPage() {
  const [application, setApplication] = useState<Application | null>(null);
  const [steps, setSteps] = useState<StepStatus[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    getOrCreateApplication(supabase)
      .then(({ application, steps }) => {
        setApplication(application);
        setSteps(steps);
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

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold">マイページ</h1>
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
