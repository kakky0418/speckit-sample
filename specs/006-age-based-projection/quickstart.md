# クイックスタート: 年齢ベース資産予測機能

## 概要

この機能は NISA シミュレーターに年齢入力機能を追加し、「何歳のときにいくらになるか」をライフプランの視点で表示します。

## 優先度別の実装順序

### P1: 現在の年齢入力と年齢ベース表示（MVP）

最優先で実装すべき機能。これだけでユーザーに価値を提供できます。

**実装ステップ**:

1. **型定義の拡張** (`lib/types.ts`)
   ```typescript
   export interface InvestmentPlan {
     monthlyAmount: number;
     years: number;
     annualRate: number;
     initialAmount?: number;
     currentAge?: number;  // 追加
   }
   ```

2. **バリデーション** (`lib/validation.ts`)
   ```typescript
   export function validateAge(age: number | undefined): ValidationResult {
     if (age === undefined) return { isValid: true, errors: [] };
     if (!Number.isInteger(age)) return { isValid: false, errors: ['整数で入力してください'] };
     if (age < 1 || age > 120) return { isValid: false, errors: ['1 歳以上 120 歳以下で入力してください'] };
     return { isValid: true, errors: [] };
   }
   ```

3. **入力フォームの拡張** (`components/InputForm.tsx`)
   - 「現在の年齢」入力欄を追加
   - バリデーションエラー表示

4. **結果表示の拡張** (`components/ResultDisplay.tsx`)
   - 年齢が入力されている場合: 「55 歳時点での資産額」
   - 年齢が入力されていない場合: 「20 年後の資産額」（従来通り）

5. **グラフ X 軸の切り替え** (`components/InvestmentChart.tsx`)
   ```typescript
   const labels = currentAge !== undefined
     ? chartData.map((point) => `${currentAge + point.year}歳`)
     : chartData.map((point) => `${point.year}年`);
   ```

**テスト**（実装前に書くこと - TDD）:
- ✅ `validateAge` のユニットテスト
- ✅ 年齢入力欄の表示テスト
- ✅ X 軸ラベルの切り替えテスト
- ✅ 結果表示の年齢/期間切り替えテスト

**受入れ基準**:
- 年齢を入力すると「XX 歳時点での資産額」が表示される
- グラフの X 軸が「35 歳」「40 歳」「45 歳」のように年齢表示になる
- 年齢未入力時は従来通り「0 年」「5 年」「10 年」と表示される

---

### P2: 節目の年齢でのマイルストーン表示

P1 完成後に独立して実装できる UX 改善機能。

**実装ステップ**:

1. **ユーティリティ関数** (`lib/ageUtils.ts`)
   ```typescript
   export function generateMilestones(
     currentAge: number,
     years: number,
     chartData: ChartDataPoint[]
   ): Milestone[] {
     const milestones: Milestone[] = [];
     const firstMilestone = Math.ceil(currentAge / 10) * 10;

     for (let age = firstMilestone; age <= currentAge + years; age += 10) {
       const yearFromNow = age - currentAge;
       const assets = chartData[yearFromNow]?.totalAssets || 0;
       milestones.push({ age, yearFromNow, assets });
     }

     return milestones;
   }
   ```

2. **マイルストーンコンポーネント** (`components/Milestone.tsx`)
   - 10 歳刻みの年齢と資産額を表示
   - カード形式またはテーブル形式

**テスト**（実装前に書くこと - TDD）:
- ✅ `generateMilestones` のユニットテスト
- ✅ マイルストーンコンポーネントの表示テスト

**受入れ基準**:
- 40 歳、50 歳、60 歳などの節目の年齢での資産額が表示される
- 積立期間内の節目のみ表示される

---

### P3: 目標年齢での資産額逆算機能

P1、P2 なしでも独立して実装できる高度な機能。

**実装ステップ**:

1. **逆算計算ロジック** (`lib/ageUtils.ts`)
   ```typescript
   export function calculateRequiredMonthlyAmount(
     params: ReverseCalculationParams
   ): ReverseCalculationResult {
     const { currentAge, targetAge, targetAmount, annualRate, initialAmount = 0 } = params;
     const years = targetAge - currentAge;
     const months = years * 12;
     const monthlyRate = annualRate / 12 / 100;

     let requiredMonthlyAmount: number;

     if (monthlyRate === 0) {
       requiredMonthlyAmount = (targetAmount - initialAmount) / months;
     } else {
       const initialGrowth = initialAmount * Math.pow(1 + monthlyRate, months);
       const remainingAmount = targetAmount - initialGrowth;
       requiredMonthlyAmount = remainingAmount * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);
     }

     const isRealistic = requiredMonthlyAmount <= 1000000; // 100 万円以下
     const warningMessage = isRealistic ? null : '目標達成には非現実的な積立額が必要です';

     return { requiredMonthlyAmount, years, isRealistic, warningMessage };
   }
   ```

2. **逆算機能コンポーネント** (`components/ReverseCalculator.tsx`)
   - 目標年齢、目標資産額の入力欄
   - 必要な積立額の表示
   - 「この積立額でシミュレーションする」ボタン

**テスト**（実装前に書くこと - TDD）:
- ✅ `calculateRequiredMonthlyAmount` のユニットテスト
- ✅ 逆算結果の精度テスト
- ✅ 逆算コンポーネントの表示テスト

**受入れ基準**:
- 目標年齢と目標資産額を入力すると、必要な積立額が表示される
- 「この積立額でシミュレーションする」ボタンで通常モードに切り替えられる

---

## TDD サイクル

**重要**: 憲法の TDD 原則に従い、以下の順序で実装すること。

1. **Red**: テストを書く（失敗することを確認）
2. **Green**: 最小限の実装でテストをパスさせる
3. **Refactor**: コードを整理する
4. **Repeat**: 次のテストに進む

**例（P1 の validateAge 関数）**:

```bash
# 1. テストを先に書く
vi __tests__/lib/validation.test.ts
# describe('validateAge', () => { ... })

# 2. テスト実行（Red）
bun test

# 3. 実装を書く
vi lib/validation.ts

# 4. テスト実行（Green）
bun test

# 5. リファクタリング
vi lib/validation.ts

# 6. テスト実行（確認）
bun test
```

---

## 開発環境

### 必要なツール

- **bun**: パッケージマネージャー・ランタイム
- **Next.js 15**: フレームワーク
- **React 19**: UI ライブラリ
- **TypeScript 5**: 型安全性
- **Jest**: テストフレームワーク

### コマンド

```bash
# 開発サーバー起動
bun dev

# テスト実行
bun test

# テスト監視モード
bun test:watch

# ビルド
bun build

# リント
bun lint
```

---

## 既存コードへの影響

### 変更が必要なファイル

| ファイル | 変更内容 |
|---------|---------|
| `lib/types.ts` | `InvestmentPlan` に `currentAge?: number` を追加 |
| `lib/validation.ts` | `validateAge` 関数を追加 |
| `components/InputForm.tsx` | 年齢入力欄を追加 |
| `components/ResultDisplay.tsx` | 年齢ベース表示を追加 |
| `components/InvestmentChart.tsx` | X 軸ラベル生成を条件分岐 |

### 新規作成が必要なファイル

| ファイル | 目的 |
|---------|------|
| `lib/ageUtils.ts` | 年齢関連ユーティリティ関数 |
| `components/Milestone.tsx` | マイルストーン表示（P2） |
| `components/ReverseCalculator.tsx` | 逆算機能（P3） |
| `__tests__/lib/ageUtils.test.ts` | 年齢ユーティリティのテスト |
| `__tests__/components/Milestone.test.tsx` | マイルストーンのテスト（P2） |
| `__tests__/components/ReverseCalculator.test.tsx` | 逆算機能のテスト（P3） |

---

## 後方互換性の確認

### 既存テストの実行

```bash
# すべてのテストを実行し、既存機能が壊れていないことを確認
bun test

# 特定のテストのみ実行
bun test __tests__/lib/calculator.test.ts
```

### 確認ポイント

- ✅ 年齢を入力しない場合、従来通りの表示になること
- ✅ 既存の計算ロジックが変更されていないこと
- ✅ 既存のグラフ表示が正常に動作すること

---

## リリース戦略

### フェーズごとのリリース

1. **Phase 1: P1 のみリリース**
   - MVP として年齢入力と年齢ベース表示を提供
   - ユーザーフィードバックを収集

2. **Phase 2: P2 追加リリース**
   - マイルストーン表示を追加
   - UX 改善

3. **Phase 3: P3 追加リリース**
   - 逆算機能を追加
   - 高度なプランニング機能を提供

各フェーズは独立してリリース可能です（憲法の原則 IV: Independent User Stories）。

---

## トラブルシューティング

### よくあるエラー

**エラー**: 「整数で入力してください」
- **原因**: 年齢に小数点を含む値が入力されている
- **解決**: 整数のみ入力可能であることを UI で明示

**エラー**: 「1 歳以上 120 歳以下で入力してください」
- **原因**: 年齢が範囲外
- **解決**: バリデーションエラーメッセージを表示

**グラフの X 軸が年齢表示にならない**
- **原因**: `currentAge` が undefined または props が正しく渡されていない
- **解決**: React DevTools でコンポーネントの props を確認

---

## 次のステップ

このクイックスタートを完了したら、次のコマンドでタスク分解を行います:

```bash
/speckit.tasks
```

タスク分解により、具体的な実装ステップに分解され、`/speckit.implement` で自動実装が可能になります。
