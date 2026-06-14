import { createServerSupabase } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";

const ADMIN_EMAIL = "araki@telewor.com";

type StepRow = { step_number: number; status: string; notes: string | null };

type AppRow = {
  id: string;
  user_id: string;
  company_name: string | null;
  current_step: number;
  created_at: string;
  step_statuses: StepRow[];
};

type UserRow = {
  id: string;
  email?: string;
};

const STATUS_LABEL: Record<string, string> = {
  todo: "未着手",
  in_progress: "進行中",
  done: "完了",
};

const STATUS_COLOR: Record<string, string> = {
  todo: "bg-gray-100 text-gray-500",
  in_progress: "bg-amber-100 text-amber-700",
  done: "bg-green-100 text-green-700",
};

function parseStep1Prefecture(notes: string | null): string {
  if (!notes) return "-";
  try {
    const parsed = JSON.parse(notes) as { answers?: Record<string, string>; bureauList?: { prefecture: string }[] };
    if (parsed.bureauList && parsed.bureauList.length > 0) {
      return parsed.bureauList.map((b) => b.prefecture).join("、");
    }
    return parsed.answers?.prefecture ?? "-";
  } catch {
    return "-";
  }
}

export default async function AdminPage() {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center max-w-sm">
          <p className="font-bold text-red-700 text-lg mb-2">アクセス権限がありません</p>
          <p className="text-sm text-red-500 mb-1">ログイン中のメールアドレス:</p>
          <p className="font-mono text-sm text-red-700 mb-4">{user.email}</p>
          <a href="/dashboard" className="text-sm text-brand-600 underline">マイページへ戻る</a>
        </div>
      </div>
    );
  }

  // Service role key が必要。未設定の場合は案内を表示。
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="mb-4 text-xl font-bold">管理画面</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="font-bold text-red-700">設定が必要です</p>
          <p className="mt-2 text-sm text-red-600">
            管理画面を使用するには <code>SUPABASE_SERVICE_ROLE_KEY</code> をVercelの環境変数に追加してください。
          </p>
          <p className="mt-1 text-xs text-red-500">
            Supabase Dashboard → Settings → API → service_role （secret key）をコピーしてVercelに設定します。
          </p>
        </div>
      </div>
    );
  }

  // Service role クライアントで全データを取得（RLS バイパス）
  const { createClient } = await import("@supabase/supabase-js");
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const [{ data: applications }, { data: { users } }] = await Promise.all([
    adminClient
      .from("applications")
      .select(`id, user_id, company_name, current_step, created_at, step_statuses(step_number, status, notes)`)
      .order("created_at", { ascending: false }),
    adminClient.auth.admin.listUsers({ perPage: 200 }),
  ]);

  const appRows = (applications ?? []) as AppRow[];
  const userMap = new Map((users ?? []).map((u: UserRow) => [u.id, u.email ?? ""]));

  const doneCount = appRows.filter((a) => a.current_step >= 6).length;
  const activeCount = appRows.filter((a) => a.current_step >= 2 && a.current_step < 6).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div>
            <span className="font-bold text-brand-700">助成金ナビ 管理画面</span>
            <span className="ml-2 text-xs text-gray-400">ホリエモンAI学校</span>
          </div>
          <Link href="/dashboard" className="text-xs text-gray-500 underline">
            マイページへ
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="mb-2 text-2xl font-bold">申請状況 一覧</h1>
        <p className="mb-6 text-sm text-gray-500">
          登録企業: <strong>{appRows.length}</strong>社 　進行中: <strong>{activeCount}</strong>社 　完了: <strong>{doneCount}</strong>社
        </p>

        {/* サマリーカード */}
        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          {[
            { label: "登録総数", value: appRows.length, color: "border-blue-200 bg-blue-50 text-blue-700" },
            { label: "STEP1完了", value: appRows.filter((a) => a.step_statuses?.some((s) => s.step_number === 1 && s.status === "done")).length, color: "border-amber-200 bg-amber-50 text-amber-700" },
            { label: "STEP2以上進行中", value: activeCount, color: "border-purple-200 bg-purple-50 text-purple-700" },
            { label: "STEP6完了", value: doneCount, color: "border-green-200 bg-green-50 text-green-700" },
          ].map(({ label, value, color }) => (
            <div key={label} className={`rounded-xl border p-4 ${color}`}>
              <p className="text-xs font-semibold">{label}</p>
              <p className="mt-1 text-3xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        {/* 申請一覧テーブル */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">メールアドレス</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">社名</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">都道府県</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">現STEP</th>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <th key={n} className="px-3 py-3 text-center text-xs font-semibold text-gray-600">
                    S{n}
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">登録日</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {appRows.map((app) => {
                const email = userMap.get(app.user_id) ?? app.user_id.slice(0, 8) + "...";
                const step1Notes = app.step_statuses?.find((s) => s.step_number === 1)?.notes ?? null;
                const prefecture = parseStep1Prefecture(step1Notes);
                const createdDate = new Date(app.created_at).toLocaleDateString("ja-JP", {
                  year: "numeric", month: "2-digit", day: "2-digit",
                });

                return (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">{email}</td>
                    <td className="px-4 py-3 text-gray-700">{app.company_name ?? <span className="text-gray-400">未設定</span>}</td>
                    <td className="px-4 py-3 text-gray-700">{prefecture}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-700">
                        STEP{app.current_step}
                      </span>
                    </td>
                    {[1, 2, 3, 4, 5, 6].map((n) => {
                      const step = app.step_statuses?.find((s) => s.step_number === n);
                      const status = step?.status ?? "todo";
                      return (
                        <td key={n} className="px-3 py-3 text-center">
                          <span className={`rounded-full px-1.5 py-0.5 text-xs font-medium ${STATUS_COLOR[status]}`}>
                            {STATUS_LABEL[status] ?? status}
                          </span>
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-xs text-gray-400">{createdDate}</td>
                  </tr>
                );
              })}
              {appRows.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-sm text-gray-400">
                    登録企業がありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
