# ユニットアーキテクチャ図

**プロジェクト**: 002-nisa-tax-comparison
**作成日**: 2025-11-18
**最終更新**: 2025-11-18

---

## 🏗️ ユニット分割マップ

```
┌─────────────────────────────────────────────────────────────────┐
│                   002-nisa-tax-comparison                       │
│                    (税金比較機能)                                │
└─────────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│   Unit 1      │   │   Unit 2      │   │   Unit 3      │
│               │   │               │   │               │
│ 計算・データ層 │   │  UI/表示層    │   │  グラフ層     │
│               │   │               │   │               │
│   Priority    │   │   Priority    │   │   Priority    │
│   P1 (最優先) │   │   P1 (高)     │   │   P2 (中)     │
└───────────────┘   └───────────────┘   └───────────────┘
```

---

## 🔗 ユニット間依存関係図

### 詳細な依存関係

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  User Story 1: 節税額の視覚的確認                                │
│  User Story 2: 詳細な税金比較グラフ                              │
│  User Story 3: エッジケースの適切な処理                          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                            │
                            │ 実装
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                       Unit 1: 計算・データ層                      │
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────────┐   │
│  │ lib/calculator │  │  lib/types     │  │ lib/validation  │   │
│  │                │  │                │  │                 │   │
│  │ - calculate    │  │ - TaxComparison│  │ - validate      │   │
│  │   TaxComparison│  │   Result       │  │   InvestmentPlan│   │
│  │ - calculate    │  │ - YearlyData   │  │                 │   │
│  │   Yearly...    │  │ - Investment   │  │                 │   │
│  │                │  │   Plan         │  │                 │   │
│  └────────────────┘  └────────────────┘  └─────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │          contexts/InvestmentPlanContext.tsx              │   │
│  │                                                          │   │
│  │  - InvestmentPlanProvider                                │   │
│  │  - useInvestmentPlan()                                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                            │
                            │ データ提供
                            │ (TaxComparisonResult, useInvestmentPlan)
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                     Unit 2: UI/プレゼンテーション層               │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │           app/tax-comparison/page.tsx                     │  │
│  │           app/tax-comparison/page.module.css              │  │
│  │                                                           │  │
│  │  - メインページレイアウト                                   │  │
│  │  - Context からデータ取得                                   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                            │                                     │
│                ┌───────────┴───────────┐                         │
│                ▼                       ▼                         │
│  ┌─────────────────────────┐  ┌─────────────────────────┐      │
│  │ TaxSavingsHighlight     │  │ TaxDetailTable          │      │
│  │ .tsx + .module.css      │  │ .tsx + .module.css      │      │
│  │                         │  │                         │      │
│  │ - 節税額強調表示         │  │ - 詳細内訳テーブル       │      │
│  │ - 手取り金額比較         │  │ - レスポンシブ対応       │      │
│  └─────────────────────────┘  └─────────────────────────┘      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                            │
                            │ データ提供
                            │ (TaxComparisonResult, InvestmentPlan)
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                      Unit 3: グラフ可視化層                       │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │             Chart.js + react-chartjs-2                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                            │                                     │
│                ┌───────────┴───────────┐                         │
│                ▼                       ▼                         │
│  ┌─────────────────────────┐  ┌─────────────────────────┐      │
│  │ TaxComparisonBarChart   │  │ TaxComparisonLineChart  │      │
│  │ .tsx + .module.css      │  │ .tsx + .module.css      │      │
│  │                         │  │                         │      │
│  │ - 積み上げ棒グラフ       │  │ - 年次推移グラフ         │      │
│  │ - 元本・運用益・税金     │  │ - NISA vs 特定口座      │      │
│  │ - 凡例・ツールチップ     │  │ - インタラクション       │      │
│  └─────────────────────────┘  └─────────────────────────┘      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📊 データフロー図

### 1. 初期表示時のデータフロー

```
[ユーザー]
    │
    │ 1. 001 のメインページで条件入力
    │    (積立額, 期間, 利回り)
    ▼
[InvestmentPlanContext]
    │
    │ 2. setPlan() でデータ保存
    │
    ▼
[ユーザー]
    │
    │ 3. 「税金比較」タブをクリック
    │
    ▼
[app/tax-comparison/page.tsx] (Unit 2)
    │
    │ 4. useInvestmentPlan() でデータ取得
    │
    ▼
[calculateTaxComparison()] (Unit 1)
    │
    │ 5. 税金計算実行
    │
    ▼
[TaxComparisonResult]
    │
    ├─── 6a. → [TaxSavingsHighlight] (Unit 2)
    │
    ├─── 6b. → [TaxDetailTable] (Unit 2)
    │
    ├─── 6c. → [TaxComparisonBarChart] (Unit 3)
    │
    └─── 6d. → [TaxComparisonLineChart] (Unit 3)
                    │
                    ▼
                [ユーザー]
                画面に結果表示
```

---

## 🔄 ユニット間インターフェース定義

### Unit 1 → Unit 2

```typescript
// 提供するインターフェース
export {
  calculateTaxComparison,
  useInvestmentPlan,
  type InvestmentPlan,
  type TaxComparisonResult,
  type ValidationError,
};

// Unit 2 での利用例
import { useInvestmentPlan } from '@/contexts/InvestmentPlanContext';
import { calculateTaxComparison } from '@/lib/calculator';
import { TaxComparisonResult } from '@/lib/types';

const { plan } = useInvestmentPlan();
const result: TaxComparisonResult = calculateTaxComparison(plan);
```

### Unit 1 → Unit 3

```typescript
// 提供するインターフェース
export {
  calculateYearlyTaxComparison,
  type InvestmentPlan,
  type YearlyData,
};

// Unit 3 での利用例
import { calculateYearlyTaxComparison } from '@/lib/calculator';
import { InvestmentPlan, YearlyData } from '@/lib/types';

const yearlyData: YearlyData[] = calculateYearlyTaxComparison(plan);
```

### Unit 2 → Unit 3

```typescript
// Unit 2 から Unit 3 へ props として渡す
<TaxComparisonBarChart result={result} />
<TaxComparisonLineChart plan={plan} />
```

---

## 🏛️ レイヤードアーキテクチャ

```
┌──────────────────────────────────────────────────────────┐
│                     Presentation Layer                   │  ← Unit 3
│                       (グラフ可視化)                      │
│                                                          │
│  - TaxComparisonBarChart                                 │
│  - TaxComparisonLineChart                                │
└──────────────────────────────────────────────────────────┘
                          ↑
                          │ データ
                          │
┌──────────────────────────────────────────────────────────┐
│                     Presentation Layer                   │  ← Unit 2
│                         (UI/表示)                        │
│                                                          │
│  - page.tsx (メインページ)                                │
│  - TaxSavingsHighlight                                   │
│  - TaxDetailTable                                        │
└──────────────────────────────────────────────────────────┘
                          ↑
                          │ データ
                          │
┌──────────────────────────────────────────────────────────┐
│                      Business Logic Layer                │  ← Unit 1
│                       (計算・データ)                      │
│                                                          │
│  - calculator.ts (計算ロジック)                           │
│  - validation.ts (バリデーション)                         │
│  - InvestmentPlanContext (データ管理)                     │
│  - types.ts (型定義)                                      │
└──────────────────────────────────────────────────────────┘
```

---

## 📦 ファイル構成の全体像

```
002-nisa-tax-comparison/
│
├── lib/                            # Unit 1
│   ├── calculator.ts               (拡張)
│   ├── types.ts                    (拡張)
│   └── validation.ts               (新規)
│
├── contexts/                       # Unit 1
│   └── InvestmentPlanContext.tsx   (新規)
│
├── app/tax-comparison/             # Unit 2
│   ├── page.tsx                    (新規)
│   └── page.module.css             (新規)
│
└── components/                     # Unit 2 & Unit 3
    ├── TaxSavingsHighlight.tsx             (新規) - Unit 2
    ├── TaxSavingsHighlight.module.css      (新規) - Unit 2
    ├── TaxDetailTable.tsx                  (新規) - Unit 2
    ├── TaxDetailTable.module.css           (新規) - Unit 2
    ├── TaxComparisonBarChart.tsx           (新規) - Unit 3
    ├── TaxComparisonBarChart.module.css    (新規) - Unit 3
    ├── TaxComparisonLineChart.tsx          (新規) - Unit 3
    └── TaxComparisonLineChart.module.css   (新規) - Unit 3
```

**設計原則**: 各 `.tsx` ファイルに対応する `.module.css` ファイルを必ず作成（1対1 対応）

---

## 🧪 テスト戦略の全体像

### Unit 1: ユニットテスト
```
__tests__/
├── lib/
│   ├── calculator.test.ts
│   └── validation.test.ts
└── contexts/
    └── InvestmentPlanContext.test.tsx
```

### Unit 2: コンポーネントテスト
```
__tests__/
├── app/tax-comparison/
│   └── page.test.tsx
└── components/
    ├── TaxSavingsHighlight.test.tsx
    └── TaxDetailTable.test.tsx
```

### Unit 3: コンポーネントテスト + ビジュアルテスト
```
__tests__/
├── components/
│   ├── TaxComparisonBarChart.test.tsx
│   └── TaxComparisonLineChart.test.tsx
└── visual/
    └── charts.visual.test.tsx
```

### 統合テスト
```
__tests__/
└── integration/
    └── tax-comparison-flow.test.tsx
```

### E2E テスト
```
e2e/
└── tax-comparison.spec.ts
```

---

## 🎯 各ユニットの責務と境界

| ユニット | 責務 | 境界 |
|---------|------|------|
| **Unit 1** | データ計算、型定義、データ管理 | UI に関与しない |
| **Unit 2** | UI 表示、レイアウト、基本的な情報提示 | グラフ描画に関与しない |
| **Unit 3** | グラフ描画、視覚化、Chart.js 管理 | 計算ロジックに関与しない |

---

## ✅ アーキテクチャの検証

### 高凝集の確認
- ✅ **Unit 1**: 計算とデータ管理に特化
- ✅ **Unit 2**: UI 表示に特化
- ✅ **Unit 3**: グラフ描画に特化

### 疎結合の確認
- ✅ **Unit 1 ↔ Unit 2**: 型定義とフックのみで連携
- ✅ **Unit 1 ↔ Unit 3**: 型定義と関数のみで連携
- ✅ **Unit 2 ↔ Unit 3**: React props のみで連携

### 単一責任原則の確認
- ✅ **Unit 1**: データと計算のみを担当
- ✅ **Unit 2**: UI 表示のみを担当
- ✅ **Unit 3**: グラフ描画のみを担当

### 依存性逆転の原則の確認
- ✅ Unit 2 と Unit 3 は Unit 1 の具象実装ではなく、インターフェース（型定義）に依存

---

**作成者**: Claude (AI Architect)
**最終更新**: 2025-11-18
