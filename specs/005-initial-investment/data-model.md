# データモデル: 初回投資額設定機能

**Date**: 2025-11-19
**Feature**: 初回投資額設定機能
**Tech Stack**: TypeScript + React 19 + Next.js 15.1.3

## Overview

初回投資額機能のデータモデルは、既存の `InvestmentPlan` 型に `initialAmount` フィールドを追加することで実現します。永続化は行わず、すべてクライアントサイドの React state（Context API）で管理します。

---

## Type 1: InvestmentPlan（積立プラン）

### Purpose
ユーザーが入力する積立条件を保持する型。初回投資額フィールドを追加して拡張します。

### TypeScript Definition（更新後）

```typescript
export interface InvestmentPlan {
  monthlyAmount: number;    // 毎月の積立額（円）
  years: number;            // 積立期間（年）
  annualRate: number;       // 想定年利回り（%）
  initialAmount?: number;   // 初回投資額（円）← 新規追加
}
```

### Fields

| Field Name | Type | Constraints | Description | 変更 |
|------------|------|-------------|-------------|------|
| monthlyAmount | number | >= 100 | 毎月の積立額（円） | 既存 |
| years | number | 1 <= years <= 40 | 積立期間（年、整数） | 既存 |
| annualRate | number | -10.0 <= rate <= 20.0 | 想定年利回り（%） | 既存 |
| **initialAmount** | **number \| undefined** | **>= 0** | **初回投資額（円）** | **新規** |

### Validation Rules

**既存フィールド（変更なし）**:
- `monthlyAmount`: 最小値 100 円、小数点許可
- `years`: 1〜40 年、整数のみ
- `annualRate`: -10.0〜20.0%

**新規フィールド（initialAmount）**:
1. **必須/任意**: 任意（Optional）
   - `undefined` または未入力の場合、`0` として扱う
2. **最小値**: 0 円
   - 負の値は不可
3. **最大値**: なし
   - 仕様書で「上限なし」と決定済み
4. **小数点**: 許可
   - 例: 1000000.50 円も有効

### Default Value

```typescript
const defaultPlan: InvestmentPlan = {
  monthlyAmount: 30000,
  years: 20,
  annualRate: 5.0,
  initialAmount: 0,  // デフォルトは 0 円
};
```

---

## Type 2: SimulationResult（シミュレーション結果）

### Purpose
計算結果を保持する型。初回投資額を反映した計算結果を格納します。

### TypeScript Definition（変更なし）

```typescript
export interface SimulationResult {
  totalAssets: number;         // 総資産額
  totalPrincipal: number;      // 元本合計（初回投資額 + 月次積立の合計）
  totalProfit: number;         // 運用益
  annualInvestment: number;    // 年間投資額（月次積立 × 12）
  nisaUtilizationRate: number; // NISA 枠活用率
  isOverNisaLimit: boolean;    // NISA 枠超過フラグ
  chartData: ChartDataPoint[]; // グラフデータ
}
```

### Fields（変更点）

| Field Name | Type | Description | 変更点 |
|------------|------|-------------|--------|
| totalAssets | number | 総資産額 | 初回投資額を含む計算に更新 |
| **totalPrincipal** | **number** | **元本合計** | **初回投資額を含むように更新** |
| totalProfit | number | 運用益 | 初回投資額を含む計算に更新 |
| annualInvestment | number | 年間投資額 | 変更なし（月次積立のみ） |
| nisaUtilizationRate | number | NISA 枠活用率 | 変更なし |
| isOverNisaLimit | boolean | NISA 枠超過フラグ | 変更なし |
| chartData | ChartDataPoint[] | グラフデータ | 初回投資額を含むデータに更新 |

### Calculation Changes

**totalPrincipal の計算（更新）**:

```typescript
// 旧
const totalPrincipal = monthlyAmount * years * 12;

// 新
const totalPrincipal = (initialAmount || 0) + (monthlyAmount * years * 12);
```

**totalAssets の計算（更新）**:

```typescript
const monthlyRate = annualRate / 12 / 100;
const months = years * 12;

if (monthlyRate === 0) {
  // 利回り 0% の場合
  totalAssets = (initialAmount || 0) + (monthlyAmount * months);
} else {
  // 初回投資額の複利成長
  const initialGrowth = (initialAmount || 0) * Math.pow(1 + monthlyRate, months);

  // 月次積立の複利成長
  const monthlyGrowth = monthlyAmount * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;

  totalAssets = initialGrowth + monthlyGrowth;
}
```

---

## Type 3: ChartDataPoint（グラフデータポイント）

### Purpose
グラフの各年のデータを保持する型。初回投資額を含むデータを格納します。

### TypeScript Definition（変更なし）

```typescript
export interface ChartDataPoint {
  year: number;        // 経過年数
  principal: number;   // 元本累計（初回投資額を含む）
  totalAssets: number; // 総資産額（初回投資額を含む）
}
```

### Calculation Changes

**generateChartData 関数（更新）**:

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
- 0 年目（開始時点）で `principal` と `totalAssets` が `initialAmount` となる
- すべての年で初回投資額が元本と総資産額に反映される

---

## Type 4: TaxComparisonResult（税金比較結果）

### Purpose
NISA と特定口座の税金比較結果を保持する型。初回投資額を含む計算に対応します。

### TypeScript Definition（変更なし）

```typescript
export interface TaxComparisonResult {
  nisa: {
    totalAssets: number;      // 総資産額（税引前と同じ）
    tax: number;               // 税金（常に 0）
    netAssets: number;         // 手取り総資産（税引後）
  };
  tokutei: {
    totalAssetsBeforeTax: number;  // 総資産額（税引前）
    tax: number;                    // 税金（運用益 × 0.20315）
    netAssets: number;              // 手取り総資産（税引後）
  };
  taxSavings: number;         // 節税額（NISA のメリット）
  principal: number;          // 元本合計
  profitBeforeTax: number;    // 運用益（税引前）
}
```

### Calculation Changes

**calculateTaxComparison 関数（更新）**:

```typescript
export function calculateTaxComparison(plan: InvestmentPlan): TaxComparisonResult {
  const { monthlyAmount, years, annualRate, initialAmount = 0 } = plan;

  // 1. 元本合計（初回投資額を含む）
  const principal = initialAmount + (monthlyAmount * years * 12);

  // 2. 総資産額（初回投資額を含む複利計算）
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;

  let totalAssets: number;
  if (monthlyRate === 0) {
    totalAssets = principal;
  } else {
    const initialGrowth = initialAmount * Math.pow(1 + monthlyRate, months);
    const monthlyGrowth = monthlyAmount * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
    totalAssets = initialGrowth + monthlyGrowth;
  }

  // 3. 運用益（税引前）
  const profitBeforeTax = totalAssets - principal;

  // 4. 税金計算（運用益がマイナスまたは 0 の場合は税金 0）
  const tax = profitBeforeTax > 0 ? profitBeforeTax * TAX_RATE : 0;

  // ... 以下、既存のロジックと同じ
}
```

---

## Type 5: YearlyTaxData（年次税金データ）

### Purpose
年次ごとの税金比較データを保持する型。グラフ表示に使用します。

### TypeScript Definition（変更なし）

```typescript
export interface YearlyTaxData {
  year: number;               // 経過年数
  principal: number;          // 元本累計（初回投資額を含む）
  nisaNetAssets: number;      // NISA の手取り総資産
  tokuteiNetAssets: number;   // 特定口座の手取り総資産
  taxAmount: number;          // その年までの累積税金額
}
```

### Calculation Changes

**calculateYearlyTaxComparison 関数（更新）**:

```typescript
export function calculateYearlyTaxComparison(plan: InvestmentPlan): YearlyTaxData[] {
  const { monthlyAmount, years, annualRate, initialAmount = 0 } = plan;
  const monthlyRate = annualRate / 12 / 100;
  const yearlyData: YearlyTaxData[] = [];

  for (let year = 0; year <= years; year++) {
    const monthsPassed = year * 12;

    // 元本（初回投資額を含む）
    const principal = initialAmount + (monthlyAmount * monthsPassed);

    // 総資産額（税引前、初回投資額を含む）
    let totalAssets: number;
    if (monthlyRate === 0) {
      totalAssets = principal;
    } else {
      const initialGrowth = initialAmount * Math.pow(1 + monthlyRate, monthsPassed);
      let monthlyGrowth: number;
      if (monthsPassed === 0) {
        monthlyGrowth = 0;
      } else {
        monthlyGrowth = monthlyAmount * (Math.pow(1 + monthlyRate, monthsPassed) - 1) / monthlyRate;
      }
      totalAssets = initialGrowth + monthlyGrowth;
    }

    // ... 以下、既存のロジックと同じ
  }

  return yearlyData;
}
```

---

## Data Flow

### 1. Input（ユーザー入力）

```
User Input (app/page.tsx)
  ↓
InvestmentPlanContext (contexts/InvestmentPlanContext.tsx)
  ↓
InvestmentPlan型 { monthlyAmount, years, annualRate, initialAmount }
```

### 2. Calculation（計算）

```
InvestmentPlan
  ↓
calculateSimulation(plan) in lib/calculator.ts
  ↓
SimulationResult { totalAssets, totalPrincipal, totalProfit, chartData, ... }
```

### 3. Display（表示）

```
SimulationResult
  ↓
app/page.tsx（結果表示）
InvestmentChart（グラフ表示）
```

---

## File Changes Summary

| ファイル | 変更内容 | 種類 |
|---------|---------|------|
| `lib/types.ts` | `InvestmentPlan` に `initialAmount?: number` を追加 | 型定義 |
| `lib/calculator.ts` | `calculateSimulation` 関数を更新（初回投資額対応） | 計算ロジック |
| `lib/calculator.ts` | `generateChartData` 関数を更新（初回投資額対応） | 計算ロジック |
| `lib/calculator.ts` | `calculateTaxComparison` 関数を更新（初回投資額対応） | 計算ロジック |
| `lib/calculator.ts` | `calculateYearlyTaxComparison` 関数を更新（初回投資額対応） | 計算ロジック |
| `contexts/InvestmentPlanContext.tsx` | デフォルト値に `initialAmount: 0` を追加 | Context |
| `app/page.tsx` | 初回投資額入力フィールドを追加 | UI |
| `app/page.module.css` | 初回投資額入力フィールドのスタイルを追加 | スタイル |

---

## State Management

### Context API

既存の `InvestmentPlanContext` を活用します。新規の状態管理ライブラリは導入しません。

```typescript
// contexts/InvestmentPlanContext.tsx
const [plan, setPlan] = useState<InvestmentPlan>({
  monthlyAmount: 30000,
  years: 20,
  annualRate: 5.0,
  initialAmount: 0,  // 追加
});
```

---

## Testing Considerations

### ユニットテスト（`__tests__/unit/calculator.test.ts`）

以下のテストケースを追加する必要があります：

1. **初回投資額のみのシミュレーション**
   - `initialAmount = 1000000`, `monthlyAmount = 0`
   - 複利計算が正しく行われることを確認

2. **初回投資額 + 月次積立のシミュレーション**
   - `initialAmount = 1000000`, `monthlyAmount = 30000`
   - 両方が正しく合算されることを確認

3. **初回投資額が未入力（undefined）の場合**
   - `initialAmount` が `undefined` または `0` の場合、既存の動作と同じになることを確認

4. **エッジケース**
   - 利回り 0% の場合
   - 負の利回りの場合
   - 初回投資額が非常に大きい場合（1 億円以上）

---

## Next Steps

1. ✅ Data Model 完了
2. 🔄 Phase 1: `quickstart.md` を作成（次のステップ）
3. ⏳ Agent context 更新
4. ⏳ `/speckit.tasks` で tasks.md を生成

**Status**: ✅ Data Model Phase Complete
