# データモデル: NISA積立シミュレーター

**Date**: 2025-11-18
**Feature**: NISA積立シミュレーター
**Tech Stack**: TypeScript + React + Next.js

## Overview

NISA積立シミュレーターのデータモデルは、ユーザー入力、計算結果、シナリオ比較の3つの主要な型で構成されます。すべてのデータはクライアントサイドのメモリ上（React state）で管理され、永続化は行いません。

---

## Type 1: InvestmentPlan（積立プラン）

### Purpose
ユーザーが入力する積立条件を保持する型。

### TypeScript Definition

```typescript
export interface InvestmentPlan {
  monthlyAmount: number;  // 毎月の積立額（円）
  years: number;          // 積立期間（年）
  annualRate: number;     // 想定年利回り（%）
}
```

### Fields

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| monthlyAmount | number | >= 100 | 毎月の積立額（円） |
| years | number | 1 <= years <= 40 | 積立期間（年、整数） |
| annualRate | number | -10.0 <= rate <= 20.0 | 想定年利回り（%） |

### Validation Rules

1. **monthlyAmount**:
   - 必須項目
   - 最小値: 100円
   - 最大値: 制限なし（実用上は100万円程度）
   - 小数点以下も許容（例: 33333.33円）

2. **years**:
   - 必須項目
   - 整数のみ
   - 最小値: 1年
   - 最大値: 40年

3. **annualRate**:
   - 必須項目
   - 最小値: -10%（元本割れシナリオ）
   - 最大値: 20%（楽観的シナリオ）
   - 小数点2桁まで許容（例: 5.25%）
   - 初期値: 5.0%

### State Management

React の `useState` で管理：

```typescript
const [plan, setPlan] = useState<InvestmentPlan>({
  monthlyAmount: 30000,
  years: 20,
  annualRate: 5.0,
});
```

### Relationships

- `InvestmentPlan` → `SimulationResult` (1対1): 1つのプランから1つの結果を生成
- `InvestmentPlan` → `Scenario[]` (1対多): 1つのプランから複数のシナリオを生成可能

---

## Type 2: SimulationResult（シミュレーション結果）

### Purpose
複利計算の結果と NISA 枠の活用状況を保持する型。

### TypeScript Definition

```typescript
export interface SimulationResult {
  totalAssets: number;           // 将来の総資産額（円）
  totalPrincipal: number;        // 元本合計（円）
  totalProfit: number;           // 運用益（円）※マイナスの場合は損失
  annualInvestment: number;      // 年間投資額（円）
  nisaUtilizationRate: number;   // NISA枠活用率（0.5 = 50%）
  isOverNisaLimit: boolean;      // NISA枠超過フラグ
  chartData: ChartDataPoint[];   // グラフ表示用データポイント
}
```

### Fields

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| totalAssets | number | >= 0 | 将来の総資産額（円） |
| totalPrincipal | number | >= 0 | 元本合計（円） |
| totalProfit | number | unrestricted | 運用益（円）※マイナスの場合は損失 |
| annualInvestment | number | >= 0 | 年間投資額（円） |
| nisaUtilizationRate | number | 0.0 ~ 1.0+ | NISA枠活用率（0.5 = 50%） |
| isOverNisaLimit | boolean | - | NISA枠超過フラグ |
| chartData | ChartDataPoint[] | - | グラフ表示用データポイント |

### Calculated Fields

すべてのフィールドは `InvestmentPlan` から計算されます：

1. **totalPrincipal**:
   ```typescript
   totalPrincipal = monthlyAmount × years × 12
   ```

2. **totalAssets**:
   ```typescript
   const monthlyRate = annualRate / 12 / 100;
   const months = years × 12;

   if (monthlyRate === 0) {
     totalAssets = monthlyAmount × months;
   } else {
     totalAssets = monthlyAmount × (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
   }
   ```

3. **totalProfit**:
   ```typescript
   totalProfit = totalAssets - totalPrincipal
   ```

4. **annualInvestment**:
   ```typescript
   annualInvestment = monthlyAmount × 12
   ```

5. **nisaUtilizationRate**:
   ```typescript
   const NISA_TSUMITATE_LIMIT = 1_200_000; // 円/年
   nisaUtilizationRate = annualInvestment / NISA_TSUMITATE_LIMIT
   ```

6. **isOverNisaLimit**:
   ```typescript
   isOverNisaLimit = (annualInvestment > NISA_TSUMITATE_LIMIT)
   ```

7. **chartData**:
   - 0年目から積立期間終了までの各年の資産額を計算
   - 各データポイント: `{ year: number, principal: number, totalAssets: number }`

### Display Formatting

計算結果表示時の考慮事項：

- 金額は整数円単位に丸める（`Math.floor()`）
- 3桁区切りのカンマ表示（`toLocaleString('ja-JP')`）
- 非常に大きな金額（億単位）は読みやすい形式で表示
- マイナスの運用益は赤色で表示し、「損失」と明記

---

## Type 3: Scenario（シナリオ）

### Purpose
複数の利回りでシミュレーションを実行し、結果を比較するための型。

### TypeScript Definition

```typescript
export interface Scenario {
  name: string;                  // シナリオ名
  annualRate: number;            // このシナリオの想定年利回り（%）
  result: SimulationResult;      // このシナリオの計算結果
  color: string;                 // グラフ表示時の色（Tailwind CSS クラスまたはHEX）
}
```

### Fields

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| name | string | required | シナリオ名（例: 「保守的」「標準」「楽観的」） |
| annualRate | number | -10.0 ~ 20.0 | このシナリオの想定年利回り（%） |
| result | SimulationResult | required | このシナリオの計算結果 |
| color | string | required | グラフ表示時の色（#3b82f6 など） |

### Predefined Scenarios

アプリケーションには3つのプリセットシナリオを用意：

| Scenario Name | Annual Rate | Color | Description |
|---------------|-------------|-------|-------------|
| 保守的 | 3.0% | #3b82f6 (Blue) | 低リスク・低リターン |
| 標準 | 5.0% | #10b981 (Green) | 中リスク・中リターン |
| 楽観的 | 7.0% | #f59e0b (Orange) | 高リスク・高リターン |

ユーザーはこれらの利回りをカスタマイズ可能。

### Example

```typescript
const scenarios: Scenario[] = [
  {
    name: '保守的',
    annualRate: 3.0,
    result: calculateSimulation({ ...plan, annualRate: 3.0 }),
    color: '#3b82f6',
  },
  {
    name: '標準',
    annualRate: 5.0,
    result: calculateSimulation({ ...plan, annualRate: 5.0 }),
    color: '#10b981',
  },
  {
    name: '楽観的',
    annualRate: 7.0,
    result: calculateSimulation({ ...plan, annualRate: 7.0 }),
    color: '#f59e0b',
  },
];
```

### Relationships

- `Scenario` → `SimulationResult` (1対1): 各シナリオは1つの結果を持つ
- 複数の `Scenario` は同じ `InvestmentPlan`（積立額と期間）を共有

---

## Type 4: ChartDataPoint（グラフデータポイント）

### Purpose
グラフ表示用の年次データポイント。

### TypeScript Definition

```typescript
export interface ChartDataPoint {
  year: number;          // 経過年数（0 = 開始時点）
  principal: number;     // その時点での元本累計（円）
  totalAssets: number;   // その時点での総資産額（円）
}
```

### Fields

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| year | number | 0 ~ years | 経過年数（0 = 開始時点） |
| principal | number | >= 0 | その時点での元本累計（円） |
| totalAssets | number | >= 0 | その時点での総資産額（円） |

### Calculation

各年のデータポイントを計算：

```typescript
function generateChartData(plan: InvestmentPlan): ChartDataPoint[] {
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
```

---

## Constants（定数）

### TypeScript Definition

```typescript
// lib/constants.ts

export const NISA_LIMITS = {
  TSUMITATE_ANNUAL: 1_200_000,  // つみたて投資枠の年間上限（円）
  GROWTH_ANNUAL: 2_400_000,     // 成長投資枠の年間上限（円）※本アプリでは未使用
  LIFETIME: 18_000_000,         // 生涯投資枠（円）※本アプリでは未使用
} as const;

export const INPUT_CONSTRAINTS = {
  MIN_MONTHLY_AMOUNT: 100,      // 最小積立額（円）
  MAX_YEARS: 40,                // 最大積立期間（年）
  MIN_YEARS: 1,                 // 最小積立期間（年）
  MIN_ANNUAL_RATE: -10.0,       // 最小年利回り（%）
  MAX_ANNUAL_RATE: 20.0,        // 最大年利回り（%）
  DEFAULT_ANNUAL_RATE: 5.0,     // デフォルト年利回り（%）
} as const;
```

---

## Data Flow

```
[User Input]
    ↓
[InvestmentPlan] ← バリデーション
    ↓
[calculateSimulation()]
    ↓
[SimulationResult] + [ChartDataPoint[]]
    ↓
[UI Display (ResultDisplay, Chart コンポーネント)]
```

**Scenario Comparison Flow**:

```
[User Input: Base Plan]
    ↓
[Multiple Scenarios with different rates]
    ↓
[calculateSimulation() for each scenario]
    ↓
[Scenario[]] each with SimulationResult
    ↓
[ScenarioComparison コンポーネント]
```

---

## State Management (React)

### useState パターン

```typescript
// app/page.tsx または SimulatorForm コンポーネント

const [plan, setPlan] = useState<InvestmentPlan>({
  monthlyAmount: 30000,
  years: 20,
  annualRate: 5.0,
});

const [result, setResult] = useState<SimulationResult | null>(null);

const handleCalculate = () => {
  const calculatedResult = calculateSimulation(plan);
  setResult(calculatedResult);
};
```

### Context パターン（オプション）

より複雑な状態管理が必要な場合：

```typescript
// lib/SimulatorContext.tsx

interface SimulatorContextType {
  plan: InvestmentPlan;
  result: SimulationResult | null;
  updatePlan: (plan: InvestmentPlan) => void;
  calculate: () => void;
}

const SimulatorContext = createContext<SimulatorContextType | undefined>(undefined);
```

---

## Validation

### TypeScript Definition

```typescript
// lib/validation.ts

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateInvestmentPlan(plan: InvestmentPlan): ValidationResult {
  const errors: string[] = [];

  if (plan.monthlyAmount < INPUT_CONSTRAINTS.MIN_MONTHLY_AMOUNT) {
    errors.push(`積立額は${INPUT_CONSTRAINTS.MIN_MONTHLY_AMOUNT}円以上を入力してください`);
  }

  if (plan.years < INPUT_CONSTRAINTS.MIN_YEARS || plan.years > INPUT_CONSTRAINTS.MAX_YEARS) {
    errors.push(
      `積立期間は${INPUT_CONSTRAINTS.MIN_YEARS}年から${INPUT_CONSTRAINTS.MAX_YEARS}年の範囲で入力してください`
    );
  }

  if (plan.annualRate < INPUT_CONSTRAINTS.MIN_ANNUAL_RATE || plan.annualRate > INPUT_CONSTRAINTS.MAX_ANNUAL_RATE) {
    errors.push(
      `利回りは${INPUT_CONSTRAINTS.MIN_ANNUAL_RATE}%から${INPUT_CONSTRAINTS.MAX_ANNUAL_RATE}%の範囲で入力してください`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
```

---

## Summary

データモデルは以下の4つの TypeScript 型で構成されます：

1. **InvestmentPlan**: ユーザー入力（積立額、期間、利回り）
2. **SimulationResult**: 計算結果（総資産、元本、運用益、NISA枠情報、グラフデータ）
3. **Scenario**: シナリオ比較用（名前、利回り、結果、色）
4. **ChartDataPoint**: グラフ表示用データ（年、元本、総資産）

すべての型は `lib/types.ts` に定義し、React の `useState` または Context API で状態管理します。
