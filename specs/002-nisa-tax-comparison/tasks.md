# Tasks: NISA vs 特定口座 税金比較機能

**Feature Branch**: `001-nisa-simulator` (002 機能を含む)
**Created**: 2025-11-18
**Status**: ✅ 完了
**Technology Stack**: Next.js 15+, React 19, TypeScript, CSS Modules, Chart.js, bun

---

## フェーズ 1: 基盤構築

**目的**: 税金比較の計算ロジックとデータ共有機能の実装

- [x] T001: `lib/types.ts` に型定義を追加（TaxComparisonResult, YearlyTaxData）
- [x] T002: `lib/calculator.ts` に税金計算ロジックを追加（calculateTaxComparison, calculateYearlyTaxComparison）
- [x] T003: `contexts/InvestmentPlanContext.tsx` を新規作成（Context API）
- [x] T004: `app/layout.tsx` に InvestmentPlanProvider を追加
- [x] T005: `app/page.tsx` を Context API に統合（既存の state を Context に移行）

**成果物**:
- `lib/types.ts` (拡張)
- `lib/calculator.ts` (拡張)
- `contexts/InvestmentPlanContext.tsx` (新規)
- `app/layout.tsx` (変更)
- `app/page.tsx` (変更)

---

## フェーズ 2-A: UI コンポーネント層

**目的**: 節税額表示と詳細内訳テーブルの実装

- [x] T006: `components/TaxSavingsHighlight.tsx` + CSS Modules を実装
  - 節税額の強調表示（💰 アイコン、グリーングラデーション）
  - NISA vs 特定口座の手取り比較表示
- [x] T007: `components/TaxDetailTable.tsx` + CSS Modules を実装
  - 詳細内訳テーブル（元本、運用益、税金、手取り）
  - レスポンシブ対応

**成果物**:
- `components/TaxSavingsHighlight.tsx` + `.module.css` (新規)
- `components/TaxDetailTable.tsx` + `.module.css` (新規)

---

## フェーズ 2-B: グラフ可視化層

**目的**: Chart.js による税金比較グラフの実装

- [x] T008: `components/TaxComparisonBarChart.tsx` + CSS Modules を実装
  - 積み上げ棒グラフ（元本・運用益・税金を色分け）
  - Chart.js の設定とツールチップ
- [x] T009: `components/TaxComparisonLineChart.tsx` + CSS Modules を実装
  - 年次推移グラフ（NISA vs 特定口座の手取り資産推移）
  - 2 本の線グラフで比較

**成果物**:
- `components/TaxComparisonBarChart.tsx` + `.module.css` (新規)
- `components/TaxComparisonLineChart.tsx` + `.module.css` (新規)

---

## フェーズ 3: ページ統合

**目的**: 税金比較ページの完成と 001 との統合

- [x] T010: `app/tax-comparison/page.tsx` + CSS Modules を実装
  - Context からデータ取得
  - すべてのコンポーネントを統合
  - シミュレーション条件の表示
  - レスポンシブレイアウト
- [x] T011: `app/page.tsx` にナビゲーションリンクを追加
  - 「税金比較（NISA vs 特定口座）→」リンク
- [x] T012: ビルドとテストの実行
  - `bun run build` の成功確認
  - 既存テストの成功確認

**成果物**:
- `app/tax-comparison/page.tsx` + `.module.css` (新規)
- `app/page.tsx` (変更)

---

## フェーズ 4: テスト

**目的**: 税金比較機能のユニットテスト追加

- [x] T013: `__tests__/unit/calculator.test.ts` に税金比較テストを追加
  - `calculateTaxComparison()` のテスト（4 ケース）
  - `calculateYearlyTaxComparison()` のテスト（4 ケース）
  - エッジケース対応（マイナス利回り、0%）
  - 税率 20.315% の正確性確認

**テスト結果**:
- ✅ 26 テスト成功
- ✅ 155 アサーション成功
- ✅ 0 失敗

**成果物**:
- `__tests__/unit/calculator.test.ts` (拡張)

---

## フェーズ 5: ドキュメント

**目的**: 仕様ドキュメントと設計資料の整理

- [x] T014: `specs/002-nisa-tax-comparison/spec.md` の追加
- [x] T015: `specs/002-nisa-tax-comparison/design-artifacts/` の追加
  - unit-01-calculation-data.md
  - unit-02-presentation.md
  - unit-03-visualization.md
  - unit-architecture-diagram.md
  - unit-build-order.md

**成果物**:
- 仕様ドキュメント一式

---

## 実装サマリー

### ✅ 完了したタスク
- **Total**: 15 タスク
- **Phase 1**: 5 タスク（基盤構築）
- **Phase 2-A**: 2 タスク（UI コンポーネント）
- **Phase 2-B**: 2 タスク（グラフ）
- **Phase 3**: 3 タスク（ページ統合）
- **Phase 4**: 1 タスク（テスト）
- **Phase 5**: 2 タスク（ドキュメント）

### 📊 成果物
- **新規ファイル**: 13 ファイル
  - Context: 1 ファイル
  - Components: 4 ファイル（+ 4 CSS）
  - Pages: 1 ファイル（+ 1 CSS）
  - Types/Logic: 型定義・計算ロジック拡張
- **変更ファイル**: 3 ファイル
  - `app/layout.tsx`
  - `app/page.tsx`
  - `__tests__/unit/calculator.test.ts`

### 🎯 実装された機能
1. ✅ NISA vs 特定口座の税金比較計算
2. ✅ 節税額の視覚的表示（💰 アイコン付き）
3. ✅ 詳細内訳テーブル
4. ✅ 積み上げ棒グラフ（元本・運用益・税金）
5. ✅ 年次推移グラフ（2 本の線グラフ）
6. ✅ Context API によるデータ共有
7. ✅ レスポンシブデザイン
8. ✅ 包括的なユニットテスト

### 🚀 技術的ハイライト
- **税率**: 20.315%（所得税 15.315% + 住民税 5%）
- **エッジケース対応**: 運用益マイナス・0% の場合は税金 0 円
- **データ共有**: React Context API で 001 と 002 がシームレスに連携
- **テスト**: 8 つの新規テストケースを追加（26 テスト合計）

### 📝 コミット履歴
1. ✅ `feat(002): 税金比較の型定義と計算ロジックを追加`
2. ✅ `feat(002): Context API を実装してデータ共有機能を追加`
3. ✅ `feat(002): 節税額表示コンポーネントを実装`
4. ✅ `feat(002): 詳細内訳テーブルコンポーネントを実装`
5. ✅ `feat(002): グラフコンポーネントを実装（積み上げ棒グラフ・年次推移）`
6. ✅ `feat(002): 税金比較ページを実装`
7. ✅ `docs(002): NISA 税金比較機能の仕様ドキュメントを追加`
8. ✅ `test(002): 税金比較機能のユニットテストを追加`

---

## 次のステップ（オプション）

- [ ] コンポーネントテストの追加（React Testing Library）
- [ ] E2E テストの追加（Playwright）
- [ ] アクセシビリティテスト
- [ ] パフォーマンス最適化
- [ ] Vercel へのデプロイ

---

**Status**: ✅ **All tasks completed** (2025-11-19)
**Last Updated**: 2025-11-19
