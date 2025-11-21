import { describe, test, expect } from 'bun:test';
import { validateInvestmentPlan, validateAge } from '@/lib/validation';
import type { InvestmentPlan } from '@/lib/types';

describe('Validation', () => {
  describe('validateInvestmentPlan', () => {
    test('正常な入力値の場合、バリデーションが成功すること', () => {
      const validPlan: InvestmentPlan = {
        monthlyAmount: 30000,
        years: 20,
        annualRate: 5,
      };

      const result = validateInvestmentPlan(validPlan);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('毎月の積立額が負の値の場合、エラーになること', () => {
      const invalidPlan: InvestmentPlan = {
        monthlyAmount: -100,
        years: 20,
        annualRate: 5,
      };

      const result = validateInvestmentPlan(invalidPlan);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('積立額は0円以上を入力してください');
    });

    test('毎月の積立額が0の場合、バリデーションが成功すること（初回投資額のみのシミュレーションを可能にする）', () => {
      const validPlan: InvestmentPlan = {
        monthlyAmount: 0,
        years: 20,
        annualRate: 5,
        initialAmount: 1000000, // 初回投資額のみ
      };

      const result = validateInvestmentPlan(validPlan);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('積立期間が最小値未満の場合、エラーになること', () => {
      const invalidPlan: InvestmentPlan = {
        monthlyAmount: 30000,
        years: 0,
        annualRate: 5,
      };

      const result = validateInvestmentPlan(invalidPlan);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('積立期間は1年以上') || e.includes('積立期間は40年以下'))).toBe(true);
    });

    test('積立期間が最大値を超える場合、エラーになること', () => {
      const invalidPlan: InvestmentPlan = {
        monthlyAmount: 30000,
        years: 50,
        annualRate: 5,
      };

      const result = validateInvestmentPlan(invalidPlan);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('積立期間は1年以上') || e.includes('積立期間は40年以下'))).toBe(true);
    });

    test('想定年利回りが最小値未満の場合、エラーになること', () => {
      const invalidPlan: InvestmentPlan = {
        monthlyAmount: 30000,
        years: 20,
        annualRate: -15, // -10%未満
      };

      const result = validateInvestmentPlan(invalidPlan);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('想定利回りは-10%以上') || e.includes('想定利回りは20%以下'))).toBe(true);
    });

    test('想定年利回りが最大値を超える場合、エラーになること', () => {
      const invalidPlan: InvestmentPlan = {
        monthlyAmount: 30000,
        years: 20,
        annualRate: 25, // 20%超
      };

      const result = validateInvestmentPlan(invalidPlan);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('想定利回りは-10%以上') || e.includes('想定利回りは20%以下'))).toBe(true);
    });

    test('複数のバリデーションエラーがある場合、すべてのエラーが返されること', () => {
      const invalidPlan: InvestmentPlan = {
        monthlyAmount: -100, // 負の値
        years: 0, // 最小値未満
        annualRate: 25, // 最大値超過
      };

      const result = validateInvestmentPlan(invalidPlan);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
      expect(result.errors).toContain('積立額は0円以上を入力してください');
      expect(result.errors.some(e => e.includes('積立期間は1年以上') || e.includes('積立期間は40年以下'))).toBe(true);
      expect(result.errors.some(e => e.includes('想定利回りは-10%以上') || e.includes('想定利回りは20%以下'))).toBe(true);
    });

    test('境界値（最小値）が正しく処理されること', () => {
      const boundaryPlan: InvestmentPlan = {
        monthlyAmount: 0, // 最小値（0円を許容）
        years: 1, // 最小値
        annualRate: -10, // 最小値
      };

      const result = validateInvestmentPlan(boundaryPlan);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('境界値（最大値）が正しく処理されること', () => {
      const boundaryPlan: InvestmentPlan = {
        monthlyAmount: 1000000, // 大きな値
        years: 40, // 最大値
        annualRate: 20, // 最大値
      };

      const result = validateInvestmentPlan(boundaryPlan);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('小数点を含む値が正しく処理されること', () => {
      const decimalPlan: InvestmentPlan = {
        monthlyAmount: 33333.33,
        years: 20,
        annualRate: 5.5,
      };

      const result = validateInvestmentPlan(decimalPlan);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('validateAge', () => {
    test('未入力(undefined)の場合はバリデーションが成功すること', () => {
      const result = validateAge(undefined);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('1〜120 の整数はバリデーションが成功すること', () => {
      const result = validateAge(35);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('小数の場合は「整数で入力してください」で失敗すること', () => {
      const result = validateAge(35.5);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('整数で入力してください');
    });

    test('1 未満または 120 より大きい場合は範囲外エラーになること', () => {
      const underResult = validateAge(0);
      const overResult = validateAge(121);

      expect(underResult.isValid).toBe(false);
      expect(underResult.errors).toContain('1 歳以上 120 歳以下で入力してください');
      expect(overResult.isValid).toBe(false);
      expect(overResult.errors).toContain('1 歳以上 120 歳以下で入力してください');
    });
  });
});
