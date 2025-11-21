"use client";

import { useState } from "react";
import Link from "next/link";
import type { SimulationResult } from "@/lib/types";
import { calculateSimulation } from "@/lib/calculator";
import { validateAge, validateInvestmentPlan } from "@/lib/validation";
import { generateMilestones } from "@/lib/ageUtils";
import { InvestmentChart } from "@/components/InvestmentChart";
import { InputForm } from "@/components/InputForm";
import { ResultDisplay } from "@/components/ResultDisplay";
import { Milestone } from "@/components/Milestone";
import { ReverseCalculator } from "@/components/ReverseCalculator";
import { useInvestmentPlan } from "@/contexts/InvestmentPlanContext";
import styles from "./page.module.css";

export default function Home() {
  const { plan, updatePlan } = useInvestmentPlan();
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [reverseMode, setReverseMode] = useState<boolean>(false);

  const handleCalculate = () => {
    const ageValidation = validateAge(plan.currentAge);
    const planValidation = validateInvestmentPlan(plan);
    const combinedErrors = [...ageValidation.errors, ...planValidation.errors];

    if (!ageValidation.isValid || !planValidation.isValid) {
      setErrors(combinedErrors);
      setResult(null);
      return;
    }

    setErrors([]);
    const calculatedResult = calculateSimulation(plan);
    setResult(calculatedResult);
  };

  const handleApplyReverseAmount = (amount: number) => {
    updatePlan("monthlyAmount", amount);
    setReverseMode(false);
    setErrors([]);
    setResult(null);
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
          <Link
            href="/tax-comparison"
            className={styles.comparisonLink}
          >
            税金比較（NISA vs 特定口座）→
          </Link>
        </div>

        {/* 2カラムレイアウト: デスクトップでは左右、モバイルでは上下 */}
        <div className={styles.layout}>
          {/* 左カラム: 入力フォーム */}
          <div className={styles.column}>
            <InputForm
              plan={plan}
              errors={errors}
              onChange={updatePlan}
              onSubmit={handleCalculate}
            />

            <div className={styles.card}>
              <div className={styles.reverseHeader}>
                <h2 className={styles.cardTitle}>目標から逆算する</h2>
                <button
                  className={styles.toggleButton}
                  onClick={() => setReverseMode((prev) => !prev)}
                >
                  {reverseMode ? '通常モードに戻る' : '逆算モードを開く'}
                </button>
              </div>
              {reverseMode && (
                <ReverseCalculator
                  defaultParams={{
                    currentAge: plan.currentAge ?? 30,
                    targetAge: (plan.currentAge ?? 30) + 20,
                    targetAmount: 20000000,
                    annualRate: plan.annualRate,
                    initialAmount: plan.initialAmount ?? 0,
                  }}
                  onApply={handleApplyReverseAmount}
                />
              )}
            </div>
          </div>

          {/* 右カラム: 結果表示 */}
          {result && (
            <div className={styles.column}>
              <ResultDisplay plan={plan} result={result} />

              {plan.currentAge !== undefined && (
                <div className={styles.card}>
                  <Milestone
                    milestones={generateMilestones(plan.currentAge, plan.years, result.chartData)}
                  />
                </div>
              )}

              {/* グラフ表示 */}
              <div className={styles.card}>
                <InvestmentChart chartData={result.chartData} currentAge={plan.currentAge} />
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
