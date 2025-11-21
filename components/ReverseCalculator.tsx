"use client";

import React, { useState } from "react";
import { calculateRequiredMonthlyAmount } from "@/lib/ageUtils";
import type { ReverseCalculationParams, ReverseCalculationResult } from "@/lib/types";
import styles from "./ReverseCalculator.module.css";

interface ReverseCalculatorProps {
  defaultParams?: Partial<ReverseCalculationParams>;
  onApply: (amount: number) => void;
}

export function ReverseCalculator({ defaultParams, onApply }: ReverseCalculatorProps) {
  const [params, setParams] = useState<ReverseCalculationParams>({
    currentAge: defaultParams?.currentAge ?? 30,
    targetAge: defaultParams?.targetAge ?? 60,
    targetAmount: defaultParams?.targetAmount ?? 10000000,
    annualRate: defaultParams?.annualRate ?? 5,
    initialAmount: defaultParams?.initialAmount ?? 0,
  });
  const [result, setResult] = useState<ReverseCalculationResult | null>(null);

  const handleChange = (field: keyof ReverseCalculationParams, value: string) => {
    const numeric = value === '' ? 0 : Number(value);
    setParams((prev) => ({ ...prev, [field]: numeric }));
  };

  const handleCalculate = () => {
    const nextResult = calculateRequiredMonthlyAmount(params);
    setResult(nextResult);
  };

  const handleApply = () => {
    if (!result) return;
    onApply(Math.round(result.requiredMonthlyAmount));
  };

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="currentAge">現在の年齢</label>
          <input
            type="number"
            className={styles.input}
            id="currentAge"
            value={params.currentAge}
            onChange={(e) => handleChange("currentAge", e.target.value)}
            min={1}
            max={120}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="targetAge">目標年齢</label>
          <input
            type="number"
            className={styles.input}
            id="targetAge"
            value={params.targetAge}
            onChange={(e) => handleChange("targetAge", e.target.value)}
            min={1}
            max={150}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="targetAmount">目標資産額（円）</label>
          <input
            type="number"
            className={styles.input}
            id="targetAmount"
            value={params.targetAmount}
            onChange={(e) => handleChange("targetAmount", e.target.value)}
            min={0}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="annualRate">想定年利回り（%）</label>
          <input
            type="number"
            className={styles.input}
            id="annualRate"
            value={params.annualRate}
            onChange={(e) => handleChange("annualRate", e.target.value)}
            step="0.1"
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="initialAmount">初回投資額（円）</label>
        <input
          type="number"
          className={styles.input}
          id="initialAmount"
          value={params.initialAmount ?? 0}
          onChange={(e) => handleChange("initialAmount", e.target.value)}
          min={0}
        />
      </div>

      <div className={styles.actions}>
        <button className={styles.button} onClick={handleCalculate}>
          逆算する
        </button>
        <button className={styles.buttonSecondary} onClick={handleApply} disabled={!result}>
          この金額でシミュレーションする
        </button>
      </div>

      {result && (
        <div className={styles.result}>
          <p className={styles.resultLabel}>必要な毎月の積立額</p>
          <p className={styles.resultValue}>
            約 {Math.round(result.requiredMonthlyAmount).toLocaleString('ja-JP')} 円 / 月（{result.years} 年）
          </p>
          {result.warningMessage && (
            <p className={styles.warning}>{result.warningMessage}</p>
          )}
        </div>
      )}
    </div>
  );
}
