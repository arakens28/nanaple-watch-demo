import type { SupabaseClient } from "@supabase/supabase-js";

export type BureauEntry = {
  prefecture: string;
  employeeCount: number;
};

export type BureauApplication = {
  id: string;
  application_id: string;
  prefecture: string;
  employee_count: number;
  tuition_per_person: number;
  plan_status: "todo" | "submitted" | "done";
  subsidy_status: "todo" | "submitted" | "done";
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type SubsidyEstimate = {
  prefecture: string;
  employeeCount: number;
  tuitionPerPerson: number;
  subsidyRate: number;
  monthlySubsidyEstimate: number;
};

const MAX_MONTHLY_SUBSIDY_PER_PERSON = 20000;

export function calcSubsidy(
  employeeCount: number,
  tuitionPerPerson: number,
  isSME: boolean
): SubsidyEstimate & { prefecture: string } {
  const rate = isSME ? 0.75 : 0.6;
  const subsidyPerPerson = Math.min(tuitionPerPerson * rate, MAX_MONTHLY_SUBSIDY_PER_PERSON);
  return {
    prefecture: "",
    employeeCount,
    tuitionPerPerson,
    subsidyRate: rate,
    monthlySubsidyEstimate: Math.floor(subsidyPerPerson * employeeCount),
  };
}

export async function getBureauApplications(
  supabase: SupabaseClient,
  applicationId: string
): Promise<BureauApplication[]> {
  const { data, error } = await supabase
    .from("bureau_applications")
    .select("*")
    .eq("application_id", applicationId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getBureauApplications error:", error);
    return [];
  }
  return (data ?? []) as BureauApplication[];
}

export async function upsertBureauApplication(
  supabase: SupabaseClient,
  applicationId: string,
  prefecture: string,
  employeeCount: number,
  tuitionPerPerson: number
): Promise<BureauApplication | null> {
  const { data: existing } = await supabase
    .from("bureau_applications")
    .select("id")
    .eq("application_id", applicationId)
    .eq("prefecture", prefecture)
    .single();

  if (existing) {
    const { data, error } = await supabase
      .from("bureau_applications")
      .update({ employee_count: employeeCount, tuition_per_person: tuitionPerPerson, updated_at: new Date().toISOString() })
      .eq("id", existing.id)
      .select()
      .single();
    if (error) return null;
    return data as BureauApplication;
  } else {
    const { data, error } = await supabase
      .from("bureau_applications")
      .insert({ application_id: applicationId, prefecture, employee_count: employeeCount, tuition_per_person: tuitionPerPerson })
      .select()
      .single();
    if (error) return null;
    return data as BureauApplication;
  }
}

export async function updateBureauStatus(
  supabase: SupabaseClient,
  bureauApplicationId: string,
  field: "plan_status" | "subsidy_status",
  status: "todo" | "submitted" | "done"
): Promise<void> {
  await supabase
    .from("bureau_applications")
    .update({ [field]: status, updated_at: new Date().toISOString() })
    .eq("id", bureauApplicationId);
}

export async function deleteBureauApplication(
  supabase: SupabaseClient,
  bureauApplicationId: string
): Promise<void> {
  await supabase.from("bureau_applications").delete().eq("id", bureauApplicationId);
}
