import type { SupabaseClient } from "@supabase/supabase-js";

export type Application = {
  id: string;
  user_id: string;
  company_name: string | null;
  created_at: string;
  current_step: number;
};

export type StepStatus = {
  id: string;
  application_id: string;
  step_number: number;
  status: "todo" | "in_progress" | "done";
  completed_at: string | null;
  notes: string | null;
  updated_at: string;
};

/** ユーザーの申請案件を取得（無ければ作成し、6ステップ分のステータス行も用意する） */
export async function getOrCreateApplication(
  supabase: SupabaseClient
): Promise<{ application: Application; steps: StepStatus[] }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("not authenticated");

  let { data: application } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!application) {
    const { data: created, error } = await supabase
      .from("applications")
      .insert({ user_id: user.id })
      .select()
      .single();
    if (error) throw error;
    application = created;
  }

  const { data: existing } = await supabase
    .from("step_statuses")
    .select("*")
    .eq("application_id", application.id)
    .order("step_number");

  let steps = existing ?? [];
  const missing = [1, 2, 3, 4, 5, 6].filter(
    (n) => !steps.some((s) => s.step_number === n)
  );
  if (missing.length > 0) {
    const { data: inserted, error } = await supabase
      .from("step_statuses")
      .insert(
        missing.map((n) => ({
          application_id: application!.id,
          step_number: n,
          status: n === 1 ? "in_progress" : "todo",
        }))
      )
      .select();
    if (error) throw error;
    steps = [...steps, ...(inserted ?? [])].sort(
      (a, b) => a.step_number - b.step_number
    );
  }

  return { application, steps };
}

/** ステップのメモ（JSON）を保存する */
export async function saveStepNotes(
  supabase: SupabaseClient,
  applicationId: string,
  stepNumber: number,
  notes: unknown
) {
  const { error } = await supabase
    .from("step_statuses")
    .update({ notes: JSON.stringify(notes), updated_at: new Date().toISOString() })
    .eq("application_id", applicationId)
    .eq("step_number", stepNumber);
  if (error) throw error;
}

/** ステップを完了にして、申請案件の現在ステップを進める */
export async function completeStep(
  supabase: SupabaseClient,
  applicationId: string,
  stepNumber: number
) {
  const now = new Date().toISOString();
  const { error: e1 } = await supabase
    .from("step_statuses")
    .update({ status: "done", completed_at: now, updated_at: now })
    .eq("application_id", applicationId)
    .eq("step_number", stepNumber);
  if (e1) throw e1;

  if (stepNumber < 6) {
    const next = stepNumber + 1;
    const { error: e2 } = await supabase
      .from("applications")
      .update({ current_step: next })
      .eq("id", applicationId);
    if (e2) throw e2;
    const { error: e3 } = await supabase
      .from("step_statuses")
      .update({ status: "in_progress", updated_at: now })
      .eq("application_id", applicationId)
      .eq("step_number", next)
      .eq("status", "todo");
    if (e3) throw e3;
  }
}

export function parseNotes<T>(notes: string | null): T | null {
  if (!notes) return null;
  try {
    return JSON.parse(notes) as T;
  } catch {
    return null;
  }
}
