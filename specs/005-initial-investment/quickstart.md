# クイックスタート: 初回投資額設定機能

**Feature**: 初回投資額設定機能
**Branch**: `005-initial-investment`
**Date**: 2025-11-19

## 概要

NISA シミュレーターに初回投資額（一括投資額）を設定できる機能を追加します。ユーザーは退職金やボーナスなどの一時金を活用した投資計画をシミュレートできるようになります。

---

## 機能説明

### ユーザーから見た機能

1. **初回投資額の入力**（P1）
   - シミュレーター画面に初回投資額の入力フィールドが追加される
   - 0 円以上の金額を入力可能（上限なし）
   - 未入力の場合は 0 円として扱われる

2. **シミュレーション結果への反映**（P2）
   - 初回投資額が元本と総資産額に含まれる
   - グラフに初回投資額が反映される（0 年目から表示）

3. **初回投資額のリセット**（P3）
   - リセットボタンで初回投資額をクリアできる

### 技術的な実装

- **データモデル**: `InvestmentPlan` 型に `initialAmount?: number` フィールドを追加
- **計算ロジック**: 複利計算に初回投資額を含める
- **UI**: 既存のフォームに入力フィールドを追加
- **状態管理**: 既存の Context API を活用

---

## 変更ファイル一覧

### 必須の変更

| ファイル | 種類 | 説明 |
|---------|------|------|
| `lib/types.ts` | 型定義 | `InvestmentPlan` に `initialAmount?: number` を追加 |
| `lib/calculator.ts` | 計算ロジック | `calculateSimulation` など 4 つの関数を更新 |
| `contexts/InvestmentPlanContext.tsx` | Context | デフォルト値に `initialAmount: 0` を追加 |
| `app/page.tsx` | UI | 初回投資額入力フィールドを追加 |
| `app/page.module.css` | スタイル | 入力フィールドのスタイルを追加 |
| `__tests__/unit/calculator.test.ts` | テスト | 初回投資額のテストケースを追加 |

### 変更不要のファイル

以下のファイルは変更不要です：

- `components/InvestmentChart.tsx`（グラフコンポーネント）
- `app/layout.tsx`（レイアウト）
- `app/globals.css`（グローバルスタイル）

---

## ローカル開発環境のセットアップ

### 前提条件

- **Node.js**: v18 以上
- **Bun**: v1.0 以上（パッケージマネージャー）
- **Git**: インストール済み

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd speckit-sample
```

### 2. 機能ブランチへの切り替え

```bash
git checkout 005-initial-investment
```

### 3. 依存関係のインストール

```bash
bun install
```

### 4. 開発サーバーの起動

```bash
bun run dev
```

ブラウザで http://localhost:3000 を開きます。

---

## 実装手順

### Phase 1: データモデル更新

**所要時間**: 10 分

1. **`lib/types.ts` の更新**

```typescript
export interface InvestmentPlan {
  monthlyAmount: number;
  years: number;
  annualRate: number;
  initialAmount?: number;  // 追加
}
```

2. **`contexts/InvestmentPlanContext.tsx` の更新**

```typescript
const [plan, setPlan] = useState<InvestmentPlan>({
  monthlyAmount: 30000,
  years: 20,
  annualRate: 5.0,
  initialAmount: 0,  // 追加
});
```

### Phase 2: 計算ロジック更新

**所要時間**: 30 分

`lib/calculator.ts` で以下の 4 つの関数を更新します：

1. `calculateSimulation`
2. `generateChartData`
3. `calculateTaxComparison`
4. `calculateYearlyTaxComparison`

**計算式** (`research.md` を参照):

```typescript
// 初回投資額の複利成長
const initialGrowth = (initialAmount || 0) * Math.pow(1 + monthlyRate, months);

// 月次積立の複利成長
const monthlyGrowth = monthlyAmount * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;

// 総資産額
const totalAssets = initialGrowth + monthlyGrowth;
```

### Phase 3: UI 実装

**所要時間**: 20 分

`app/page.tsx` に初回投資額入力フィールドを追加します：

```tsx
<div className={styles.formGroup}>
  <label htmlFor="initialAmount" className={styles.label}>
    初回投資額（円）
  </label>
  <input
    type="number"
    id="initialAmount"
    className={styles.input}
    value={plan.initialAmount || ''}
    onChange={(e) =>
      setPlan((prev) => ({
        ...prev,
        initialAmount: e.target.value === '' ? 0 : parseFloat(e.target.value),
      }))
    }
    placeholder="0"
    min="0"
  />
</div>
```

### Phase 4: テスト実装

**所要時間**: 30 分

`__tests__/unit/calculator.test.ts` にテストケースを追加します：

```typescript
describe('calculateSimulation with initialAmount', () => {
  it('初回投資額のみのシミュレーション', () => {
    const plan: InvestmentPlan = {
      monthlyAmount: 0,
      years: 20,
      annualRate: 5.0,
      initialAmount: 1000000,
    };

    const result = calculateSimulation(plan);

    // 期待値: 1000000 * (1.05)^20 ≈ 2,653,297 円
    expect(result.totalAssets).toBeCloseTo(2653297, 0);
  });

  it('初回投資額 + 月次積立のシミュレーション', () => {
    const plan: InvestmentPlan = {
      monthlyAmount: 30000,
      years: 20,
      annualRate: 5.0,
      initialAmount: 1000000,
    };

    const result = calculateSimulation(plan);

    // 元本: 1000000 + (30000 * 240) = 8,200,000 円
    expect(result.totalPrincipal).toBe(8200000);

    // 総資産額は初回投資額の成長 + 月次積立の成長
    expect(result.totalAssets).toBeGreaterThan(result.totalPrincipal);
  });
});
```

---

## テスト実行方法

### すべてのテストを実行

```bash
bun run test
```

### ウォッチモードで実行

```bash
bun run test:watch
```

### 特定のテストファイルのみ実行

```bash
bun test __tests__/unit/calculator.test.ts
```

### テストカバレッジを確認

```bash
bun test --coverage
```

---

## ビルドと動作確認

### 1. プロダクションビルド

```bash
bun run build
```

### 2. プロダクション環境で起動

```bash
bun run start
```

### 3. 動作確認項目

- [ ] 初回投資額入力フィールドが表示される
- [ ] 正の数値を入力できる
- [ ] 負の数値を入力するとエラーメッセージが表示される
- [ ] 初回投資額が結果に反映される
- [ ] グラフに初回投資額が反映される（0 年目から）
- [ ] 初回投資額が未入力の場合、既存の動作と同じになる

---

## トラブルシューティング

### Q1: `initialAmount` が undefined になる

**A**: `InvestmentPlan` 型に `initialAmount?: number` を追加したか確認してください。

### Q2: 計算結果が正しくない

**A**: `research.md` の計算式を確認し、`initialAmount || 0` でデフォルト値を設定しているか確認してください。

### Q3: グラフに初回投資額が反映されない

**A**: `generateChartData` 関数で初回投資額を含む計算を行っているか確認してください。

### Q4: テストが失敗する

**A**: 既存のテストが初回投資額を考慮していない可能性があります。既存のテストに `initialAmount: 0` を追加してください。

---

## 参考リンク

- **仕様書**: [spec.md](./spec.md)
- **実装計画**: [plan.md](./plan.md)
- **調査結果**: [research.md](./research.md)
- **データモデル**: [data-model.md](./data-model.md)

---

## 次のステップ

1. ✅ Quickstart 作成完了
2. 🔄 Agent context 更新（次のステップ）
3. ⏳ `/speckit.tasks` で tasks.md を生成
4. ⏳ 実装開始

**Questions?** specs/005-initial-investment/ 配下のドキュメントを参照してください。
