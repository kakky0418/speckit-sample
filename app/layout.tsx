import type { Metadata } from "next";
import "./globals.css";
import styles from "./layout.module.css";
import { InvestmentPlanProvider } from "@/contexts/InvestmentPlanContext";

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
      <body className={styles.body}>
        <InvestmentPlanProvider>
          {children}
        </InvestmentPlanProvider>
      </body>
    </html>
  );
}
