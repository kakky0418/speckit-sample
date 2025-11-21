import { describe, expect, test } from 'bun:test';
import { generateMilestones, calculateFutureAge, calculateRequiredMonthlyAmount } from '@/lib/ageUtils';
import type { ChartDataPoint } from '@/lib/types';

describe('ageUtils', () => {
  test('calculateFutureAge は現在年齢と年数を加算する', () => {
    expect(calculateFutureAge(35, 20)).toBe(55);
  });

  test('generateMilestones は 10 歳刻みのマイルストーンを返す (35歳, 30年 → 40/50/60)', () => {
    const chartData: ChartDataPoint[] = Array.from({ length: 31 }, (_, i) => ({
      year: i,
      principal: i * 1000,
      totalAssets: i * 2000,
    }));

    const milestones = generateMilestones(35, 30, chartData);
    const ages = milestones.map((m) => m.age);
    const assets = milestones.map((m) => m.assets);

    expect(ages).toEqual([40, 50, 60]);
    expect(assets).toEqual([chartData[5].totalAssets, chartData[15].totalAssets, chartData[25].totalAssets]);
  });

  test('generateMilestones は期間が短い場合は空配列を返す', () => {
    const chartData: ChartDataPoint[] = Array.from({ length: 4 }, (_, i) => ({
      year: i,
      principal: 0,
      totalAssets: i * 1000,
    }));

    const milestones = generateMilestones(35, 3, chartData);
    expect(milestones).toHaveLength(0);
  });

  test('generateMilestones はエッジケース (38歳, 3年) で 40歳 のみ返す', () => {
    const chartData: ChartDataPoint[] = Array.from({ length: 4 }, (_, i) => ({
      year: i,
      principal: 0,
      totalAssets: i * 1000,
    }));

    const milestones = generateMilestones(38, 3, chartData);
    expect(milestones.map((m) => m.age)).toEqual([40]);
    expect(milestones[0]?.assets).toBe(chartData[2].totalAssets);
  });

  test('calculateRequiredMonthlyAmount は通常ケースで月額を返す', () => {
    const result = calculateRequiredMonthlyAmount({
      currentAge: 35,
      targetAge: 60,
      targetAmount: 20000000,
      annualRate: 5,
      initialAmount: 0,
    });

    expect(result.requiredMonthlyAmount).toBeCloseTo(33584.67, 2);
    expect(result.years).toBe(25);
    expect(result.isRealistic).toBe(true);
    expect(result.warningMessage).toBeNull();
  });

  test('calculateRequiredMonthlyAmount は利率0%なら単純割り算で計算する', () => {
    const result = calculateRequiredMonthlyAmount({
      currentAge: 35,
      targetAge: 60,
      targetAmount: 20000000,
      annualRate: 0,
      initialAmount: 0,
    });

    expect(result.requiredMonthlyAmount).toBeCloseTo(66666.67, 2);
    expect(result.isRealistic).toBe(true);
  });

  test('calculateRequiredMonthlyAmount は初回投資額を考慮する', () => {
    const result = calculateRequiredMonthlyAmount({
      currentAge: 35,
      targetAge: 60,
      targetAmount: 20000000,
      annualRate: 5,
      initialAmount: 1000000,
    });

    expect(result.requiredMonthlyAmount).toBeCloseTo(27738.77, 2);
  });

  test('calculateRequiredMonthlyAmount は月100万円超えで警告を返す', () => {
    const result = calculateRequiredMonthlyAmount({
      currentAge: 30,
      targetAge: 40,
      targetAmount: 200000000,
      annualRate: 5,
      initialAmount: 0,
    });

    expect(result.requiredMonthlyAmount).toBeGreaterThan(1_000_000);
    expect(result.isRealistic).toBe(false);
    expect(result.warningMessage).toBe('目標達成には非現実的な積立額が必要です');
  });
});
