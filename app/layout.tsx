import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NISA積立シミュレーター",
  description: "NISA制度のつみたて投資枠を活用した積立シミュレーションツール",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
