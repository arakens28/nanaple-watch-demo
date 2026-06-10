import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "助成金ナビ | 人材開発支援助成金の申請をステップごとにサポート",
  description:
    "人材開発支援助成金（事業展開等リスキリング支援コース・定額制訓練）の申請進捗を管理し、AIのアドバイスを受けながら申請を完遂できるサービスです。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
