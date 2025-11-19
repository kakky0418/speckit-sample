# 開発契約チェックリスト - 002-nisa-tax-comparison

**プロジェクト**: 002-nisa-tax-comparison
**作成日**: 2025-11-18
**User Story**: US-002-001

---

## 📋 契約として使用可能かのチェックリスト

### 1. 要件の明確性

- [x] **Intent が明確**: 目的、背景、期待される成果が記述されている
- [x] **ペルソナが明確**: 誰が使うのか（投資初心者、NISA検討者）が定義されている
- [x] **Goal が具体的**: 達成したいことが明確に記述されている
- [x] **優先度が設定**: P1（MVP）として定義されている

---

### 2. Acceptance Criteria の完全性

- [x] **AC-1**: 節税額の強調表示（Given-When-Then 形式）
- [x] **AC-2**: 手取り金額の比較表示（Given-When-Then 形式）
- [x] **AC-3**: 積み上げ棒グラフの表示（Given-When-Then 形式）
- [x] **AC-4**: 年次推移グラフの表示（Given-When-Then 形式）
- [x] **AC-5**: 詳細内訳テーブルの表示（Given-When-Then 形式）
- [x] **AC-6**: 001 からの遷移（Given-When-Then 形式）
- [x] **AC-7**: レスポンシブ対応（Given-When-Then 形式）
- [x] **AC-8**: エッジケース - 運用益マイナス（Given-When-Then 形式）
- [x] **AC-9**: エッジケース - 運用益 0円（Given-When-Then 形式）

**総数**: 9個の Acceptance Criteria ✅

---

### 3. テスタビリティ

- [x] **Independent Test が定義**: 具体的な入力値と期待される出力が明記
- [x] **テストシナリオが具体的**:
  - 入力: 毎月3万円、20年間、年利5%
  - 期待結果: 節税額 約104万円、4種類のグラフ表示
- [x] **検証可能な数値**: 税率 20.315% を使った計算結果が検証可能

---

### 4. Definition of Done の完全性

- [x] **機能要件**: 4種類のグラフが正しく表示される
- [x] **計算精度**: 税金計算が正確（20.315%）
- [x] **統合**: React Context でデータ共有
- [x] **UI/UX**: レスポンシブ対応（デスクトップ・モバイル）
- [x] **エッジケース**: 運用益マイナス、0% が正しく処理される
- [x] **デザイン**: 色設定が仕様通り（NISA=緑、税金=赤、元本=青）
- [x] **品質**: ユニットテスト作成
- [x] **ビルド**: `bun run build` 成功
- [x] **コード品質**: ESLint・Prettier 適用

**総数**: 10項目の DoD ✅

---

### 5. 非機能要件

- [x] **パフォーマンス**: 計算速度 < 1秒、グラフ描画 < 500ms、タブ遷移 < 200ms
- [x] **ユーザビリティ**: 1クリックで遷移、色で直感的に理解可能
- [x] **アクセシビリティ**: 色+ラベル+アイコン、キーボードナビゲーション対応
- [x] **ブラウザ対応**: Chrome, Safari, Firefox, Edge 最新版
- [x] **レスポンシブ**: デスクトップ・タブレット・モバイル対応

---

### 6. エッジケースとエラーハンドリング

- [x] **エッジケース**: 4つのケースが定義されている
  - 運用益マイナス
  - 運用益 0円
  - 積立額が非常に大きい
  - 積立期間が短い
- [x] **エラーハンドリング**: 入力エラー、Context 未初期化、グラフ描画エラー
- [x] **バリデーション**: 001 と同じルール（100円以上、1-40年、-10%〜20%）

---

### 7. 技術的実装の明確性

- [x] **新規ファイル**: 5つのファイルが明記されている
  - `app/tax-comparison/page.tsx`
  - `components/TaxSavingsHighlight.tsx`
  - `components/TaxComparisonBarChart.tsx`
  - `components/TaxComparisonLineChart.tsx`
  - `contexts/InvestmentPlanContext.tsx`

- [x] **拡張ファイル**: 3つのファイル拡張が明記されている
  - `lib/calculator.ts` に `calculateTaxComparison()` 追加
  - `lib/types.ts` に `TaxComparisonResult` 型追加
  - `app/layout.tsx` に Context Provider 追加

- [x] **計算ロジック**: TypeScript の型定義が明記されている

---

### 8. 依存関係とリスク

- [x] **依存関係**: 001 の基本機能、Chart.js、React Context API
- [x] **リスク**: 3つのリスクと対策が明記されている
  - グラフが多すぎる → 順序最適化
  - Context 実装が複雑化 → シンプルな設計
  - 税率計算の誤差 → ユニットテスト

---

### 9. 決定事項の記録

- [x] **グラフ順序**: 節税額 → 手取り比較 → 積み上げ → 年次推移
- [x] **データ引継ぎ**: React Context を使用
- [x] **色設定**: NISA=緑、税金=赤、元本=青、運用益=明るい緑
- [x] **統合レベル**: タブとして統合

---

### 10. ドキュメントの完全性

- [x] **Intent ドキュメント**: `requirement-002-nisa-tax-comparison.md` 作成済み
- [x] **User Story**: `story-002-tax-comparison.md` 作成済み
- [x] **計画ドキュメント**: `002-user-stories-plan.md` 作成済み
- [x] **このチェックリスト**: `contract-checklist-002.md` 作成済み

---

## ✅ 最終判定

### すべての項目が満たされています

- ✅ 要件の明確性: 100%
- ✅ Acceptance Criteria: 9個
- ✅ テスタビリティ: 完全
- ✅ Definition of Done: 10項目
- ✅ 非機能要件: 完全
- ✅ エッジケース: 4ケース定義
- ✅ 技術的実装: 明確
- ✅ 依存関係・リスク: 明記
- ✅ 決定事項: 記録済み
- ✅ ドキュメント: 完全

---

## 📝 開発契約として使用可能

このドキュメント一式は、以下の用途で使用できます:

1. **開発チームへの指示**: 実装すべき内容が明確
2. **QA・テストチーム**: Acceptance Criteria と Independent Test で検証可能
3. **プロダクトオーナー**: DoD で完了を判定可能
4. **見積もり**: Technical Notes から工数見積もりが可能
5. **契約書添付資料**: 成果物の定義として使用可能

---

## 🎯 次のステップ

この User Story が承認されたら:

1. **units_plan.md** を実行（ユニット分割）
2. **component_model_plan.md** を実行（コンポーネント設計）
3. **code_generation_plan.md** を実行（コード実装）

---

**作成者**: Claude (AI PM)
**最終更新**: 2025-11-18
**承認状況**: レビュー待ち
