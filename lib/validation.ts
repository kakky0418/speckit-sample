// lib/validation.ts

import type { InvestmentPlan, ValidationResult } from './types';
import { INPUT_CONSTRAINTS } from './constants';

export function validateInvestmentPlan(plan: InvestmentPlan): ValidationResult {
  const errors: string[] = [];

  // monthlyAmount のバリデーション
  if (plan.monthlyAmount < INPUT_CONSTRAINTS.MIN_MONTHLY_AMOUNT) {
    errors.push(`積立額は${INPUT_CONSTRAINTS.MIN_MONTHLY_AMOUNT}円以上を入力してください`);
  }

  // years のバリデーション
  if (plan.years < INPUT_CONSTRAINTS.MIN_YEARS) {
    errors.push(`積立期間は${INPUT_CONSTRAINTS.MIN_YEARS}年以上を入力してください`);
  }
  if (plan.years > INPUT_CONSTRAINTS.MAX_YEARS) {
    errors.push(`積立期間は${INPUT_CONSTRAINTS.MAX_YEARS}年以下を入力してください`);
  }

  // annualRate のバリデーション
  if (plan.annualRate < INPUT_CONSTRAINTS.MIN_ANNUAL_RATE) {
    errors.push(`想定利回りは${INPUT_CONSTRAINTS.MIN_ANNUAL_RATE}%以上を入力してください`);
  }
  if (plan.annualRate > INPUT_CONSTRAINTS.MAX_ANNUAL_RATE) {
    errors.push(`想定利回りは${INPUT_CONSTRAINTS.MAX_ANNUAL_RATE}%以下を入力してください`);
  }

  // initialAmount のバリデーション（任意フィールド）
  if (plan.initialAmount !== undefined && plan.initialAmount < 0) {
    errors.push('初回投資額は0円以上を入力してください');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateMonthlyAmount(amount: number): { isValid: boolean; errorMessage?: string } {
  if (amount < INPUT_CONSTRAINTS.MIN_MONTHLY_AMOUNT) {
    return {
      isValid: false,
      errorMessage: `積立額は${INPUT_CONSTRAINTS.MIN_MONTHLY_AMOUNT}円以上を入力してください`,
    };
  }

  return { isValid: true };
}

export function validateYears(years: number): { isValid: boolean; errorMessage?: string } {
  if (years < INPUT_CONSTRAINTS.MIN_YEARS) {
    return {
      isValid: false,
      errorMessage: `積立期間は${INPUT_CONSTRAINTS.MIN_YEARS}年以上を入力してください`,
    };
  }
  if (years > INPUT_CONSTRAINTS.MAX_YEARS) {
    return {
      isValid: false,
      errorMessage: `積立期間は${INPUT_CONSTRAINTS.MAX_YEARS}年以下を入力してください`,
    };
  }

  return { isValid: true };
}

export function validateAnnualRate(rate: number): { isValid: boolean; errorMessage?: string } {
  if (rate < INPUT_CONSTRAINTS.MIN_ANNUAL_RATE) {
    return {
      isValid: false,
      errorMessage: `想定利回りは${INPUT_CONSTRAINTS.MIN_ANNUAL_RATE}%以上を入力してください`,
    };
  }
  if (rate > INPUT_CONSTRAINTS.MAX_ANNUAL_RATE) {
    return {
      isValid: false,
      errorMessage: `想定利回りは${INPUT_CONSTRAINTS.MAX_ANNUAL_RATE}%以下を入力してください`,
    };
  }

  return { isValid: true };
}

export function validateAge(age: number | undefined): ValidationResult {
  if (age === undefined) {
    return { isValid: true, errors: [] };
  }

  if (!Number.isInteger(age)) {
    return {
      isValid: false,
      errors: ['整数で入力してください'],
    };
  }

  if (age < 1 || age > 120) {
    return {
      isValid: false,
      errors: ['1 歳以上 120 歳以下で入力してください'],
    };
  }

  return { isValid: true, errors: [] };
}
