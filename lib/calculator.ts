// lib/calculator.ts

import type { InvestmentPlan, SimulationResult, ChartDataPoint, Scenario } from './types';
import { NISA_LIMITS } from './constants';

export function calculateSimulation(plan: InvestmentPlan): SimulationResult {
  const { monthlyAmount, years, annualRate } = plan;

  // 1. 元本合計
  const totalPrincipal = monthlyAmount * years * 12;

  // 2. 総資産額（複利計算）
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;

  let totalAssets: number;
  if (monthlyRate === 0) {
    totalAssets = monthlyAmount * months;
  } else {
    totalAssets = monthlyAmount * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
  }

  // 3. 運用益
  const totalProfit = totalAssets - totalPrincipal;

  // 4. 年間投資額
  const annualInvestment = monthlyAmount * 12;

  // 5. NISA枠活用率
  const nisaUtilizationRate = annualInvestment / NISA_LIMITS.TSUMITATE_ANNUAL;

  // 6. NISA枠超過判定
  const isOverNisaLimit = annualInvestment > NISA_LIMITS.TSUMITATE_ANNUAL;

  // 7. グラフデータ生成
  const chartData = generateChartData(plan);

  return {
    totalAssets: Math.floor(totalAssets),
    totalPrincipal: Math.floor(totalPrincipal),
    totalProfit: Math.floor(totalProfit),
    annualInvestment: Math.floor(annualInvestment),
    nisaUtilizationRate,
    isOverNisaLimit,
    chartData,
  };
}

export function generateChartData(plan: InvestmentPlan): ChartDataPoint[] {
  const { monthlyAmount, years, annualRate } = plan;
  const monthlyRate = annualRate / 12 / 100;
  const chartData: ChartDataPoint[] = [];

  for (let year = 0; year <= years; year++) {
    const monthsPassed = year * 12;
    const principal = monthlyAmount * monthsPassed;

    let totalAssets: number;
    if (monthlyRate === 0) {
      totalAssets = principal;
    } else {
      totalAssets = monthlyAmount * (Math.pow(1 + monthlyRate, monthsPassed) - 1) / monthlyRate;
    }

    chartData.push({
      year,
      principal: Math.floor(principal),
      totalAssets: Math.floor(totalAssets),
    });
  }

  return chartData;
}

export function calculateMultipleScenarios(
  basePlan: InvestmentPlan,
  scenarioConfigs: { name: string; annualRate: number; color: string }[]
): Scenario[] {
  return scenarioConfigs.map((config) => {
    const plan: InvestmentPlan = {
      ...basePlan,
      annualRate: config.annualRate,
    };

    return {
      name: config.name,
      annualRate: config.annualRate,
      result: calculateSimulation(plan),
      color: config.color,
    };
  });
}
