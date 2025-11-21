# リサーチ: 年齢ベース資産予測機能

**Date**: 2025-11-21
**Feature**: 006-age-based-projection
**Phase**: 0 (Outline & Research)

## Research Questions

このフェーズでは、実装に必要な技術的な意思決定を行うためのリサーチを実施しました。

### 1. 既存コードの構造理解

**Question**: 既存の NISA シミュレーターはどのようなアーキテクチャで実装されているか？

**Research**: 既存コードを調査

**Findings**:
- **型定義**: `lib/types.ts` で `InvestmentPlan`, `SimulationResult`, `ChartDataPoint` を定義
- **計算ロジック**: `lib/calculator.ts` で複利計算を実装（`calculateSimulation`, `generateChartData`）
- **グラフコンポーネント**: `components/InvestmentChart.tsx` で Chart.js を使用
- **X 軸ラベル**: 現在は `chartData.map((point) => \`${point.year}年\`)` で生成（line 35）

**Decision**: 既存の構造を維持し、以下の拡張を行う
- `InvestmentPlan` に `currentAge?: number` を追加
- `ChartDataPoint` に `age?: number` を追加
- `InvestmentChart.tsx` の X 軸ラベル生成を条件分岐で拡張

**Rationale**: 既存のアーキテクチャは明確でシンプル。新規ライブラリの導入なしに年齢機能を追加できる。後方互換性を維持するため、すべての年齢関連フィールドをオプションにする。

**Alternatives Considered**:
- ❌ 新規コンポーネントを作成（既存コンポーネントとの重複コードが増える）
- ❌ グラフライブラリを変更（Chart.js は十分に機能しており、変更のメリットなし）

---

### 2. 年齢情報の State 管理

**Question**: 年齢情報をどこで管理し、どのようにコンポーネント間で共有するか？

**Research**: React の State 管理パターンと既存実装を調査

**Findings**:
- 既存コードは props drilling パターンを使用（Context API や状態管理ライブラリは未使用）
- `InvestmentPlan` インターフェースに `initialAmount` が既に存在（オプションフィールド）
- 同様のパターンで `currentAge` を追加可能

**Decision**: `InvestmentPlan` インターフェースに `currentAge?: number` を追加し、既存の props drilling パターンを継続

**Rationale**:
- 既存のパターンに一貫性を持たせる
- 小規模アプリケーションのため、Context API や Redux は過剰
- YAGNI 原則に従い、必要最小限の変更にとどめる

**Alternatives Considered**:
- ❌ Context API 導入（小規模アプリには過剰、憲法の Simplicity 原則に反する）
- ❌ 独立した State（年齢情報は `InvestmentPlan` の一部として扱う方が自然）

---

### 3. グラフ X 軸の年齢/期間切り替え

**Question**: グラフの X 軸を「年齢」と「期間」で動的に切り替える最適な方法は？

**Research**: Chart.js のラベル動的生成パターンを調査

**Findings**:
- Chart.js のラベルは単純な配列で定義（`labels: string[]`）
- ラベル生成は React コンポーネント内で行われる（line 35 of InvestmentChart.tsx）
- 現在: `chartData.map((point) => \`${point.year}年\`)`

**Decision**: `InvestmentChart` コンポーネントに `currentAge?: number` props を追加し、条件分岐でラベル生成を切り替える

```typescript
const labels = currentAge !== undefined
  ? chartData.map((point) => `${currentAge + point.year}歳`)
  : chartData.map((point) => `${point.year}年`);
```

**Rationale**:
- シンプルで読みやすい実装
- 既存のラベル生成ロジックを最小限の変更で拡張
- 後方互換性を完全に維持（`currentAge` が undefined なら従来通り）

**Alternatives Considered**:
- ❌ ChartDataPoint に age フィールドを追加（計算ロジックの複雑化、不要なデータの重複）
- ❌ 別の Chart コンポーネントを作成（コードの重複、保守性の低下）

---

### 4. 年齢計算ユーティリティ

**Question**: 年齢関連の計算ロジックをどこに配置するか？

**Research**: 既存のユーティリティ構造を調査

**Findings**:
- `lib/calculator.ts`: 複利計算ロジック
- `lib/formatters.ts`: 数値フォーマッター
- `lib/validation.ts`: バリデーションロジック

**Decision**: `lib/ageUtils.ts` を新規作成し、以下の関数を実装
- `calculateFutureAge(currentAge: number, years: number): number`
- `generateMilestones(currentAge: number, years: number): number[]` （P2 用）
- `calculateRequiredMonthlyAmount(...)` （P3 用）

**Rationale**:
- 関心の分離（age 関連ロジックを独立したファイルに）
- 既存の lib/ ディレクトリ構造に一貫性を持たせる
- テストしやすいピュアな関数として実装

**Alternatives Considered**:
- ❌ calculator.ts に追加（ファイルが肥大化し、関心が混在する）
- ❌ コンポーネント内に実装（ロジックと UI の分離ができず、テストが困難）

---

### 5. マイルストーン表示（P2）の実装方法

**Question**: 節目の年齢（40 歳、50 歳、60 歳など）での資産額をどのように強調表示するか？

**Research**: UI パターンと既存コンポーネントを調査

**Findings**:
- 既存の結果表示コンポーネントはシンプルなカード形式
- CSS Modules を使用してスタイリング
- テーブル形式やカード形式が一般的

**Decision**: 新規コンポーネント `Milestone.tsx` を作成し、以下の仕様で実装
- 10 歳刻みのマイルストーン年齢を自動計算
- カード形式で年齢と資産額を表示
- 積立期間内のマイルストーンのみ表示（例: 35 歳で 3 年積立なら表示なし）

**Rationale**:
- 独立したコンポーネントとして実装することで、P1 と P2 を分離して開発できる
- ユーザーストーリーの独立性を確保（憲法の原則 IV に準拠）

**Alternatives Considered**:
- ❌ グラフ上にマーカー表示（Chart.js の複雑な設定が必要、可読性低下）
- ❌ 既存コンポーネントに統合（P1 と P2 の分離ができず、並行開発が困難）

---

### 6. 逆算機能（P3）の計算アルゴリズム

**Question**: 目標年齢と目標資産額から必要な積立額を逆算する計算式は？

**Research**: 複利計算の逆算式を調査

**Findings**:
- 既存の計算式（正算）: `FV = PMT × ((1 + r)^n - 1) / r + InitialAmount × (1 + r)^n`
- 逆算式: `PMT = (FV - InitialAmount × (1 + r)^n) × r / ((1 + r)^n - 1)`
  - FV: 目標資産額（Future Value）
  - PMT: 毎月の積立額（Payment）
  - r: 月利
  - n: 積立回数（月数）
  - InitialAmount: 初回投資額

**Decision**: `lib/ageUtils.ts` に `calculateRequiredMonthlyAmount` 関数を実装

```typescript
function calculateRequiredMonthlyAmount(
  targetAge: number,
  targetAmount: number,
  currentAge: number,
  annualRate: number,
  initialAmount: number = 0
): number
```

**Rationale**:
- 数学的に正しい逆算式を使用
- 既存の複利計算ロジックと整合性を保つ
- ピュアな関数として実装し、テストしやすくする

**Alternatives Considered**:
- ❌ 近似値計算（精度が低下し、ユーザーの信頼性を損なう）
- ❌ API 経由で計算（バックエンド不要の原則に反する、オーバーエンジニアリング）

---

### 7. バリデーション戦略

**Question**: 年齢入力のバリデーションはどのように実装するか？

**Research**: 既存のバリデーションロジックを調査

**Findings**:
- `lib/validation.ts` に既存のバリデーション関数あり
- 範囲チェック、型チェックなどを実施

**Decision**: `lib/validation.ts` に年齢バリデーション関数を追加

```typescript
function validateAge(age: number | undefined): ValidationResult {
  if (age === undefined) {
    return { isValid: true, errors: [] }; // 年齢はオプション
  }

  if (!Number.isInteger(age)) {
    return { isValid: false, errors: ['整数で入力してください'] };
  }

  if (age < 1 || age > 120) {
    return { isValid: false, errors: ['1 歳以上 120 歳以下で入力してください'] };
  }

  return { isValid: true, errors: [] };
}
```

**Rationale**:
- 既存のバリデーションパターンに一貫性を持たせる
- 年齢はオプションフィールドのため、undefined を許容
- 整数チェックと範囲チェックを仕様（FR-001, FR-002）に従って実装

**Alternatives Considered**:
- ❌ コンポーネント内でバリデーション（ロジックの分散、テストが困難）
- ❌ バリデーションライブラリ導入（小規模な検証のため過剰）

---

### 8. テスト戦略

**Question**: TDD を実践するために、どのようなテストを書くべきか？

**Research**: 既存テストと TDD ベストプラクティスを調査

**Findings**:
- 既存テスト: Jest + React Testing Library
- ユニットテスト: `__tests__/lib/` にロジックテスト
- コンポーネントテスト: `__tests__/components/` に UI テスト

**Decision**: 以下のテストを Phase 1 で作成（実装前に Red テストを書く）

**ユニットテスト**:
1. `__tests__/lib/ageUtils.test.ts`
   - `calculateFutureAge` の正常系・異常系
   - `generateMilestones` の 10 歳刻み計算
   - `calculateRequiredMonthlyAmount` の逆算精度
2. `__tests__/lib/validation.test.ts`
   - 年齢バリデーションの全パターン

**コンポーネントテスト**:
1. `__tests__/components/InputForm.test.tsx`
   - 年齢入力欄の表示
   - バリデーションエラー表示
2. `__tests__/components/InvestmentChart.test.tsx`
   - X 軸ラベルが年齢/期間で切り替わること
3. `__tests__/components/Milestone.test.tsx` （P2）
   - マイルストーンの正しい表示
4. `__tests__/components/ReverseCalculator.test.tsx` （P3）
   - 逆算結果の正確性

**Rationale**:
- TDD サイクルに従い、テストファーストで実装
- 既存テスト構造に一貫性を持たせる
- 受入れ基準を直接テストコードに反映

**Alternatives Considered**:
- ❌ E2E テストのみ（ユニットレベルのバグ検出が遅れる）
- ❌ テストなし（憲法の TDD 原則に違反、非交渉的ルール）

---

## Summary of Decisions

| 項目 | 決定事項 |
|------|---------|
| **データモデル拡張** | `InvestmentPlan` に `currentAge?: number` を追加 |
| **State 管理** | 既存の props drilling パターンを継続（Context API 不要） |
| **グラフ X 軸** | 条件分岐で年齢/期間ラベルを動的生成 |
| **新規ファイル** | `lib/ageUtils.ts`, `components/Milestone.tsx`, `components/ReverseCalculator.tsx` |
| **バリデーション** | `lib/validation.ts` に年齢検証関数を追加 |
| **テスト戦略** | TDD サイクルでユニットテスト + コンポーネントテストを先行実装 |

すべての決定は憲法の原則（Simplicity, YAGNI, TDD）に準拠しています。
