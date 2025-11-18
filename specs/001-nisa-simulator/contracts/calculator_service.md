# Calculator Service Contract

**Service**: Calculator Functions
**Purpose**: 複利計算と NISA 枠チェックを行う関数群の契約
**Location**: `lib/calculator.ts`

## Interface

### Function: calculateSimulation

**Description**: 積立プランに基づいてシミュレーション結果を計算します。

**Signature**:
```typescript
export function calculateSimulation(plan: InvestmentPlan): SimulationResult
```

**Input**:
```typescript
InvestmentPlan {
  monthlyAmount: number,  // >= 100
  years: number,          // 1 <= years <= 40
  annualRate: number      // -10.0 <= rate <= 20.0
}
```

**Output**:
```typescript
SimulationResult {
  totalAssets: number,           // 将来の総資産額（円）
  totalPrincipal: number,        // 元本合計（円）
  totalProfit: number,           // 運用益（= totalAssets - totalPrincipal）
  annualInvestment: number,      // 年間投資額（円）
  nisaUtilizationRate: number,   // NISA枠活用率（0.0 ~ 1.0+）
  isOverNisaLimit: boolean,      // NISA枠超過フラグ
  chartData: ChartDataPoint[]    // グラフ表示用データポイント
}
```

**Calculation Logic**:

1. **元本合計**:
   ```typescript
   totalPrincipal = monthlyAmount × years × 12
   ```

2. **総資産額（複利計算）**:
   ```typescript
   const monthlyRate = annualRate / 12 / 100;
   const months = years × 12;

   if (monthlyRate === 0) {
     totalAssets = monthlyAmount × months;
   } else {
     totalAssets = monthlyAmount × (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
   }
   ```

3. **運用益**:
   ```typescript
   totalProfit = totalAssets - totalPrincipal
   ```

4. **年間投資額**:
   ```typescript
   annualInvestment = monthlyAmount × 12
   ```

5. **NISA枠活用率**:
   ```typescript
   nisaUtilizationRate = annualInvestment / NISA_LIMITS.TSUMITATE_ANNUAL
   ```

6. **NISA枠超過判定**:
   ```typescript
   isOverNisaLimit = (annualInvestment > NISA_LIMITS.TSUMITATE_ANNUAL)
   ```

7. **グラフデータ**:
   各年（0年目〜積立期間）のデータポイントを `generateChartData()` で生成

**Preconditions**:
- `plan` は `validateInvestmentPlan()` でバリデーション済みであること
- `monthlyAmount`, `years`, `annualRate` が有効な範囲内であること

**Postconditions**:
- `totalAssets >= 0`
- `totalPrincipal >= 0`
- `chartData.length === years + 1`

**Error Handling**:
- 入力値が無効な場合、`Error` をスロー
- バリデーションエラーの詳細は `errors` プロパティに含める

**Implementation Example**:
```typescript
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
```

---

### Function: generateChartData

**Description**: グラフ表示用の年次データポイントを生成します。

**Signature**:
```typescript
export function generateChartData(plan: InvestmentPlan): ChartDataPoint[]
```

**Input**:
```typescript
InvestmentPlan {
  monthlyAmount: number,
  years: number,
  annualRate: number
}
```

**Output**:
```typescript
ChartDataPoint[] = [
  {
    year: number,           // 0 ~ years
    principal: number,      // その時点での元本累計（円）
    totalAssets: number     // その時点での総資産額（円）
  },
  ...
]
```

**Calculation Logic**:

```typescript
const chartData: ChartDataPoint[] = [];
const monthlyRate = annualRate / 12 / 100;

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
```

**Preconditions**:
- `plan` はバリデーション済みであること

**Postconditions**:
- 返される配列の長さは `years + 1`
- `year 0` のデータポイントは `principal = 0, totalAssets = 0`
- 各データポイントで `totalAssets >= principal`（利回り >= 0 の場合）

---

### Function: calculateMultipleScenarios

**Description**: 同じ積立条件で複数の利回りシナリオを計算します。

**Signature**:
```typescript
export function calculateMultipleScenarios(
  basePlan: InvestmentPlan,
  scenarios: { name: string; annualRate: number; color: string }[]
): Scenario[]
```

**Input**:
```typescript
basePlan: InvestmentPlan,
scenarios: [
  { name: string, annualRate: number, color: string },
  ...
]  // 最大3つ
```

**Output**:
```typescript
Scenario[] = [
  {
    name: string,
    annualRate: number,
    result: SimulationResult,
    color: string
  },
  ...
]
```

**Calculation Logic**:

1. `basePlan` の `monthlyAmount` と `years` を使用
2. 各シナリオの `annualRate` に対して `calculateSimulation()` を実行
3. 結果に名前と色を付与

**Implementation Example**:
```typescript
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
```

**Preconditions**:
- `basePlan` はバリデーション済みであること
- `scenarios` の長さは 1 ~ 3

**Postconditions**:
- 返される配列の長さは `scenarios` の長さと同じ
- 各シナリオは有効な `SimulationResult` を持つ

---

## Constants

**Location**: `lib/constants.ts`

```typescript
export const NISA_LIMITS = {
  TSUMITATE_ANNUAL: 1_200_000,  // つみたて投資枠の年間上限（円/年）
  GROWTH_ANNUAL: 2_400_000,     // 成長投資枠の年間上限（円/年）※未使用
  LIFETIME: 18_000_000,         // 生涯投資枠（円）※未使用
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

## Usage Example

```typescript
import { calculateSimulation, calculateMultipleScenarios } from '@/lib/calculator';
import type { InvestmentPlan } from '@/lib/types';

// 積立プランの作成
const plan: InvestmentPlan = {
  monthlyAmount: 30000,
  years: 20,
  annualRate: 5.0,
};

// シミュレーション実行
const result = calculateSimulation(plan);

console.log(`総資産額: ${result.totalAssets.toLocaleString('ja-JP')}円`);
console.log(`元本: ${result.totalPrincipal.toLocaleString('ja-JP')}円`);
console.log(`運用益: ${result.totalProfit.toLocaleString('ja-JP')}円`);
console.log(`NISA枠活用率: ${(result.nisaUtilizationRate * 100).toFixed(1)}%`);

// 複数シナリオ計算
const scenarios = calculateMultipleScenarios(plan, [
  { name: '保守的', annualRate: 3.0, color: '#3b82f6' },
  { name: '標準', annualRate: 5.0, color: '#10b981' },
  { name: '楽観的', annualRate: 7.0, color: '#f59e0b' },
]);

scenarios.forEach((scenario) => {
  console.log(`${scenario.name}: ${scenario.result.totalAssets.toLocaleString('ja-JP')}円`);
});
```

---

## Testing Requirements

### Unit Tests (`__tests__/unit/calculator.test.ts`)

1. **正常ケース**:
   - 標準的な入力値（月3万円、20年、年利5%）で正しい結果を返すこと
   - 結果が期待値（約1,233万円）に近いこと（±1万円の誤差許容）

2. **境界値テスト**:
   - 最小積立額（100円）で正しく計算できること
   - 最大積立期間（40年）で正しく計算できること
   - 利回り0%の場合、`totalAssets === totalPrincipal` であること
   - マイナス利回り（-5%）の場合、`totalAssets < totalPrincipal` であること

3. **エッジケース**:
   - 極端に大きな積立額（月100万円）でもオーバーフローしないこと
   - 利回り20%でも正しく計算できること
   - 小数点以下の積立額（33333.33円）を正しく処理できること

4. **NISA枠チェック**:
   - 年間投資額が120万円以下の場合、`isOverNisaLimit === false`
   - 年間投資額が120万円を超える場合、`isOverNisaLimit === true`
   - `nisaUtilizationRate` が正しく計算されること

5. **グラフデータ**:
   - `chartData.length === years + 1` であること
   - `year 0` のデータポイントが `principal = 0, totalAssets = 0` であること
   - 各データポイントで `totalAssets >= principal` であること（利回り >= 0 の場合）

### Component Tests (`__tests__/components/`)

1. **SimulatorForm との連携**:
   - フォーム入力後、`calculateSimulation()` が正しく呼ばれること
   - 計算結果が ResultDisplay に正しく渡されること

2. **Chart との連携**:
   - `chartData` が Chart.js に正しく渡されること
   - グラフが正しくレンダリングされること

### E2E Tests (`__tests__/e2e/simulator.spec.ts`)

1. **基本フロー**:
   - ユーザーが入力して計算ボタンを押すと、結果が表示されること
   - グラフが表示されること

2. **複数シナリオ比較**:
   - 3つのシナリオを選択すると、3つの結果が並んで表示されること

---

## Performance Requirements

- 単一シミュレーション計算は **10ms 以内**に完了すること
- 複数シナリオ（3つ）の計算は **30ms 以内**に完了すること
- メモリ使用量は **10MB 以下**であること
- React の再レンダリングを最小化するため、`useMemo` を使用すること

---

## Security Considerations

- すべての計算はクライアントサイド（ブラウザ）で実行
- 外部APIやサーバーへの通信は行わない
- ユーザーデータの永続化や送信は行わない
- XSS 対策: ユーザー入力は数値のみ受け付け、文字列は受け付けない

---

## Summary

Calculator Service は以下の3つの純粋関数で構成されます：

1. **calculateSimulation**: 単一シミュレーション計算
2. **generateChartData**: グラフ用データポイント生成
3. **calculateMultipleScenarios**: 複数シナリオ計算

すべての関数は副作用がなく、同じ入力に対して常に同じ出力を返します（Pure Functions）。
