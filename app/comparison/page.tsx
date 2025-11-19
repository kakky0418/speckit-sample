"use client";

import { useState } from "react";
import Link from "next/link";
import type { InvestmentPlan, Scenario } from "@/lib/types";
import { calculateMultipleScenarios } from "@/lib/calculator";
import { validateInvestmentPlan } from "@/lib/validation";
import { INPUT_CONSTRAINTS } from "@/lib/constants";
import { ComparisonChart } from "@/components/ComparisonChart";
import styles from "./page.module.css";

// デフォルトシナリオ設定
const DEFAULT_SCENARIOS = [
  { name: "保守的", annualRate: 3, color: "rgb(251, 146, 60)" }, // orange
  { name: "標準", annualRate: 5, color: "rgb(59, 130, 246)" }, // blue
  { name: "楽観的", annualRate: 7, color: "rgb(34, 197, 94)" }, // green
];

export default function ComparisonPage() {
  const [plan, setPlan] = useState<InvestmentPlan>({
    monthlyAmount: 30000,
    years: 20,
    annualRate: INPUT_CONSTRAINTS.DEFAULT_ANNUAL_RATE,
  });

  const [scenarios, setScenarios] = useState(DEFAULT_SCENARIOS);
  const [results, setResults] = useState<Scenario[] | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleCalculate = () => {
    const validation = validateInvestmentPlan(plan);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setResults(null);
      return;
    }

    setErrors([]);
    const calculatedResults = calculateMultipleScenarios(plan, scenarios);
    setResults(calculatedResults);
  };

  const handleInputChange = (field: keyof InvestmentPlan, value: number) => {
    setPlan((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleScenarioRateChange = (index: number, newRate: number) => {
    setScenarios((prev) =>
      prev.map((scenario, i) =>
        i === index ? { ...scenario, annualRate: newRate } : scenario
      )
    );
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* ヘッダー */}
        <div className={styles.header}>
          <Link
            href="/"
            className={styles.backLink}
          >
            ← 基本シミュレーターに戻る
          </Link>
          <h1 className={styles.title}>
            運用シナリオ比較
          </h1>
          <p className={styles.subtitle}>
            複数の想定利回りで同時にシミュレーションを実行し、結果を比較できます
          </p>
        </div>

        {/* 基本条件入力フォーム */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>基本条件を入力</h2>

          <div className={styles.formGrid2}>
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

        {/* シナリオ設定 */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>シナリオ設定</h2>

          <div className={styles.scenarioGrid}>
            {scenarios.map((scenario, index) => (
              <div
                key={index}
                className={styles.scenarioCard}
                style={{ borderColor: scenario.color }}
              >
                <p className={styles.scenarioName}>{scenario.name}</p>
                <label className={styles.label}>
                  想定年利回り（%）
                </label>
                <input
                  type="number"
                  value={scenario.annualRate}
                  onChange={(e) => handleScenarioRateChange(index, Number(e.target.value))}
                  className={styles.input}
                  min={INPUT_CONSTRAINTS.MIN_ANNUAL_RATE}
                  max={INPUT_CONSTRAINTS.MAX_ANNUAL_RATE}
                  step="0.1"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleCalculate}
            className={styles.button}
          >
            比較計算する
          </button>
        </div>

        {/* 結果表示 */}
        {results && (
          <>
            {/* 数値結果 */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>シミュレーション結果比較</h2>

              <div className={styles.resultGrid}>
                {results.map((scenario, index) => (
                  <div
                    key={index}
                    className={styles.resultCard}
                    style={{ borderColor: scenario.color }}
                  >
                    <h3 className={styles.resultTitle}>
                      {scenario.name}（{scenario.annualRate}%）
                    </h3>

                    <div className={styles.resultItems}>
                      <div>
                        <p className={styles.resultLabel}>総資産額</p>
                        <p className={styles.resultValueLarge} style={{ color: scenario.color }}>
                          {scenario.result.totalAssets.toLocaleString('ja-JP')}円
                        </p>
                      </div>

                      <div>
                        <p className={styles.resultLabel}>元本合計</p>
                        <p className={styles.resultValueMedium}>
                          {scenario.result.totalPrincipal.toLocaleString('ja-JP')}円
                        </p>
                      </div>

                      <div>
                        <p className={styles.resultLabel}>運用益</p>
                        <p className={styles.resultValueMedium}>
                          {scenario.result.totalProfit.toLocaleString('ja-JP')}円
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* グラフ比較 */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>資産推移グラフ比較</h2>
              <ComparisonChart scenarios={results} />
            </div>
          </>
        )}

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
