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

// 特定口座の税率（所得税 15.315% + 住民税 5% = 20.315%）
const TAX_RATE = 0.20315;

/**
 * NISA と特定口座の税金比較を計算する
 */
export function calculateTaxComparison(plan: InvestmentPlan): import('./types').TaxComparisonResult {
  const { monthlyAmount, years, annualRate } = plan;

  // 1. 元本合計
  const principal = monthlyAmount * years * 12;

  // 2. 総資産額（複利計算）
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;

  let totalAssets: number;
  if (monthlyRate === 0) {
    totalAssets = monthlyAmount * months;
  } else {
    totalAssets = monthlyAmount * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
  }

  // 3. 運用益（税引前）
  const profitBeforeTax = totalAssets - principal;

  // 4. 税金計算（運用益がマイナスまたは 0 の場合は税金 0）
  const tax = profitBeforeTax > 0 ? profitBeforeTax * TAX_RATE : 0;

  // 5. NISA の結果（税金なし）
  const nisa = {
    totalAssets: Math.floor(totalAssets),
    tax: 0,
    netAssets: Math.floor(totalAssets),
  };

  // 6. 特定口座の結果（税金あり）
  const tokutei = {
    totalAssetsBeforeTax: Math.floor(totalAssets),
    tax: Math.floor(tax),
    netAssets: Math.floor(totalAssets - tax),
  };

  // 7. 節税額
  const taxSavings = nisa.netAssets - tokutei.netAssets;

  return {
    nisa,
    tokutei,
    taxSavings,
    principal: Math.floor(principal),
    profitBeforeTax: Math.floor(profitBeforeTax),
  };
}

/**
 * 年次ごとの税金比較データを生成する（グラフ用）
 */
export function calculateYearlyTaxComparison(plan: InvestmentPlan): import('./types').YearlyTaxData[] {
  const { monthlyAmount, years, annualRate } = plan;
  const monthlyRate = annualRate / 12 / 100;
  const yearlyData: import('./types').YearlyTaxData[] = [];

  for (let year = 0; year <= years; year++) {
    const monthsPassed = year * 12;
    const principal = monthlyAmount * monthsPassed;

    // 総資産額（税引前）
    let totalAssets: number;
    if (monthlyRate === 0) {
      totalAssets = principal;
    } else {
      if (monthsPassed === 0) {
        totalAssets = 0;
      } else {
        totalAssets = monthlyAmount * (Math.pow(1 + monthlyRate, monthsPassed) - 1) / monthlyRate;
      }
    }

    // 運用益
    const profit = totalAssets - principal;

    // 税金（運用益がマイナスまたは 0 の場合は 0）
    const tax = profit > 0 ? profit * TAX_RATE : 0;

    // NISA: 税金なし
    const nisaNetAssets = totalAssets;

    // 特定口座: 税金あり
    const tokuteiNetAssets = totalAssets - tax;

    yearlyData.push({
      year,
      principal: Math.floor(principal),
      nisaNetAssets: Math.floor(nisaNetAssets),
      tokuteiNetAssets: Math.floor(tokuteiNetAssets),
      taxAmount: Math.floor(tax),
    });
  }

  return yearlyData;
}
