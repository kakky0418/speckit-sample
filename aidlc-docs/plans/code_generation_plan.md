# コード生成計画

**プロジェクト**: 001-nisa-simulator
**作成日**: 2025-11-18
**役割**: ソフトウェアエンジニア
**目的**: コンポーネント設計から実装コードを生成

---

## 📋 前提条件

**入力ドキュメント**:
- まだ作成されていないコンポーネント設計ドキュメント（例: `component-model-calculation-engine.md`）を参照予定
- 実際には `component_model_plan.md` が承認され、コンポーネントモデルが作成された後に実行

**注意**: このタスクは以下の順序で実行する必要があります:
1. ✅ `user_stories_plan.md` の承認・実行
2. ⏳ `units_plan.md` の承認・実行
3. ⏳ `component_model_plan.md` の承認・実行
4. ⏳ このコード生成計画の実行

---

## 🎯 作業計画

### Phase 1: コンポーネント設計の確認
- [ ] **Step 1.1**: すべてのコンポーネント設計ドキュメントを読み込み
  - `component-model-calculation-engine.md`
  - `component-model-presentation.md`
  - `component-model-visualization.md`
- [ ] **Step 1.2**: インターフェース定義を確認
- [ ] **Step 1.3**: 依存関係を確認
- [ ] **Step 1.4**: 技術スタックと制約を確認

> 💡 **ユーザー確認ポイント**: 設計の理解が正しいか確認をいただきます

---

### Phase 2: 実装優先順位の決定
- [ ] **Step 2.1**: 依存関係に基づいて実装順序を決定
- [ ] **Step 2.2**: MVP に必要なコンポーネントを特定
- [ ] **Step 2.3**: 段階的実装計画を作成

> 💡 **ユーザー確認ポイント**: 実装順序が適切か確認をいただきます

**推奨実装順序**:
1. ドメインモデル（types.ts）
2. 定数・ユーティリティ（constants.ts, formatters.ts）
3. サービス層（calculator.ts, validation.ts）
4. UI コンポーネント（InputForm, ResultDisplay, Chart）
5. ページ統合（page.tsx, comparison/page.tsx）

---

### Phase 3: ドメインモデルとユーティリティの実装

#### 3.1: 型定義の生成
- [ ] **Step 3.1.1**: `lib/types.ts` を生成
  - InvestmentPlan, SimulationResult, ChartDataPoint, Scenario, ValidationResult
  - シンプルで直感的な実装
  - TypeScript の型安全性を活用

> 💡 **ユーザー確認ポイント**: 型定義が設計通りか確認をいただきます

---

#### 3.2: 定数の生成
- [ ] **Step 3.2.1**: `lib/constants.ts` を生成
  - NISA_LIMITS, INPUT_CONSTRAINTS
  - 設計で定義された定数値を使用

---

#### 3.3: ユーティリティの生成
- [ ] **Step 3.3.1**: `lib/formatters.ts` を生成
  - 通貨フォーマット、数値フォーマット
  - Intl.NumberFormat を活用

---

### Phase 4: サービス層の実装

#### 4.1: 計算サービスの生成
- [ ] **Step 4.1.1**: `lib/calculator.ts` を生成
  - calculateSimulation(plan) メソッド
  - generateChartData(plan) メソッド
  - calculateMultipleScenarios(plan, scenarios) メソッド
  - シンプルで直感的な実装
  - 複利計算の正確性を重視

> 💡 **ユーザー確認ポイント**: 計算ロジックが要件を満たしているか確認をいただきます

---

#### 4.2: バリデーションサービスの生成
- [ ] **Step 4.2.1**: `lib/validation.ts` を生成
  - validateInvestmentPlan(plan) メソッド
  - 個別バリデーション関数（validateMonthlyAmount, validateYears, validateAnnualRate）
  - エラーメッセージの明確性

---

### Phase 5: UI コンポーネントの実装

#### 5.1: グラフコンポーネントの生成
- [ ] **Step 5.1.1**: `components/InvestmentChart.tsx` を生成
  - Chart.js を使った折れ線グラフ
  - 元本と総資産額の 2 本線表示
  - レスポンシブ対応

> 💡 **ユーザー確認ポイント**: グラフコンポーネントが設計通りか確認をいただきます

---

#### 5.2: 比較グラフコンポーネントの生成
- [ ] **Step 5.2.1**: `components/ComparisonChart.tsx` を生成
  - 複数シナリオの同時表示
  - 色分け、凡例付き

---

### Phase 6: ページコンポーネントの実装

#### 6.1: メインページの生成
- [ ] **Step 6.1.1**: `app/page.tsx` を生成
  - "use client" ディレクティブ
  - React useState での状態管理
  - InputForm, ResultDisplay, InvestmentChart の統合
  - 2カラムレスポンシブレイアウト

> 💡 **ユーザー確認ポイント**: メインページが要件を満たしているか確認をいただきます

---

#### 6.2: 比較ページの生成
- [ ] **Step 6.2.1**: `app/comparison/page.tsx` を生成
  - シナリオ設定 UI
  - ComparisonChart の統合
  - ナビゲーションリンク

---

### Phase 7: テストコードの生成

#### 7.1: ユニットテストの生成
- [ ] **Step 7.1.1**: `__tests__/unit/calculator.test.ts` を生成
  - calculateSimulation のテスト
  - generateChartData のテスト
  - calculateMultipleScenarios のテスト
  - エッジケーステスト

> 💡 **ユーザー確認ポイント**: テストカバレッジが十分か確認をいただきます

---

#### 7.2: バリデーションテストの生成
- [ ] **Step 7.2.1**: `__tests__/unit/validation.test.ts` を生成
  - validateInvestmentPlan のテスト
  - 境界値テスト
  - エラーメッセージの検証

---

### Phase 8: ビルドと検証

#### 8.1: ビルド検証
- [ ] **Step 8.1.1**: `bun run build` を実行
- [ ] **Step 8.1.2**: ビルドエラーを修正
- [ ] **Step 8.1.3**: 型エラーを修正

---

#### 8.2: テスト実行
- [ ] **Step 8.2.1**: `bun test` を実行
- [ ] **Step 8.2.2**: テスト失敗を修正
- [ ] **Step 8.2.3**: カバレッジを確認

---

#### 8.3: 品質チェック
- [ ] **Step 8.3.1**: ESLint を実行
- [ ] **Step 8.3.2**: コードフォーマットを実行
- [ ] **Step 8.3.3**: 最終レビュー

> 💡 **ユーザー確認ポイント**: 生成されたコードが本番環境に使用可能か確認をいただきます

---

### Phase 9: ドキュメント生成
- [ ] **Step 9.1**: README.md の更新（セットアップ手順）
- [ ] **Step 9.2**: API ドキュメントの生成（主要関数の説明）
- [ ] **Step 9.3**: コンポーネント使用例の作成
- [ ] **Step 9.4**: デプロイガイドの作成

---

## ⚠️ 重要な決定が必要な箇所

以下の点について、作業中にあなたに確認を求めます:

1. **実装の詳細度**:
   - すべてのコンポーネントを一度に生成するか？
   - 段階的に生成してレビューするか？

2. **エラーハンドリングの範囲**:
   - try-catch をどこまで実装するか？
   - エラーバウンダリーが必要か？

3. **最適化のタイミング**:
   - 初期実装で最適化も含めるか？
   - まず動作するコードを優先するか？

4. **テストの範囲**:
   - ユニットテストのみか？
   - E2E テストも生成するか？

---

## 📝 成果物

作成されるファイル:

### ドメイン層
1. `lib/types.ts`
2. `lib/constants.ts`
3. `lib/formatters.ts`

### サービス層
4. `lib/calculator.ts`
5. `lib/validation.ts`

### UI コンポーネント
6. `components/InvestmentChart.tsx`
7. `components/ComparisonChart.tsx`

### ページ
8. `app/page.tsx`
9. `app/comparison/page.tsx`

### テスト
10. `__tests__/unit/calculator.test.ts`
11. `__tests__/unit/validation.test.ts`

### ドキュメント
12. `README.md`（更新）
13. `aidlc-docs/design-artifacts/api-documentation.md`

---

## 🎯 実装要件

### コード品質基準
- **シンプルさ**: 複雑な抽象化を避け、直感的なコード
- **型安全性**: TypeScript の型を最大限活用
- **テスタビリティ**: 単体テスト可能な設計
- **可読性**: 明確な命名、適切なコメント
- **パフォーマンス**: 計算速度、描画速度の最適化

### コーディング規約
- ESLint + Prettier に準拠
- React Hooks のベストプラクティス
- Next.js App Router の規約
- 日本語コメント（技術用語は英語）

---

## ✅ 計画レビュー待ち

**⚠️ 注意**: この計画は以下が完了した後に実行されます:
- [ ] `user_stories_plan.md` 承認・実行
- [ ] `units_plan.md` 承認・実行
- [ ] `component_model_plan.md` 承認・実行
- [ ] この計画 (`code_generation_plan.md`) レビュー待ち

**承認後のプロンプト例**:
```
計画を承認します。作業を進めてください。
各ステップ完了後、計画ファイルのチェックボックスをマークしてください。
```

---

**作成者**: Claude (AI Engineer)
**最終更新**: 2025-11-18
