import { describe, test, expect } from 'bun:test';
import {
  calculateSimulation,
  generateChartData,
  calculateMultipleScenarios,
  calculateTaxComparison,
  calculateYearlyTaxComparison
} from '@/lib/calculator';
import type { InvestmentPlan } from '@/lib/types';

describe('Calculator', () => {
  describe('calculateSimulation', () => {
    test('基本的な複利計算が正しく行われること', () => {
      const plan: InvestmentPlan = {
        monthlyAmount: 30000,
        years: 20,
        annualRate: 5,
      };

      const result = calculateSimulation(plan);

      // 元本合計: 30,000円 × 12ヶ月 × 20年 = 7,200,000円
      expect(result.totalPrincipal).toBe(7200000);

      // 総資産額は複利計算により約12,330,000円程度
      expect(result.totalAssets).toBeGreaterThan(12000000);
      expect(result.totalAssets).toBeLessThan(13000000);

      // 運用益 = 総資産額 - 元本
      expect(result.totalProfit).toBe(result.totalAssets - result.totalPrincipal);

      // 年間投資額: 30,000円 × 12ヶ月 = 360,000円
      expect(result.annualInvestment).toBe(360000);

      // NISA活用率: 360,000円 / 1,200,000円 = 0.3 (30%)
      expect(result.nisaUtilizationRate).toBeCloseTo(0.3, 2);

      // NISA枠超過していない
      expect(result.isOverNisaLimit).toBe(false);
    });

    test('利回り0%の場合、元本と総資産額が同じになること', () => {
      const plan: InvestmentPlan = {
        monthlyAmount: 50000,
        years: 10,
        annualRate: 0,
      };

      const result = calculateSimulation(plan);

      expect(result.totalAssets).toBe(result.totalPrincipal);
      expect(result.totalProfit).toBe(0);
    });

    test('マイナス利回りの場合、総資産額が元本より少なくなること', () => {
      const plan: InvestmentPlan = {
        monthlyAmount: 50000,
        years: 10,
        annualRate: -3,
      };

      const result = calculateSimulation(plan);

      expect(result.totalAssets).toBeLessThan(result.totalPrincipal);
      expect(result.totalProfit).toBeLessThan(0);
    });

    test('NISA枠を超過する場合、isOverNisaLimitがtrueになること', () => {
      const plan: InvestmentPlan = {
        monthlyAmount: 120000, // 年間144万円
        years: 10,
        annualRate: 5,
      };

      const result = calculateSimulation(plan);

      expect(result.annualInvestment).toBe(1440000);
      expect(result.isOverNisaLimit).toBe(true);
      expect(result.nisaUtilizationRate).toBeGreaterThan(1);
    });
  });

  describe('generateChartData', () => {
    test('正しい年数分のデータポイントが生成されること', () => {
      const plan: InvestmentPlan = {
        monthlyAmount: 30000,
        years: 20,
        annualRate: 5,
      };

      const chartData = generateChartData(plan);

      // 0年目から20年目まで、合計21個のデータポイント
      expect(chartData).toHaveLength(21);

      // 最初のデータポイント（0年目）
      expect(chartData[0].year).toBe(0);
      expect(chartData[0].principal).toBe(0);
      expect(chartData[0].totalAssets).toBe(0);

      // 最後のデータポイント（20年目）
      expect(chartData[20].year).toBe(20);
      expect(chartData[20].principal).toBe(7200000);
    });

    test('各年のデータが正しく計算されること', () => {
      const plan: InvestmentPlan = {
        monthlyAmount: 10000,
        years: 5,
        annualRate: 3,
      };

      const chartData = generateChartData(plan);

      // 1年目の元本: 10,000円 × 12ヶ月 = 120,000円
      expect(chartData[1].principal).toBe(120000);

      // 総資産額は元本より大きい（複利効果）
      expect(chartData[1].totalAssets).toBeGreaterThan(chartData[1].principal);
    });
  });

  describe('calculateMultipleScenarios', () => {
    test('複数シナリオの計算が正しく行われること', () => {
      const basePlan: InvestmentPlan = {
        monthlyAmount: 30000,
        years: 20,
        annualRate: 5, // この値は使われない
      };

      const scenarioConfigs = [
        { name: '保守的', annualRate: 3, color: 'rgb(251, 146, 60)' },
        { name: '標準', annualRate: 5, color: 'rgb(59, 130, 246)' },
        { name: '楽観的', annualRate: 7, color: 'rgb(34, 197, 94)' },
      ];

      const scenarios = calculateMultipleScenarios(basePlan, scenarioConfigs);

      // 3つのシナリオが返されること
      expect(scenarios).toHaveLength(3);

      // 各シナリオの基本的な構造を確認
      scenarios.forEach((scenario, index) => {
        expect(scenario.name).toBe(scenarioConfigs[index].name);
        expect(scenario.annualRate).toBe(scenarioConfigs[index].annualRate);
        expect(scenario.color).toBe(scenarioConfigs[index].color);
        expect(scenario.result).toBeDefined();
        expect(scenario.result.totalAssets).toBeGreaterThan(0);
      });

      // 利回りが高いほど総資産額が大きいことを確認
      expect(scenarios[0].result.totalAssets).toBeLessThan(scenarios[1].result.totalAssets);
      expect(scenarios[1].result.totalAssets).toBeLessThan(scenarios[2].result.totalAssets);

      // すべてのシナリオで元本は同じ
      const principal = scenarios[0].result.totalPrincipal;
      scenarios.forEach((scenario) => {
        expect(scenario.result.totalPrincipal).toBe(principal);
      });
    });
  });

  describe('calculateTaxComparison', () => {
    test('基本的な税金比較計算が正しく行われること', () => {
      const plan: InvestmentPlan = {
        monthlyAmount: 30000,
        years: 20,
        annualRate: 5,
      };

      const result = calculateTaxComparison(plan);

      // 元本合計
      expect(result.principal).toBe(7200000);

      // 運用益（税引前）
      expect(result.profitBeforeTax).toBeGreaterThan(5000000);

      // NISA: 税金0円
      expect(result.nisa.tax).toBe(0);
      expect(result.nisa.netAssets).toBe(result.nisa.totalAssets);

      // 特定口座: 税金あり（運用益 × 20.315%）
      expect(result.tokutei.tax).toBeGreaterThan(0);
      const expectedTax = Math.floor(result.profitBeforeTax * 0.20315);
      expect(result.tokutei.tax).toBe(expectedTax);

      // 手取り総資産が妥当な範囲内にあることを確認
      // 注: Math.floor の順序により、±1円程度の誤差が生じる可能性がある
      const approximateNetAssets = result.tokutei.totalAssetsBeforeTax - result.tokutei.tax;
      expect(result.tokutei.netAssets).toBeGreaterThanOrEqual(approximateNetAssets - 1);
      expect(result.tokutei.netAssets).toBeLessThanOrEqual(approximateNetAssets);

      // 節税額 = NISA の手取り - 特定口座の手取り
      expect(result.taxSavings).toBe(
        result.nisa.netAssets - result.tokutei.netAssets
      );
      // 節税額は税金額とほぼ等しい（四捨五入の誤差で±1円程度の差がある可能性）
      expect(result.taxSavings).toBeGreaterThanOrEqual(result.tokutei.tax - 1);
      expect(result.taxSavings).toBeLessThanOrEqual(result.tokutei.tax + 1);
    });

    test('運用益がマイナスの場合、税金が0円になること', () => {
      const plan: InvestmentPlan = {
        monthlyAmount: 50000,
        years: 10,
        annualRate: -5, // マイナス利回り
      };

      const result = calculateTaxComparison(plan);

      // 運用益がマイナス
      expect(result.profitBeforeTax).toBeLessThan(0);

      // 税金は0円
      expect(result.nisa.tax).toBe(0);
      expect(result.tokutei.tax).toBe(0);

      // 節税額も0円
      expect(result.taxSavings).toBe(0);

      // NISA と特定口座の手取りが同じ
      expect(result.nisa.netAssets).toBe(result.tokutei.netAssets);
    });

    test('利回り0%の場合、税金が0円になること', () => {
      const plan: InvestmentPlan = {
        monthlyAmount: 50000,
        years: 10,
        annualRate: 0,
      };

      const result = calculateTaxComparison(plan);

      // 運用益が0
      expect(result.profitBeforeTax).toBe(0);

      // 税金は0円
      expect(result.nisa.tax).toBe(0);
      expect(result.tokutei.tax).toBe(0);

      // 節税額も0円
      expect(result.taxSavings).toBe(0);

      // 総資産 = 元本
      expect(result.nisa.totalAssets).toBe(result.principal);
      expect(result.tokutei.totalAssetsBeforeTax).toBe(result.principal);
    });

    test('税率 20.315% が正確に適用されること', () => {
      const plan: InvestmentPlan = {
        monthlyAmount: 100000,
        years: 10,
        annualRate: 7,
      };

      const result = calculateTaxComparison(plan);

      // 運用益がプラスであること
      expect(result.profitBeforeTax).toBeGreaterThan(0);

      // 税金 = 運用益 × 0.20315（小数点以下切り捨て）
      const expectedTax = Math.floor(result.profitBeforeTax * 0.20315);
      expect(result.tokutei.tax).toBe(expectedTax);

      // 税率の範囲チェック（約20%）
      const actualTaxRate = result.tokutei.tax / result.profitBeforeTax;
      expect(actualTaxRate).toBeGreaterThanOrEqual(0.20);
      expect(actualTaxRate).toBeLessThan(0.21);
    });
  });

  describe('calculateYearlyTaxComparison', () => {
    test('正しい年数分のデータポイントが生成されること', () => {
      const plan: InvestmentPlan = {
        monthlyAmount: 30000,
        years: 20,
        annualRate: 5,
      };

      const yearlyData = calculateYearlyTaxComparison(plan);

      // 0年目から20年目まで、合計21個のデータポイント
      expect(yearlyData).toHaveLength(21);

      // 最初のデータポイント（0年目）
      expect(yearlyData[0].year).toBe(0);
      expect(yearlyData[0].principal).toBe(0);
      expect(yearlyData[0].nisaNetAssets).toBe(0);
      expect(yearlyData[0].tokuteiNetAssets).toBe(0);
      expect(yearlyData[0].taxAmount).toBe(0);

      // 最後のデータポイント（20年目）
      expect(yearlyData[20].year).toBe(20);
      expect(yearlyData[20].principal).toBe(7200000);
    });

    test('各年のデータが正しく計算されること', () => {
      const plan: InvestmentPlan = {
        monthlyAmount: 50000,
        years: 10,
        annualRate: 5,
      };

      const yearlyData = calculateYearlyTaxComparison(plan);

      // すべての年でNISAの手取り >= 特定口座の手取り
      yearlyData.forEach((data) => {
        expect(data.nisaNetAssets).toBeGreaterThanOrEqual(data.tokuteiNetAssets);
      });

      // 税金は年々増えていく（運用益が増えるため）
      for (let i = 1; i < yearlyData.length; i++) {
        if (yearlyData[i].taxAmount > 0) {
          expect(yearlyData[i].taxAmount).toBeGreaterThanOrEqual(
            yearlyData[i - 1].taxAmount
          );
        }
      }
    });

    test('運用益がマイナスの場合、すべての年で税金が0円になること', () => {
      const plan: InvestmentPlan = {
        monthlyAmount: 50000,
        years: 10,
        annualRate: -3,
      };

      const yearlyData = calculateYearlyTaxComparison(plan);

      // すべての年で税金が0円
      yearlyData.forEach((data) => {
        expect(data.taxAmount).toBe(0);
        // NISA と特定口座の手取りが同じ
        expect(data.nisaNetAssets).toBe(data.tokuteiNetAssets);
      });
    });

    test('年次データの増加が正しく行われること', () => {
      const plan: InvestmentPlan = {
        monthlyAmount: 30000,
        years: 5,
        annualRate: 5,
      };

      const yearlyData = calculateYearlyTaxComparison(plan);

      // 元本は年々増加
      for (let i = 1; i < yearlyData.length; i++) {
        expect(yearlyData[i].principal).toBeGreaterThan(yearlyData[i - 1].principal);
      }

      // NISA の手取り総資産は年々増加
      for (let i = 1; i < yearlyData.length; i++) {
        expect(yearlyData[i].nisaNetAssets).toBeGreaterThan(
          yearlyData[i - 1].nisaNetAssets
        );
      }
    });
  });
});
