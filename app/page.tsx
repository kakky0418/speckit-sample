"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import type { InvestmentPlan, SimulationResult } from "@/lib/types";
import { calculateSimulation } from "@/lib/calculator";
import { validateInvestmentPlan } from "@/lib/validation";
import { INPUT_CONSTRAINTS } from "@/lib/constants";
import { InvestmentChart } from "@/components/InvestmentChart";
import styles from "./page.module.css";

export default function Home() {
  const [plan, setPlan] = useState<InvestmentPlan>({
    monthlyAmount: 30000,
    years: 20,
    annualRate: INPUT_CONSTRAINTS.DEFAULT_ANNUAL_RATE,
  });

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleCalculate = () => {
    const validation = validateInvestmentPlan(plan);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setResult(null);
      return;
    }

    setErrors([]);
    const calculatedResult = calculateSimulation(plan);
    setResult(calculatedResult);
  };

  const handleInputChange = (field: keyof InvestmentPlan, value: number) => {
    setPlan((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          NISA積立シミュレーター
        </h1>

        {/* ナビゲーション */}
        <div className={styles.navigation}>
          <Link
            href="/comparison"
            className={styles.comparisonLink}
          >
            複数シナリオ比較 →
          </Link>
        </div>

        {/* 2カラムレイアウト: デスクトップでは左右、モバイルでは上下 */}
        <div className={styles.layout}>
          {/* 左カラム: 入力フォーム */}
          <div className={styles.column}>
            {/* 入力フォーム */}
            <div className={styles.card}>
          <h2 className={styles.cardTitle}>積立条件を入力</h2>

          <div className={styles.formGroup}>
            <div>
              <label className={styles.label}>
                毎月の積立額（円）
              </label>
              <input
                type="number"
                value={plan.monthlyAmount}
                onChange={(e) => handleInputChange("monthlyAmount", Number(e.target.value))}
                className={styles.input}
                min={INPUT_CONSTRAINTS.MIN_MONTHLY_AMOUNT}
              />
            </div>

            <div>
              <label className={styles.label}>
                積立期間（年）
              </label>
              <input
                type="number"
                value={plan.years}
                onChange={(e) => handleInputChange("years", Number(e.target.value))}
                className={styles.input}
                min={INPUT_CONSTRAINTS.MIN_YEARS}
                max={INPUT_CONSTRAINTS.MAX_YEARS}
              />
            </div>

            <div>
              <label className={styles.label}>
                想定年利回り（%）
              </label>
              <input
                type="number"
                value={plan.annualRate}
                onChange={(e) => handleInputChange("annualRate", Number(e.target.value))}
                className={styles.input}
                min={INPUT_CONSTRAINTS.MIN_ANNUAL_RATE}
                max={INPUT_CONSTRAINTS.MAX_ANNUAL_RATE}
                step="0.1"
              />
            </div>

            <button
              onClick={handleCalculate}
              className={styles.button}
            >
              計算する
            </button>
          </div>

          {/* エラー表示 */}
          {errors.length > 0 && (
            <div className={styles.errorContainer}>
              <p className={styles.errorTitle}>入力エラー:</p>
              <ul className={styles.errorList}>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
            </div>
          </div>

          {/* 右カラム: 結果表示 */}
          {result && (
            <div className={styles.column}>
              {/* 結果表示 */}
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>シミュレーション結果</h2>

                <div className={styles.formGroup}>
                  <div className={styles.resultGrid}>
                    <div className={clsx(styles.resultCard, styles.resultCardGreen)}>
                      <p className={styles.resultLabel}>総資産額</p>
                      <p className={clsx(styles.resultValue, styles.resultValueGreen)}>
                        {result.totalAssets.toLocaleString('ja-JP')}円
                      </p>
                    </div>

                    <div className={clsx(styles.resultCard, styles.resultCardBlue)}>
                      <p className={styles.resultLabel}>元本合計</p>
                      <p className={clsx(styles.resultValue, styles.resultValueBlue)}>
                        {result.totalPrincipal.toLocaleString('ja-JP')}円
                      </p>
                    </div>

                    <div className={clsx(styles.resultCard, styles.resultCardPurple)}>
                      <p className={styles.resultLabel}>運用益</p>
                      <p className={clsx(styles.resultValue, styles.resultValuePurple)}>
                        {result.totalProfit.toLocaleString('ja-JP')}円
                      </p>
                    </div>
                  </div>

                  {/* NISA枠情報 */}
                  <div className={clsx(styles.nisaInfo, {
                    [styles.nisaInfoError]: result.isOverNisaLimit
                  })}>
                    <p className={styles.nisaTitle}>NISA投資枠の活用状況</p>
                    <p className={styles.nisaText}>
                      年間投資額: <span className={styles.nisaValue}>{result.annualInvestment.toLocaleString('ja-JP')}円</span>
                    </p>
                    <p className={styles.nisaText}>
                      活用率: <span className={styles.nisaValue}>{(result.nisaUtilizationRate * 100).toFixed(1)}%</span>
                    </p>
                    {result.isOverNisaLimit && (
                      <p className={styles.nisaWarning}>
                        ⚠️ 年間投資額がNISA枠（120万円）を超過しています
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* グラフ表示 */}
              <div className={styles.card}>
                <InvestmentChart chartData={result.chartData} />
              </div>
            </div>
          )}
        </div>

        {/* 免責事項 */}
        <div className={styles.disclaimer}>
          <p className={styles.disclaimerText}>
            ※ 本シミュレーションは参考値であり、実際の運用結果を保証するものではありません。投資判断は自己責任で行ってください。
          </p>
        </div>
      </main>
    </div>
  );
}
