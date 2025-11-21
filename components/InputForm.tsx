"use client";

import React from "react";
import { INPUT_CONSTRAINTS } from "@/lib/constants";
import type { InvestmentPlan } from "@/lib/types";
import styles from "@/app/page.module.css";

interface InputFormProps {
  plan: InvestmentPlan;
  errors: string[];
  onChange: (field: keyof InvestmentPlan, value: number | undefined) => void;
  onSubmit: () => void;
}

export function InputForm({ plan, errors, onChange, onSubmit }: InputFormProps) {
  const handleNumericChange = (
    field: keyof InvestmentPlan,
    value: string,
    multiplier: number = 1,
    allowUndefined: boolean = false
  ) => {
    const normalizedValue = value.replace(/^0+(?=\d)/, "");
    if (normalizedValue === "") {
      onChange(field, allowUndefined ? undefined : 0);
      return;
    }
    const nextValue = Number(normalizedValue) * multiplier;
    onChange(field, nextValue);
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>積立条件を入力</h2>

      <div className={styles.formGroup}>
        <div>
          <label className={styles.label} htmlFor="monthlyAmount">
            毎月の積立額（万円）
          </label>
          <input
            type="number"
            id="monthlyAmount"
            value={(plan.monthlyAmount ?? 0) / 10000}
            onChange={(e) => handleNumericChange("monthlyAmount", e.target.value, 10000)}
            className={styles.input}
            min={INPUT_CONSTRAINTS.MIN_MONTHLY_AMOUNT / 10000}
            step="0.1"
          />
        </div>

        <div>
          <label className={styles.label} htmlFor="years">
            積立期間（年）
          </label>
          <input
            type="number"
            id="years"
            value={plan.years}
            onChange={(e) => handleNumericChange("years", e.target.value)}
            className={styles.input}
            min={INPUT_CONSTRAINTS.MIN_YEARS}
            max={INPUT_CONSTRAINTS.MAX_YEARS}
          />
        </div>

        <div>
          <label className={styles.label} htmlFor="annualRate">
            想定年利回り（%）
          </label>
          <input
            type="number"
            id="annualRate"
            value={plan.annualRate}
            onChange={(e) => handleNumericChange("annualRate", e.target.value)}
            className={styles.input}
            min={INPUT_CONSTRAINTS.MIN_ANNUAL_RATE}
            max={INPUT_CONSTRAINTS.MAX_ANNUAL_RATE}
            step="0.1"
          />
        </div>

        <div>
          <label className={styles.label} htmlFor="initialAmount">
            初回投資額（万円）
          </label>
          <input
            type="number"
            id="initialAmount"
            value={(plan.initialAmount ?? 0) / 10000}
            onChange={(e) => handleNumericChange("initialAmount", e.target.value, 10000, true)}
            className={styles.input}
            min="0"
            placeholder="0"
            step="1"
          />
        </div>

        <div>
          <label className={styles.label} htmlFor="currentAge">
            現在の年齢
          </label>
          <input
            type="number"
            id="currentAge"
            value={plan.currentAge ?? ""}
            onChange={(e) => handleNumericChange("currentAge", e.target.value, 1, true)}
            className={styles.input}
            min="1"
            max="120"
            step="1"
            placeholder="任意"
          />
        </div>

        <button
          onClick={onSubmit}
          className={styles.button}
        >
          計算する
        </button>
      </div>

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
  );
}
