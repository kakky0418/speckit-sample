# Unit 1: 計算・データ層（Calculation & Data Layer）

**Unit ID**: 002-U1
**Priority**: P1（最優先 - 他のユニットの基盤）
**Status**: Draft
**Created**: 2025-11-18

---

## 📋 ユニットの目的

NISA と特定口座の税金計算ロジック、データ型定義、データ共有機能を提供する基盤ユニット。他のすべてのユニットが依存する中核的な計算エンジンとデータ管理層。

---

## 🎯 含まれるユーザーストーリー

### US1（部分）: 節税額の視覚的確認
- 税金計算ロジック
- データ型定義
- Context API によるデータ共有

### US3: エッジケースの適切な処理
- バリデーションロジック
- エラーハンドリング

---

## ✅ 受け入れ基準

### AC-1: 税金計算の正確性
**Given** 積立額 30,000円、期間 20年、利回り 5% の入力
**When** `calculateTaxComparison()` 関数を呼び出す
**Then** 以下が正確に計算される:
- 元本合計: 7,200,000円
- 運用益（税引前）: 5,130,000円
- NISA 税金: 0円
- 特定口座 税金: 1,041,895円（運用益 × 20.315%）
- 節税額: 1,041,895円

### AC-2: エッジケースの処理
**Given** 利回り -3% または 0% の入力
**When** `calculateTaxComparison()` 関数を呼び出す
**Then**:
- 運用益がマイナスまたは 0 の場合、税金は 0円
- エラーを投げず、適切な結果を返す

### AC-3: データ共有
**Given** 基本シミュレーションページで条件を入力
**When** Context API を通じてデータを共有
**Then** 税金比較ページで同じ条件が使用できる

### AC-4: バリデーション
**Given** 不正な入力値（負の積立額、範囲外の利回りなど）
**When** バリデーション関数を呼び出す
**Then** 適切なエラーメッセージを返す

---

## 🛠️ 技術スタックと主要コンポーネント

### ファイル構成

```
lib/
  calculator.ts              # 計算ロジック（拡張）
  types.ts                   # 型定義（拡張）
  validation.ts              # バリデーションロジック

contexts/
  InvestmentPlanContext.tsx  # データ共有用 Context
```

**注意**: CSS ファイルは不要（ロジックのみのユニット）

### 主要な型定義

```typescript
// lib/types.ts に追加

export interface InvestmentPlan {
  monthlyAmount: number;      // 毎月の積立額
  years: number;              // 積立期間（年）
  annualReturn: number;       // 想定年利回り（%）
}

export interface TaxComparisonResult {
  nisa: {
    totalAssets: number;      // 総資産（NISA）
    tax: number;              // 税金（常に 0）
    netAssets: number;        // 手取り総資産
  };
  tokutei: {
    totalAssetsBeforeTax: number;  // 総資産（税引前）
    tax: number;                   // 税金（運用益 × 20.315%）
    netAssets: number;             // 手取り総資産
  };
  taxSavings: number;         // 節税額
  principal: number;          // 元本合計
  profitBeforeTax: number;    // 運用益（税引前）
}

export interface YearlyData {
  year: number;
  nisaAssets: number;
  tokuteiAssets: number;
}
```

### 計算ロジック

```typescript
// lib/calculator.ts に追加

const TAX_RATE = 0.20315;  // 特定口座の税率

export function calculateTaxComparison(
  plan: InvestmentPlan
): TaxComparisonResult {
  // 1. 基本計算（001 の既存ロジックを再利用）
  const principal = plan.monthlyAmount * plan.years * 12;
  const monthlyRate = plan.annualReturn / 100 / 12;
  const months = plan.years * 12;

  // 複利計算: FV = PMT × ((1 + r)^n - 1) / r
  let totalAssets: number;
  if (monthlyRate === 0) {
    totalAssets = principal;
  } else {
    totalAssets = plan.monthlyAmount *
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  }

  const profitBeforeTax = totalAssets - principal;

  // 2. 税金計算（運用益がプラスの場合のみ）
  const tokuteiTax = profitBeforeTax > 0
    ? profitBeforeTax * TAX_RATE
    : 0;

  // 3. 結果の構築
  return {
    nisa: {
      totalAssets: totalAssets,
      tax: 0,
      netAssets: totalAssets,
    },
    tokutei: {
      totalAssetsBeforeTax: totalAssets,
      tax: tokuteiTax,
      netAssets: totalAssets - tokuteiTax,
    },
    taxSavings: tokuteiTax,
    principal: principal,
    profitBeforeTax: profitBeforeTax,
  };
}

export function calculateYearlyTaxComparison(
  plan: InvestmentPlan
): YearlyData[] {
  const yearlyData: YearlyData[] = [];

  for (let year = 0; year <= plan.years; year++) {
    const yearPlan = { ...plan, years: year };
    const result = calculateTaxComparison(yearPlan);

    yearlyData.push({
      year: year,
      nisaAssets: result.nisa.netAssets,
      tokuteiAssets: result.tokutei.netAssets,
    });
  }

  return yearlyData;
}
```

### バリデーション

```typescript
// lib/validation.ts に追加

export interface ValidationError {
  field: string;
  message: string;
}

export function validateInvestmentPlan(
  plan: InvestmentPlan
): ValidationError[] {
  const errors: ValidationError[] = [];

  // 積立額のバリデーション
  if (plan.monthlyAmount < 100) {
    errors.push({
      field: 'monthlyAmount',
      message: '毎月の積立額は 100円 以上である必要があります',
    });
  }

  // 期間のバリデーション
  if (plan.years < 1 || plan.years > 40) {
    errors.push({
      field: 'years',
      message: '積立期間は 1年 から 40年 の範囲である必要があります',
    });
  }

  // 利回りのバリデーション
  if (plan.annualReturn < -10 || plan.annualReturn > 20) {
    errors.push({
      field: 'annualReturn',
      message: '想定年利回りは -10% から 20% の範囲である必要があります',
    });
  }

  return errors;
}
```

### Context API

```typescript
// contexts/InvestmentPlanContext.tsx

'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { InvestmentPlan } from '@/lib/types';

interface InvestmentPlanContextType {
  plan: InvestmentPlan | null;
  setPlan: (plan: InvestmentPlan) => void;
}

const InvestmentPlanContext = createContext<InvestmentPlanContextType | undefined>(
  undefined
);

export function InvestmentPlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<InvestmentPlan | null>(null);

  return (
    <InvestmentPlanContext.Provider value={{ plan, setPlan }}>
      {children}
    </InvestmentPlanContext.Provider>
  );
}

export function useInvestmentPlan() {
  const context = useContext(InvestmentPlanContext);
  if (context === undefined) {
    throw new Error(
      'useInvestmentPlan must be used within InvestmentPlanProvider'
    );
  }
  return context;
}
```

---

## 🔗 他ユニットとのインターフェース

### 提供するインターフェース（Output）

```typescript
// Unit 2（UI層）と Unit 3（グラフ層）に提供
export {
  calculateTaxComparison,
  calculateYearlyTaxComparison,
  validateInvestmentPlan,
  useInvestmentPlan,
  type InvestmentPlan,
  type TaxComparisonResult,
  type YearlyData,
  type ValidationError,
};
```

### 依存するインターフェース（Input）

- なし（完全に独立したユニット）

---

## 🧪 テスト戦略

### ユニットテスト

```typescript
// __tests__/lib/calculator.test.ts

describe('calculateTaxComparison', () => {
  it('正常な入力で正確な計算結果を返す', () => {
    const plan: InvestmentPlan = {
      monthlyAmount: 30000,
      years: 20,
      annualReturn: 5,
    };

    const result = calculateTaxComparison(plan);

    expect(result.principal).toBe(7200000);
    expect(result.nisa.tax).toBe(0);
    expect(result.tokutei.tax).toBeCloseTo(1041895, 0);
    expect(result.taxSavings).toBeCloseTo(1041895, 0);
  });

  it('運用益がマイナスの場合、税金は0円', () => {
    const plan: InvestmentPlan = {
      monthlyAmount: 30000,
      years: 20,
      annualReturn: -3,
    };

    const result = calculateTaxComparison(plan);

    expect(result.nisa.tax).toBe(0);
    expect(result.tokutei.tax).toBe(0);
    expect(result.taxSavings).toBe(0);
  });

  it('利回り0%の場合、税金は0円', () => {
    const plan: InvestmentPlan = {
      monthlyAmount: 30000,
      years: 20,
      annualReturn: 0,
    };

    const result = calculateTaxComparison(plan);

    expect(result.profitBeforeTax).toBe(0);
    expect(result.tokutei.tax).toBe(0);
  });
});
```

### 統合テスト

```typescript
// __tests__/contexts/InvestmentPlanContext.test.tsx

describe('InvestmentPlanContext', () => {
  it('プランを設定して取得できる', () => {
    // Context Provider のテスト
  });
});
```

---

## 📦 成果物

### 新規作成ファイル
- `lib/validation.ts`
- `contexts/InvestmentPlanContext.tsx`

### 拡張ファイル
- `lib/calculator.ts`（`calculateTaxComparison()` と `calculateYearlyTaxComparison()` を追加）
- `lib/types.ts`（`TaxComparisonResult` と `YearlyData` を追加）

### テストファイル
- `__tests__/lib/calculator.test.ts`
- `__tests__/lib/validation.test.ts`
- `__tests__/contexts/InvestmentPlanContext.test.tsx`

---

## ⚠️ 制約事項と前提条件

### 制約事項
- 税率は 20.315% 固定（将来変更の可能性は考慮しない）
- 運用益がマイナスまたは 0 の場合、税金は 0円 とする
- 計算精度は小数点以下を四捨五入

### 前提条件
- 001-nisa-simulator の `lib/calculator.ts` が存在すること
- 001-nisa-simulator の基本計算ロジックを再利用できること

---

## 🎯 完了の定義（Definition of Done）

- [ ] `calculateTaxComparison()` 関数が正確に動作する
- [ ] `calculateYearlyTaxComparison()` 関数が年次データを正しく生成する
- [ ] `validateInvestmentPlan()` 関数が適切にバリデーションを行う
- [ ] `InvestmentPlanContext` が正しくデータを共有する
- [ ] すべてのユニットテストが成功する（カバレッジ 90% 以上）
- [ ] TypeScript のコンパイルエラーがない
- [ ] ESLint・Prettier が適用されている

---

**作成者**: Claude (AI Architect)
**最終更新**: 2025-11-18
