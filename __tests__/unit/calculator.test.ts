import { describe, test, expect } from 'bun:test';
import { calculateSimulation, generateChartData, calculateMultipleScenarios } from '@/lib/calculator';
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
});
