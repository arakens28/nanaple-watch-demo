import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const FROM = process.env.RESEND_FROM ?? "助成金ナビ <noreply@horiebon.com>";
const ADMIN_EMAIL = "araki@telewor.com";

export async function POST(req: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ ok: true });
  }

  const { email } = (await req.json()) as { email?: string };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  await Promise.allSettled([
    resend.emails.send({
      from: FROM,
      to: email,
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

    resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `【助成金ナビ】新規登録: ${email}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h1 style="font-size: 18px;">新規アカウント登録通知</h1>
          <p><strong>メールアドレス:</strong> ${email}</p>
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
