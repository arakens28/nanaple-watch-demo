import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createServerSupabase } from "@/lib/supabase-server";

const FROM = process.env.RESEND_FROM ?? "助成金ナビ <noreply@horiemon.ai>";
const ADMIN_EMAIL = "araki@telewor.com";

export async function POST(req: NextRequest) {
  // RESEND_API_KEY未設定の場合は無視して正常終了
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ ok: true });
  }

  // ログイン済みユーザーのみ呼べる
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const userEmail = user.email;

  await Promise.allSettled([
    // ユーザー本人へのお礼メール
    resend.emails.send({
      from: FROM,
      to: userEmail,
      subject: "【助成金ナビ】ご登録ありがとうございます",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h1 style="font-size: 20px; color: #111;">ご登録ありがとうございます</h1>
          <p>助成金ナビへのご登録が完了しました。</p>
          <p>人材開発支援助成金（事業展開等リスキリング支援コース）の申請を、ステップごとにサポートします。</p>
          <p style="margin-top: 24px;">
            <a href="https://jshindan.vercel.app/dashboard"
               style="background: #FFD600; color: #111; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">
              マイページを開く →
            </a>
          </p>
          <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #888;">
            このサービスは申請代行ではありません。書類の記入・提出は必ずご自身で行っていただきます。<br />
            ご不明な点は管轄の労働局にご確認ください。
          </p>
        </div>
      `,
    }),

    // 管理者への通知メール
    resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `【助成金ナビ】新規登録: ${userEmail}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h1 style="font-size: 18px;">新規アカウント登録通知</h1>
          <p><strong>メールアドレス:</strong> ${userEmail}</p>
          <p><strong>登録日時:</strong> ${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}</p>
          <p style="margin-top: 16px;">
            <a href="https://jshindan.vercel.app/admin" style="color: #1d4ed8;">管理画面で確認する →</a>
          </p>
        </div>
      `,
    }),
  ]);

  return NextResponse.json({ ok: true });
}
