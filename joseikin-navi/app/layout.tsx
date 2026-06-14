import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "助成金ナビ | ホリエモンAI学校の無料助成金診断サイト",
  description:
    "AI研修の費用、最大75%が戻ってきます。人材開発支援助成金（事業展開等リスキリング支援コース・定額制訓練）の対象か2分で無料診断。登録不要・完全無料。",
  openGraph: {
    title: "ホリエモンAI学校の無料助成金診断サイト",
    description: "AI研修の費用、最大75%が戻ってきます。2分で無料診断。登録不要・完全無料。",
    url: "https://jshindan.vercel.app",
    siteName: "助成金ナビ",
    images: [
      {
        url: "https://jshindan.vercel.app/ogp.png",
        width: 1200,
        height: 630,
        alt: "ホリエモンAI学校の無料助成金診断サイト",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ホリエモンAI学校の無料助成金診断サイト",
    description: "AI研修の費用、最大75%が戻ってきます。2分で無料診断。",
    images: ["https://jshindan.vercel.app/ogp.png"],
  },
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
