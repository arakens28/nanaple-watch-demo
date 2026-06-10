"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function AppHeader() {
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/dashboard" className="font-bold text-brand-700">
          助成金ナビ
        </Link>
        <button
          onClick={logout}
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          ログアウト
        </button>
      </div>
    </header>
  );
}
