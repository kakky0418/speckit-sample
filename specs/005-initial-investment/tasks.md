# タスクリスト: 初回投資額設定機能

**ブランチ**: `005-initial-investment`
**作成日**: 2025-11-19
**ステータス**: 準備完了
**技術スタック**: TypeScript 5.x + React 19 + Next.js 15.1.3, Chart.js, CSS Modules

---

## 実装戦略

### MVP スコープ
**User Story 1（P1）のみで MVP として価値を提供可能**
- 初回投資額の入力
- シミュレーション結果への反映
- グラフへの反映

User Story 2（P2）はオプション機能で、MVP には含めない。

### 段階的デリバリー
1. **Phase 1**: データモデル更新（US1 の基盤）
2. **Phase 2**: User Story 1 - 初回投資額の設定とシミュレーション反映（MVP）
3. **Phase 3**: User Story 2 - リセット機能（オプション）

---

## タスク依存関係

### User Story 完了順序
```
Phase 1 (Setup)
   ↓
Phase 2 (US1) → MVP リリース可能
   ↓
Phase 3 (US2) → オプション機能追加
```

### Phase 2 (US1) 内の並列実行可能タスク
```
T003 [P] 型定義更新
T004 [P] Context 更新
   ↓
T005, T006, T007 [P] 計算ロジック更新（並列実行可能）
   ↓
T008 UI 実装
   ↓
T009 [P] テスト追加
```

---

## Phase 1: セットアップ

**目的**: 開発環境の準備と依存関係の確認

- [ ] T001 開発ブランチの確認（005-initial-investment にいることを確認）
- [ ] T002 依存関係のインストール確認（bun install が完了していることを確認）

**完了条件**:
- すべての依存関係がインストール済み
- 開発サーバーが起動可能（bun run dev）

---

## Phase 2: User Story 1 - 初回投資額の設定とシミュレーション反映 (P1)

**目的**: 初回投資額の入力からシミュレーション結果の反映まで一貫した機能を実装

**Independent Test**: 初回投資額に 100 万円を入力してシミュレーションを実行し、結果画面で元本と総資産額に初回投資額が含まれていることを確認

### サブフェーズ 2.1: データモデル更新

- [x] T003 [P] [US1] `lib/types.ts` の InvestmentPlan インターフェースに `initialAmount?: number` フィールドを追加
- [x] T004 [P] [US1] `contexts/InvestmentPlanContext.tsx` のデフォルト値に `initialAmount: 0` を追加

**完了条件**:
- InvestmentPlan 型が initialAmount フィールドを含む
- Context のデフォルト値が更新されている
- TypeScript のコンパイルエラーがない

### サブフェーズ 2.2: 計算ロジック更新

- [x] T005 [P] [US1] `lib/calculator.ts` の `calculateSimulation` 関数を更新（初回投資額を含む複利計算を実装）
- [x] T006 [P] [US1] `lib/calculator.ts` の `generateChartData` 関数を更新（初回投資額をグラフデータに反映）
- [x] T007 [P] [US1] `lib/calculator.ts` の `calculateTaxComparison` 関数を更新（税金比較計算に初回投資額を含める）
- [x] T008 [P] [US1] `lib/calculator.ts` の `calculateYearlyTaxComparison` 関数を更新（年次税金比較に初回投資額を含める）

**完了条件**:
- すべての計算関数が initialAmount を考慮した計算を行う
- 利回り 0% のエッジケースに対応
- TypeScript のコンパイルエラーがない

**計算式の参考**:
```typescript
// 初回投資額の複利成長
const initialGrowth = (initialAmount || 0) * Math.pow(1 + monthlyRate, months);

// 月次積立の複利成長
const monthlyGrowth = monthlyAmount * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;

// 総資産額
const totalAssets = initialGrowth + monthlyGrowth;

// 元本合計
const totalPrincipal = (initialAmount || 0) + (monthlyAmount * years * 12);
```

### サブフェーズ 2.3: UI 実装

- [x] T009 [US1] `app/page.tsx` に初回投資額入力フィールドを追加（フォームグループとして既存の入力フィールドと同じ構造で実装）
- [x] T010 [US1] `app/page.module.css` に初回投資額入力フィールドのスタイルを追加（既存の input スタイルと統一）
- [x] T011 [US1] `lib/validation.ts` にバリデーションロジックを追加（0 円以上、数値のみ受付、エラーメッセージ表示）

**完了条件**:
- 初回投資額入力フィールドが表示される
- 正の数値を入力できる
- 負の数値や数値以外を入力するとエラーメッセージが表示される
- UI が既存のレイアウトと統一されている

**UI 実装の参考**:
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

### サブフェーズ 2.4: テスト実装

- [x] T012 [P] [US1] `__tests__/unit/calculator.test.ts` に初回投資額のテストケースを追加（4 ケース: 初回投資額のみ、初回投資額 + 月次積立、未入力、利回り 0%）
- [x] T013 [US1] すべてのテストを実行して成功を確認（bun run test）

**完了条件**:
- 初回投資額のユニットテストが追加されている
- すべてのテストが成功する
- 既存のテストが破壊されていない

**テストケースの参考**:
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
    expect(result.totalAssets).toBeGreaterThan(result.totalPrincipal);
  });

  it('初回投資額が未入力（undefined）の場合', () => {
    const plan: InvestmentPlan = {
      monthlyAmount: 30000,
      years: 20,
      annualRate: 5.0,
      initialAmount: undefined,
    };
    const result = calculateSimulation(plan);
    // 既存の動作と同じになることを確認
    expect(result.totalPrincipal).toBe(7200000);
  });

  it('利回り 0% の場合の初回投資額', () => {
    const plan: InvestmentPlan = {
      monthlyAmount: 30000,
      years: 20,
      annualRate: 0,
      initialAmount: 1000000,
    };
    const result = calculateSimulation(plan);
    // 元本 = 1000000 + (30000 * 240) = 8,200,000 円
    // 利回り 0% なので総資産 = 元本
    expect(result.totalAssets).toBe(8200000);
  });
});
```

### サブフェーズ 2.5: 統合確認

- [x] T014 [US1] 開発サーバーを起動して手動で動作確認（初回投資額の入力、シミュレーション実行、結果表示）
- [x] T015 [US1] グラフに初回投資額が正しく反映されていることを確認（0 年目で元本と総資産額が initialAmount になる）
- [x] T016 [US1] 税金比較ページで初回投資額が正しく計算されることを確認

**完了条件（User Story 1 の Independent Test）**:
- ✅ シミュレーター画面を開き、初回投資額に 100 万円を入力
- ✅ シミュレーションを実行
- ✅ 結果画面で元本と総資産額に初回投資額が含まれている
- ✅ グラフの 0 年目で元本と総資産額がともに 100 万円として表示される

---

## Phase 3: User Story 2 - 初回投資額のリセット (P2)

**目的**: 初回投資額をクリアして再設定できるリセット機能を追加

**Independent Test**: 初回投資額を入力後、リセットボタンをクリックし、入力欄が空になることを確認

**依存関係**: User Story 1 が完了していること

- [ ] T017 [US2] `app/page.tsx` にリセットボタンの UI を追加
- [ ] T018 [US2] `app/page.module.css` にリセットボタンのスタイルを追加
- [ ] T019 [US2] リセットボタンのクリックハンドラーを実装（initialAmount を 0 にリセット）
- [ ] T020 [US2] リセット機能の動作確認

**完了条件（User Story 2 の Independent Test）**:
- ✅ 初回投資額に値を入力
- ✅ リセットボタンをクリック
- ✅ 初回投資額入力欄が空（または 0）になる

---

## Phase 3.5: User Story 3 - 万円単位での入力・表示 (P2)

**目的**: すべての金額入力・表示を万円単位に変更し、ユーザビリティを改善

**Independent Test**: 月次積立額に「3」、初回投資額に「100」を入力してシミュレーションを実行し、結果が万円単位で表示されることを確認

**依存関係**: User Story 1 が完了していること

### サブフェーズ 3.5.1: 入力フィールドの万円化

- [x] T025 [P] [US3] `app/page.tsx` の入力フィールドラベルを万円単位に変更
- [x] T026 [P] [US3] `app/page.tsx` の入力値変換ロジックを実装（ユーザー入力 × 10000 → 内部保存）
- [x] T027 [P] [US3] `app/page.tsx` の表示値変換ロジックを実装（内部値 ÷ 10000 → ユーザー表示）
- [x] T028 [P] [US3] `lib/constants.ts` の MIN_MONTHLY_AMOUNT を万円単位に変更（100 円 → 0.01 万円）

**完了条件**:
- 入力フィールドのラベルが「（万円）」表示になっている
- 入力時に自動的に 10000 倍されて内部保存される
- 既存の値が万円単位で表示される

### サブフェーズ 3.5.2: 結果表示の万円化

- [x] T029 [P] [US3] `app/page.tsx` のシミュレーション結果表示を万円単位に変更
- [x] T030 [P] [US3] `app/comparison/page.tsx` の結果表示を万円単位に変更
- [x] T031 [P] [US3] `app/tax-comparison/page.tsx` の結果表示を万円単位に変更

**完了条件**:
- すべての結果表示が万円単位で表示される
- 単位として「万円」が表示される

### サブフェーズ 3.5.3: グラフの万円化

- [x] T032 [US3] `components/InvestmentChart.tsx` の Y 軸ラベルを万円単位に変更
- [x] T033 [US3] グラフのツールチップ表示を万円単位に変更（必要に応じて）

**完了条件**:
- グラフの Y 軸が万円単位で表示される
- ツールチップが万円単位で表示される（該当する場合）

### サブフェーズ 3.5.4: テストとバリデーション

- [x] T034 [US3] 万円単位での入力・表示が正しく動作することを手動確認
- [x] T035 [US3] すべてのページで一貫性が保たれていることを確認
- [x] T036 [US3] プロダクションビルドの成功確認

**完了条件（User Story 3 の Independent Test）**:
- ✅ 月次積立額に「3」（3 万円）を入力
- ✅ 初回投資額に「100」（100 万円）を入力
- ✅ シミュレーション実行
- ✅ 結果が万円単位で表示される
- ✅ グラフが万円単位で表示される
- ✅ すべてのページで万円単位が使用されている

---

## Phase 4: 最終確認とドキュメント更新

**目的**: 全体の統合確認とドキュメントの更新

- [x] T021 プロダクションビルドの成功確認（bun run build）
- [x] T022 すべてのテストの最終確認（bun run test）
- [ ] T023 手動テストの実施（すべての Acceptance Scenarios を確認）
- [ ] T024 CLAUDE.md の更新（必要に応じて）

**完了条件**:
- プロダクションビルドが成功する
- すべてのテストが成功する
- すべての Acceptance Scenarios が満たされている

---

## タスクサマリー

### 総タスク数
- **Total**: 24 タスク
- **Phase 1**: 2 タスク（セットアップ）
- **Phase 2**: 14 タスク（User Story 1 - MVP）
- **Phase 3**: 4 タスク（User Story 2 - オプション）
- **Phase 4**: 4 タスク（最終確認）

### User Story ごとのタスク数
- **US1 (P1)**: 14 タスク（MVP として必須）
- **US2 (P2)**: 4 タスク（オプション機能）

### 並列実行可能なタスク
- T003, T004: データモデル更新（2 タスク並列可能）
- T005, T006, T007, T008: 計算ロジック更新（4 タスク並列可能）
- T012: テスト追加（他のテストと並列可能）

### 推定所要時間
- **Phase 1**: 5 分
- **Phase 2**: 2〜3 時間
- **Phase 3**: 30 分
- **Phase 4**: 30 分
- **合計**: 約 3〜4 時間

---

## 実装チェックリスト

### User Story 1 (P1) - MVP

**データモデル**:
- [ ] InvestmentPlan に initialAmount フィールドを追加
- [ ] Context のデフォルト値を更新

**計算ロジック**:
- [ ] calculateSimulation を更新
- [ ] generateChartData を更新
- [ ] calculateTaxComparison を更新
- [ ] calculateYearlyTaxComparison を更新

**UI**:
- [ ] 初回投資額入力フィールドを追加
- [ ] バリデーションを実装
- [ ] スタイルを追加

**テスト**:
- [ ] ユニットテストを追加
- [ ] 手動テストを実施

**Independent Test 確認**:
- [ ] 初回投資額 100 万円を入力してシミュレーション実行
- [ ] 結果画面で元本と総資産額に初回投資額が含まれることを確認
- [ ] グラフの 0 年目で 100 万円と表示されることを確認

### User Story 2 (P2) - オプション

**UI**:
- [ ] リセットボタンを追加
- [ ] リセット機能を実装

**Independent Test 確認**:
- [ ] リセットボタンで入力欄がクリアされることを確認

---

## 次のステップ

1. ✅ Tasks 生成完了
2. 🔄 Phase 1 から順次実装開始
3. ⏳ User Story 1 完了後に MVP リリース検討
4. ⏳ User Story 2 は必要に応じて実装

**ステータス**: ✅ **タスク生成完了** - 実装準備完了
**Last Updated**: 2025-11-19
