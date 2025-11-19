# Research: 初回投資額設定機能

**Date**: 2025-11-19
**Feature**: 初回投資額設定機能
**Branch**: 005-initial-investment

## Overview

このドキュメントは、初回投資額機能を実装するために必要な調査結果と技術的な決定事項をまとめたものです。

---

## Research Task 1: 初回投資額を含む複利計算の数式

### 調査内容

既存の `lib/calculator.ts` を確認し、初回投資額を含む複利計算の数式を決定しました。

### 既存の計算ロジック（月次積立のみ）

```typescript
// 総資産額（複利計算）
const monthlyRate = annualRate / 12 / 100;
const months = years * 12;

if (monthlyRate === 0) {
  totalAssets = monthlyAmount * months;
} else {
  totalAssets = monthlyAmount * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
}
```

**数式**:
- 月次積立の複利計算: `FV = PMT × [(1 + r)^n - 1] / r`
  - `PMT`: 毎月の積立額
  - `r`: 月利（年利 / 12 / 100）
  - `n`: 積立月数

### 初回投資額を含む計算式

**Decision**: 初回投資額も同様に年利で運用され、最終的に以下の式で計算する。

```typescript
// 初回投資額の運用結果
const initialInvestmentGrowth = initialAmount * Math.pow(1 + monthlyRate, months);

// 月次積立の運用結果
const monthlyInvestmentGrowth = monthlyAmount * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;

// 総資産額
const totalAssets = initialInvestmentGrowth + monthlyInvestmentGrowth;
```

**数式**:
- 初回投資額の複利成長: `FV_initial = PV × (1 + r)^n`
  - `PV`: 初回投資額
  - `r`: 月利
  - `n`: 運用月数
- 総資産額: `FV_total = FV_initial + FV_monthly`

**エッジケース**:
- `monthlyRate === 0` の場合:
  ```typescript
  totalAssets = initialAmount + (monthlyAmount * months);
  ```

### Rationale

- 初回投資額は投資開始時点（0 ヶ月目）から運用されるため、`(1 + r)^n` で複利成長する
- 月次積立は毎月積み立てられるため、既存の複利年金の式を使用する
- 両者を合算することで、総資産額を正確に計算できる

### 参考: 元本計算

```typescript
// 元本合計 = 初回投資額 + 月次積立の合計
const totalPrincipal = (initialAmount || 0) + (monthlyAmount * years * 12);
```

---

## Research Task 2: グラフ表示の調整

### 調査内容

既存の `generateChartData` 関数と `InvestmentChart` コンポーネントを確認し、初回投資額をグラフに反映する方法を決定しました。

### 既存のグラフデータ生成ロジック

```typescript
export function generateChartData(plan: InvestmentPlan): ChartDataPoint[] {
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
```

**問題点**:
- 初回投資額が反映されていない
- 0 年目（開始時点）のデータが `{ year: 0, principal: 0, totalAssets: 0 }` となっている

### Decision: グラフデータ生成ロジックの更新

```typescript
export function generateChartData(plan: InvestmentPlan): ChartDataPoint[] {
  const { monthlyAmount, years, annualRate, initialAmount = 0 } = plan;
  const monthlyRate = annualRate / 12 / 100;
  const chartData: ChartDataPoint[] = [];

  for (let year = 0; year <= years; year++) {
    const monthsPassed = year * 12;

    // 元本 = 初回投資額 + 月次積立の累計
    const principal = initialAmount + (monthlyAmount * monthsPassed);

    // 総資産額
    let totalAssets: number;
    if (monthlyRate === 0) {
      totalAssets = principal;
    } else {
      // 初回投資額の成長
      const initialGrowth = initialAmount * Math.pow(1 + monthlyRate, monthsPassed);

      // 月次積立の成長
      let monthlyGrowth: number;
      if (monthsPassed === 0) {
        monthlyGrowth = 0;
      } else {
        monthlyGrowth = monthlyAmount * (Math.pow(1 + monthlyRate, monthsPassed) - 1) / monthlyRate;
      }

      totalAssets = initialGrowth + monthlyGrowth;
    }

    chartData.push({
      year,
      principal: Math.floor(principal),
      totalAssets: Math.floor(totalAssets),
    });
  }

  return chartData;
}
```

**変更点**:
- 0 年目（開始時点）のデータが `{ year: 0, principal: initialAmount, totalAssets: initialAmount }` となる
- すべての年のデータに初回投資額が反映される
- グラフの X 軸調整は不要（既存のロジックで対応可能）

### InvestmentChart コンポーネントの対応

**Decision**: 既存のコンポーネントは変更不要

**Rationale**:
- `InvestmentChart` コンポーネントは `ChartDataPoint[]` を受け取るだけで、内部でデータを加工していない
- グラフデータ生成ロジック（`generateChartData`）を更新すれば、自動的に反映される
- `ChartDataPoint` 型も変更不要

---

## Research Task 3: 入力バリデーションのルール

### 調査内容

既存の `app/page.tsx` を確認し、初回投資額のバリデーションルールを決定しました。

### Decision: バリデーションルール

初回投資額のバリデーションは、既存の `monthlyAmount` と同様のルールを適用します。

| 項目 | ルール |
|------|--------|
| **必須/任意** | 任意（未入力の場合は 0 円として扱う） |
| **最小値** | 0 円（負の値は不可） |
| **最大値** | なし（仕様書で「上限なし」と決定済み） |
| **小数点** | 許可（例: 1000000.50 円も有効） |
| **数値以外** | エラー（「数値を入力してください」と表示） |
| **負の値** | エラー（「0 円以上の金額を入力してください」と表示） |

### バリデーションロジック（擬似コード）

```typescript
function validateInitialAmount(value: string): { isValid: boolean; error?: string } {
  // 空欄の場合は有効（0 円として扱う）
  if (value === '' || value === undefined) {
    return { isValid: true };
  }

  const num = parseFloat(value);

  // 数値でない場合
  if (isNaN(num)) {
    return { isValid: false, error: '数値を入力してください' };
  }

  // 負の値の場合
  if (num < 0) {
    return { isValid: false, error: '0 円以上の金額を入力してください' };
  }

  return { isValid: true };
}
```

### Rationale

- 既存の `monthlyAmount` のバリデーションと一貫性を保つ
- 任意項目とすることで、初回投資額なしのシミュレーション（既存の動作）も維持できる
- 小数点を許可することで、より正確な金額入力が可能

### Alternatives Considered

**代替案 1**: 初回投資額を必須項目にする
- **却下理由**: 既存のシミュレーション（初回投資額なし）が動作しなくなる

**代替案 2**: 上限値を設定する（例: 1,000 万円）
- **却下理由**: 仕様書で「上限なし」と決定済み。様々な投資シナリオをシミュレート可能にするため

---

## Additional Findings

### Context API の更新

既存の `contexts/InvestmentPlanContext.tsx` を確認した結果、以下の更新が必要です：

```typescript
// デフォルト値
const defaultPlan: InvestmentPlan = {
  monthlyAmount: 30000,
  years: 20,
  annualRate: 5.0,
  initialAmount: 0,  // ← 追加
};
```

### 税金比較機能への影響

`calculateTaxComparison` 関数と `calculateYearlyTaxComparison` 関数も同様に更新が必要です。初回投資額を含む計算に対応させる必要があります。

**影響範囲**:
- `lib/calculator.ts`: `calculateTaxComparison` 関数
- `lib/calculator.ts`: `calculateYearlyTaxComparison` 関数
- `app/tax-comparison/page.tsx`: 表示ロジック（変更不要の可能性が高い）

---

## Summary of Decisions

| 項目 | 決定事項 |
|------|----------|
| **複利計算式** | `FV_total = (initialAmount × (1 + r)^n) + (monthlyAmount × [(1 + r)^n - 1] / r)` |
| **グラフ表示** | `generateChartData` 関数を更新。コンポーネントは変更不要 |
| **バリデーション** | 任意項目、0 円以上、上限なし、小数点許可 |
| **データ型** | `InvestmentPlan` に `initialAmount?: number` を追加 |
| **デフォルト値** | `0` (未入力時) |
| **影響範囲** | `lib/types.ts`, `lib/calculator.ts`, `contexts/InvestmentPlanContext.tsx`, `app/page.tsx` |

---

## Next Steps

1. ✅ Research 完了
2. 🔄 Phase 1: `data-model.md` を作成
3. ⏳ Phase 1: `quickstart.md` を作成
4. ⏳ Agent context 更新

**Status**: ✅ Research Phase Complete
