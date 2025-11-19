# 構築順序と段階的デリバリー計画

**プロジェクト**: 002-nisa-tax-comparison
**作成日**: 2025-11-18
**最終更新**: 2025-11-18

---

## 📋 構築順序（推奨）

### フェーズ 1: 基盤構築（Unit 1）
**担当**: Backend/フルスタック開発者
**期間**: 2-3日
**優先度**: 最優先（P0）

#### 作業内容
1. **型定義の拡張**
   - `lib/types.ts` に以下を追加:
     - `TaxComparisonResult`
     - `YearlyData`
     - `ValidationError`

2. **計算ロジックの実装**
   - `lib/calculator.ts` に以下を追加:
     - `calculateTaxComparison()` 関数
     - `calculateYearlyTaxComparison()` 関数

3. **バリデーションロジックの実装**
   - `lib/validation.ts` を新規作成:
     - `validateInvestmentPlan()` 関数

4. **Context API の実装**
   - `contexts/InvestmentPlanContext.tsx` を新規作成:
     - `InvestmentPlanProvider` コンポーネント
     - `useInvestmentPlan()` カスタムフック

5. **ユニットテストの作成**
   - `__tests__/lib/calculator.test.ts`
   - `__tests__/lib/validation.test.ts`
   - `__tests__/contexts/InvestmentPlanContext.test.tsx`

#### 完了条件（DoD）
- [ ] すべてのユニットテストが成功（カバレッジ 90% 以上）
- [ ] TypeScript のコンパイルエラーがない
- [ ] ESLint・Prettier が適用されている
- [ ] コードレビュー完了

#### 成果物
- `lib/types.ts` (拡張)
- `lib/calculator.ts` (拡張)
- `lib/validation.ts` (新規)
- `contexts/InvestmentPlanContext.tsx` (新規)
- テストファイル 3つ

---

### フェーズ 2-A: UI層の構築（Unit 2）【並行可能】
**担当**: フロントエンド開発者 A
**期間**: 2-3日
**優先度**: 高（P1）
**前提条件**: フェーズ 1 完了

#### 作業内容
1. **メインページの実装**
   - `app/tax-comparison/page.tsx` + `page.module.css`
   - Context からデータ取得
   - レイアウト構築

2. **節税額表示コンポーネント**
   - `components/TaxSavingsHighlight.tsx` + `.module.css`
   - 節税額の強調表示
   - 手取り金額の比較表示

3. **詳細内訳テーブルコンポーネント**
   - `components/TaxDetailTable.tsx` + `.module.css`
   - テーブルレイアウト
   - レスポンシブ対応

4. **コンポーネントテストの作成**
   - `__tests__/components/TaxSavingsHighlight.test.tsx`
   - `__tests__/components/TaxDetailTable.test.tsx`
   - `__tests__/app/tax-comparison/page.test.tsx`

#### 完了条件（DoD）
- [ ] すべてのコンポーネントが正しく表示される
- [ ] tsx と CSS の 1対1 対応が守られている
- [ ] CSS Modules が正しく適用されている
- [ ] レスポンシブデザインが動作する（デスクトップ・モバイル）
- [ ] すべてのコンポーネントテストが成功
- [ ] TypeScript のコンパイルエラーがない
- [ ] ESLint・Prettier が適用されている

#### 成果物
- `app/tax-comparison/page.tsx` + `.module.css` (新規)
- `components/TaxSavingsHighlight.tsx` + `.module.css` (新規)
- `components/TaxDetailTable.tsx` + `.module.css` (新規)
- テストファイル 3つ

---

### フェーズ 2-B: グラフ層の構築（Unit 3）【並行可能】
**担当**: フロントエンド開発者 B
**期間**: 2-3日
**優先度**: 中（P2）
**前提条件**: フェーズ 1 完了

#### 作業内容
1. **Chart.js のインストール**
   ```bash
   bun add chart.js react-chartjs-2
   ```

2. **積み上げ棒グラフコンポーネント**
   - `components/TaxComparisonBarChart.tsx` + `.module.css`
   - Chart.js の設定
   - 凡例・ツールチップの実装

3. **年次推移グラフコンポーネント**
   - `components/TaxComparisonLineChart.tsx` + `.module.css`
   - Chart.js の設定
   - インタラクションの実装

4. **コンポーネントテストの作成**
   - `__tests__/components/TaxComparisonBarChart.test.tsx`
   - `__tests__/components/TaxComparisonLineChart.test.tsx`

#### 完了条件（DoD）
- [ ] すべてのグラフが正しく表示される
- [ ] tsx と CSS の 1対1 対応が守られている
- [ ] CSS Modules が正しく適用されている
- [ ] マウスホバーで金額が表示される
- [ ] レスポンシブデザインが動作する
- [ ] すべてのコンポーネントテストが成功
- [ ] TypeScript のコンパイルエラーがない
- [ ] ESLint・Prettier が適用されている

#### 成果物
- `components/TaxComparisonBarChart.tsx` + `.module.css` (新規)
- `components/TaxComparisonLineChart.tsx` + `.module.css` (新規)
- テストファイル 2つ

---

### フェーズ 3: 統合とテスト
**担当**: 全員
**期間**: 1-2日
**優先度**: 最優先（P0）
**前提条件**: フェーズ 2-A, 2-B 完了

#### 作業内容
1. **グラフコンポーネントの統合**
   - `app/tax-comparison/page.tsx` にグラフを追加

2. **Context Provider の追加**
   - `app/layout.tsx` に `InvestmentPlanProvider` を追加

3. **001 との統合**
   - 001 のメインページに「税金比較」タブを追加
   - ナビゲーションの実装

4. **E2E テストの作成**
   - Playwright または Cypress による E2E テスト
   - ユーザーシナリオのテスト

5. **統合テストの実施**
   - すべてのユニットが連携して動作することを確認

#### 完了条件（DoD）
- [ ] すべての機能が統合されて動作する
- [ ] 001 から 002 への遷移が正しく動作する
- [ ] E2E テストが成功する
- [ ] パフォーマンステスト完了（計算 < 1秒、グラフ描画 < 500ms）
- [ ] デスクトップ・モバイル両方で動作確認
- [ ] コードレビュー完了

#### 成果物
- 統合された 002-nisa-tax-comparison 機能
- E2E テストスイート

---

## 🎯 MVP（Minimum Viable Product）定義

### MVP に含まれるユニット
- ✅ **Unit 1**: 計算・データ層（必須）
- ✅ **Unit 2**: UI/プレゼンテーション層（必須）
- ❌ **Unit 3**: グラフ可視化層（オプション）

### MVP で提供される機能
1. NISA vs 特定口座の税金比較計算
2. 節税額の強調表示
3. 手取り金額の比較表示
4. 詳細内訳テーブル
5. 001 からの遷移とデータ共有

### MVP で提供されない機能
- グラフによる視覚化（リリース 2 で追加）

### MVP 判断基準
- ユーザーが節税額を具体的な金額で確認できる
- ユーザーが NISA と特定口座の違いを理解できる
- 001 の基本機能から 1クリックで遷移できる

---

## 📊 段階的デリバリー計画

### リリース 1（MVP）: Week 1-2
**目標**: 節税額を数値で確認できる最小機能

#### 含まれる内容
- Unit 1: 計算・データ層
- Unit 2: UI/プレゼンテーション層（グラフなし）

#### デリバリー内容
- 税金比較ページ
- 節税額の強調表示
- 詳細内訳テーブル
- 001 からの遷移

#### スケジュール
- Day 1-3: フェーズ 1（Unit 1）
- Day 4-6: フェーズ 2-A（Unit 2）
- Day 7-8: フェーズ 3（統合）
- Day 9-10: QA とバグ修正

#### リリース判定基準
- [ ] すべてのユニットテストが成功
- [ ] E2E テストが成功
- [ ] デスクトップ・モバイル両方で動作確認
- [ ] パフォーマンステスト合格
- [ ] セキュリティチェック完了

---

### リリース 2（完全版）: Week 3
**目標**: グラフによる視覚化を追加

#### 含まれる内容
- Unit 3: グラフ可視化層

#### デリバリー内容
- 積み上げ棒グラフ
- 年次推移グラフ
- グラフのインタラクション

#### スケジュール
- Day 1-3: フェーズ 2-B（Unit 3）
- Day 4-5: 統合とテスト
- Day 6: QA とバグ修正

#### リリース判定基準
- [ ] すべてのグラフが正しく表示される
- [ ] ビジュアルリグレッションテスト成功
- [ ] パフォーマンステスト合格（グラフ描画 < 500ms）
- [ ] アクセシビリティチェック完了

---

## 🔄 並行開発の推奨事項

### 並行可能なタスク
- **フェーズ 2-A（Unit 2）** と **フェーズ 2-B（Unit 3）** は並行して開発可能
- 両方とも Unit 1 のインターフェースにのみ依存
- 互いに独立している

### チーム構成の推奨
- **開発者 A**: Unit 1 → Unit 2
- **開発者 B**: Unit 3（Unit 1 完了後に開始）
- **QA エンジニア**: 統合テスト・E2E テスト

### コミュニケーション計画
- **Daily Stand-up**: 進捗確認とブロッカーの共有
- **週次レビュー**: コードレビューと品質チェック
- **Slack/Discord**: リアルタイムコミュニケーション

---

## ⚠️ リスクと対策

### Risk 1: Unit 1 の遅延
**影響**: Unit 2 と Unit 3 の開発が開始できない
**対策**: Unit 1 を最優先し、インターフェースを早期に確定

### Risk 2: Context API の実装が複雑化
**影響**: 001 との統合が難しくなる
**対策**: シンプルな設計を維持、必要最小限の状態のみ管理

### Risk 3: Chart.js の設定が予想以上に複雑
**影響**: Unit 3 の開発が遅延
**対策**: MVP（リリース 1）にはグラフを含めず、リリース 2 で追加

---

## 📝 依存関係マップ

```
[User Story 1, 2, 3]
       ↓
   [Unit 1] ← 最優先
    ↙    ↘
[Unit 2]  [Unit 3] ← 並行開発可能
    ↓      ↓
  [統合テスト]
       ↓
   [リリース]
```

---

**作成者**: Claude (AI Architect)
**最終更新**: 2025-11-18
