// lib/ageUtils.ts
// 年齢関連の計算ユーティリティ

import type {
  ChartDataPoint,
  Milestone,
  ReverseCalculationParams,
  ReverseCalculationResult,
} from './types';

export function calculateFutureAge(currentAge: number, years: number): number {
  return currentAge + years;
}

export function generateMilestones(currentAge: number, years: number, chartData: ChartDataPoint[]): Milestone[] {
  const milestones: Milestone[] = [];

  const maxAge = currentAge + years;
  const firstMilestone = Math.ceil(currentAge / 10) * 10;

  for (let age = firstMilestone; age <= maxAge; age += 10) {
    const yearFromNow = age - currentAge;
    const data = chartData.find((point) => point.year === yearFromNow);
    const assets = data?.totalAssets ?? 0;

    milestones.push({ age, yearFromNow, assets });
  }

  return milestones;
}

export function calculateRequiredMonthlyAmount(params: ReverseCalculationParams): ReverseCalculationResult {
  const { currentAge, targetAge, targetAmount, annualRate, initialAmount = 0 } = params;

  const years = targetAge - currentAge;
  if (years <= 0) {
    return {
      requiredMonthlyAmount: Infinity,
      years,
      isRealistic: false,
      warningMessage: '目標年齢は現在の年齢より大きくしてください',
    };
  }

  const months = years * 12;
  const monthlyRate = annualRate / 12 / 100;

  let requiredMonthlyAmount: number;

  if (monthlyRate === 0) {
    requiredMonthlyAmount = (targetAmount - initialAmount) / months;
  } else {
    const growthFromInitial = initialAmount * Math.pow(1 + monthlyRate, months);
    const remainingAmount = targetAmount - growthFromInitial;
    requiredMonthlyAmount = remainingAmount * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);
  }

  const isRealistic = requiredMonthlyAmount <= 1_000_000; // 月 100 万円以下を現実的と判定
  const warningMessage = isRealistic ? null : '目標達成には非現実的な積立額が必要です';

  return {
    requiredMonthlyAmount,
    years,
    isRealistic,
    warningMessage,
  };
}
