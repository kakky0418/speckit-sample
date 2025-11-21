"use client";

import React from "react";
import clsx from "clsx";
import type { InvestmentPlan, SimulationResult } from "@/lib/types";
import styles from "@/app/page.module.css";

interface ResultDisplayProps {
  plan: InvestmentPlan;
  result: SimulationResult;
}

export function ResultDisplay({ plan, result }: ResultDisplayProps) {
  const heading = plan.currentAge !== undefined
    ? `${(plan.currentAge + plan.years).toLocaleString('ja-JP')} 歳時点での資産額`
    : `${plan.years.toLocaleString('ja-JP')} 年後の資産額`;

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>シミュレーション結果</h2>

      <p className={styles.resultLabel}>{heading}</p>

      <div className={styles.formGroup}>
        <div className={styles.resultGrid}>
          <div className={clsx(styles.resultCard, styles.resultCardGreen)}>
            <p className={styles.resultLabel}>総資産額</p>
            <p className={clsx(styles.resultValue, styles.resultValueGreen)}>
              {(result.totalAssets / 10000).toLocaleString('ja-JP', { maximumFractionDigits: 1 })}万円
            </p>
          </div>

          <div className={clsx(styles.resultCard, styles.resultCardBlue)}>
            <p className={styles.resultLabel}>元本合計</p>
            <p className={clsx(styles.resultValue, styles.resultValueBlue)}>
              {(result.totalPrincipal / 10000).toLocaleString('ja-JP', { maximumFractionDigits: 1 })}万円
            </p>
          </div>

          <div className={clsx(styles.resultCard, styles.resultCardPurple)}>
            <p className={styles.resultLabel}>運用益</p>
            <p className={clsx(styles.resultValue, styles.resultValuePurple)}>
              {(result.totalProfit / 10000).toLocaleString('ja-JP', { maximumFractionDigits: 1 })}万円
            </p>
          </div>
        </div>

        <div className={clsx(styles.nisaInfo, {
          [styles.nisaInfoError]: result.isOverNisaLimit,
        })}>
          <p className={styles.nisaTitle}>NISA投資枠の活用状況</p>
          <p className={styles.nisaText}>
            年間投資額: <span className={styles.nisaValue}>{(result.annualInvestment / 10000).toLocaleString('ja-JP', { maximumFractionDigits: 1 })}万円</span>
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
  );
}
