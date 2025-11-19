"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useInvestmentPlan } from "@/contexts/InvestmentPlanContext";
import { calculateTaxComparison, calculateYearlyTaxComparison } from "@/lib/calculator";
import { TaxSavingsHighlight } from "@/components/TaxSavingsHighlight";
import { TaxComparisonBarChart } from "@/components/TaxComparisonBarChart";
import { TaxComparisonLineChart } from "@/components/TaxComparisonLineChart";
import { TaxDetailTable } from "@/components/TaxDetailTable";
import styles from "./page.module.css";

export default function TaxComparisonPage() {
  const { plan } = useInvestmentPlan();

  // 税金比較結果を計算
  const taxComparisonResult = useMemo(() => {
    return calculateTaxComparison(plan);
  }, [plan]);

  // 年次推移データを計算
  const yearlyData = useMemo(() => {
    return calculateYearlyTaxComparison(plan);
  }, [plan]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* ヘッダー */}
        <div className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← 基本シミュレーターに戻る
          </Link>
          <h1 className={styles.title}>NISA vs 特定口座 税金比較</h1>
          <p className={styles.subtitle}>
            NISA の非課税効果を視覚的に確認できます
          </p>
        </div>

        {/* 現在の条件表示 */}
        <div className={styles.conditionCard}>
          <h2 className={styles.conditionTitle}>シミュレーション条件</h2>
          <div className={styles.conditionGrid}>
            <div className={styles.conditionItem}>
              <span className={styles.conditionLabel}>毎月の積立額</span>
              <span className={styles.conditionValue}>
                {plan.monthlyAmount.toLocaleString('ja-JP')}円
              </span>
            </div>
            <div className={styles.conditionItem}>
              <span className={styles.conditionLabel}>積立期間</span>
              <span className={styles.conditionValue}>{plan.years}年</span>
            </div>
            <div className={styles.conditionItem}>
              <span className={styles.conditionLabel}>想定年利回り</span>
              <span className={styles.conditionValue}>{plan.annualRate}%</span>
            </div>
          </div>
        </div>

        {/* 節税額の強調表示 */}
        <TaxSavingsHighlight result={taxComparisonResult} />

        {/* グラフ */}
        <div className={styles.chartGrid}>
          <TaxComparisonBarChart result={taxComparisonResult} />
          <TaxComparisonLineChart yearlyData={yearlyData} />
        </div>

        {/* 詳細内訳テーブル */}
        <TaxDetailTable result={taxComparisonResult} />

        {/* 免責事項 */}
        <div className={styles.disclaimer}>
          <p className={styles.disclaimerText}>
            ※ 本シミュレーションは参考値であり、実際の運用結果を保証するものではありません。
            税率は特定口座の標準税率 20.315%（所得税 15.315% + 住民税 5%）を使用しています。
            投資判断は自己責任で行ってください。
          </p>
        </div>
      </main>
    </div>
  );
}
