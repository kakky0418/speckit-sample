# コンポーネントモデル設計計画

**プロジェクト**: 001-nisa-simulator
**作成日**: 2025-11-18
**役割**: ソフトウェアエンジニア
**目的**: ユーザーストーリーからコンポーネントモデルを設計

---

## 📋 前提条件

**入力ドキュメント**:
- まだ作成されていない `design/seo_optimization_unit.md` を参照予定
- 実際には `units_plan.md` が承認され、ユニット定義が作成された後に実行

**注意**: このタスクは以下の順序で実行する必要があります:
1. ✅ `user_stories_plan.md` の承認
2. ⏳ ユーザーストーリーの作成
3. ⏳ `units_plan.md` の承認
4. ⏳ ユニット定義の作成
5. ⏳ このコンポーネントモデル設計計画の実行

---

## 🎯 作業計画

### Phase 1: ユニット定義の分析
- [ ] **Step 1.1**: 対象ユニット（例: `unit-01-calculation-engine.md`）を読み込み
- [ ] **Step 1.2**: ユーザーストーリーから必要な機能を抽出
- [ ] **Step 1.3**: 受け入れ基準から詳細要件を抽出
- [ ] **Step 1.4**: 技術制約と非機能要件を確認

> 💡 **ユーザー確認ポイント**: Phase 1 完了後、抽出した要件が正しいか確認をいただきます

---

### Phase 2: コンポーネント識別
- [ ] **Step 2.1**: ドメインモデルの識別（データ構造）
- [ ] **Step 2.2**: サービス層コンポーネントの識別（ビジネスロジック）
- [ ] **Step 2.3**: UI コンポーネントの識別（プレゼンテーション）
- [ ] **Step 2.4**: ユーティリティコンポーネントの識別（補助機能）

> 💡 **ユーザー確認ポイント**: 識別されたコンポーネント一覧が適切か確認をいただきます

---

### Phase 3: コンポーネント詳細設計

#### 3.1: ドメインモデル（データ構造）
- [ ] **Step 3.1.1**: `InvestmentPlan` モデルの設計
  - 属性: monthlyAmount, years, annualRate
  - バリデーションルール
- [ ] **Step 3.1.2**: `SimulationResult` モデルの設計
  - 属性: totalAssets, totalPrincipal, totalProfit, annualInvestment, etc.
  - 計算結果の構造
- [ ] **Step 3.1.3**: `ChartDataPoint` モデルの設計
  - 属性: year, principal, totalAssets
  - グラフデータの構造
- [ ] **Step 3.1.4**: `Scenario` モデルの設計
  - 属性: name, annualRate, result, color
  - 複数シナリオの構造

> 💡 **ユーザー確認ポイント**: ドメインモデルが要件を満たしているか確認をいただきます

---

#### 3.2: サービス層コンポーネント
- [ ] **Step 3.2.1**: `CalculatorService` の設計
  - メソッド: calculateSimulation(plan)
  - 動作: 複利計算、NISA枠計算
  - 入出力: InvestmentPlan → SimulationResult
- [ ] **Step 3.2.2**: `ValidationService` の設計
  - メソッド: validateInvestmentPlan(plan)
  - 動作: 入力値の検証
  - 入出力: InvestmentPlan → ValidationResult
- [ ] **Step 3.2.3**: `ChartDataGenerator` の設計
  - メソッド: generateChartData(plan)
  - 動作: 年ごとのデータポイント生成
  - 入出力: InvestmentPlan → ChartDataPoint[]

> 💡 **ユーザー確認ポイント**: サービス層の責務分離が適切か確認をいただきます

---

#### 3.3: UI コンポーネント
- [ ] **Step 3.3.1**: `InputForm` コンポーネントの設計
  - Props: plan, onChange, onSubmit
  - 状態: フォーム入力値
  - イベント: 入力変更、計算実行
- [ ] **Step 3.3.2**: `ResultDisplay` コンポーネントの設計
  - Props: result
  - 動作: 結果の表示、NISA枠警告
- [ ] **Step 3.3.3**: `InvestmentChart` コンポーネントの設計
  - Props: chartData
  - 動作: Chart.js を使ったグラフ描画
- [ ] **Step 3.3.4**: `ComparisonChart` コンポーネントの設計
  - Props: scenarios
  - 動作: 複数シナリオのグラフ描画

> 💡 **ユーザー確認ポイント**: UI コンポーネントの粒度が適切か確認をいただきます

---

### Phase 4: コンポーネント間の相互作用設計
- [ ] **Step 4.1**: データフロー図の作成
  - ユーザー入力 → ValidationService → CalculatorService → 結果表示
- [ ] **Step 4.2**: イベントフロー図の作成
  - フォーム送信 → 計算実行 → グラフ更新
- [ ] **Step 4.3**: 依存関係図の作成
  - コンポーネント間の依存関係を明示
- [ ] **Step 4.4**: 状態管理戦略の定義
  - React useState での状態管理
  - グローバル状態の必要性検討

> 💡 **ユーザー確認ポイント**: 相互作用の設計が実装可能か確認をいただきます

---

### Phase 5: 非機能要件への対応
- [ ] **Step 5.1**: パフォーマンス要件への対応
  - 計算速度の最適化戦略
  - グラフ描画の最適化
- [ ] **Step 5.2**: エラーハンドリング戦略
  - バリデーションエラー
  - 計算エラー
- [ ] **Step 5.3**: アクセシビリティ対応
  - ARIA ラベル
  - キーボード操作
- [ ] **Step 5.4**: レスポンシブ対応
  - モバイル/デスクトップレイアウト

---

### Phase 6: 最終レビューと文書化
- [ ] **Step 6.1**: コンポーネントモデル全体図の作成
- [ ] **Step 6.2**: 各コンポーネントの詳細仕様を `aidlc-docs/design-artifacts/` に保存
  - `component-model-calculation-engine.md`
  - `component-model-presentation.md`
  - `component-model-visualization.md`
- [ ] **Step 6.3**: インターフェース定義書の作成
- [ ] **Step 6.4**: 実装ガイドラインの作成

> 💡 **ユーザー確認ポイント**: 最終成果物がコード実装に十分な詳細度か確認をいただきます

---

## ⚠️ 重要な決定が必要な箇所

以下の点について、作業中にあなたに確認を求めます:

1. **状態管理の選択**:
   - React useState のみで十分か？
   - Context API や状態管理ライブラリが必要か？

2. **コンポーネントの粒度**:
   - 現在の粒度（InputForm, ResultDisplay など）で適切か？
   - より細かい分割が必要か？

3. **型定義の詳細度**:
   - TypeScript の型定義をどこまで詳細に設計するか？
   - インターフェース vs 型エイリアス

4. **テスタビリティの考慮**:
   - 依存性注入が必要か？
   - モックしやすい設計にするか？

---

## 📝 成果物

作成される成果物:

1. **aidlc-docs/design-artifacts/component-model-calculation-engine.md**
   - CalculatorService, ValidationService の詳細設計
   - ドメインモデル（InvestmentPlan, SimulationResult, etc.）

2. **aidlc-docs/design-artifacts/component-model-presentation.md**
   - InputForm, ResultDisplay, Navigation の詳細設計
   - Props, State, Events の定義

3. **aidlc-docs/design-artifacts/component-model-visualization.md**
   - InvestmentChart, ComparisonChart の詳細設計
   - Chart.js 統合仕様

4. **aidlc-docs/design-artifacts/component-interaction-diagram.md**
   - データフロー図
   - イベントフロー図
   - 依存関係図

5. **aidlc-docs/design-artifacts/implementation-guidelines.md**
   - コーディング規約
   - ファイル構造
   - テスト戦略

---

## 🚫 制約事項

**この段階ではコードを生成しません**

- コンポーネントモデルの設計のみ
- 実装コードは次のフェーズ（code_generation_plan.md）で生成

---

## ✅ 計画レビュー待ち

**⚠️ 注意**: この計画は以下が完了した後に実行されます:
- [ ] `user_stories_plan.md` 承認・実行
- [ ] `units_plan.md` 承認・実行
- [ ] この計画 (`component_model_plan.md`) レビュー待ち

**承認後のプロンプト例**:
```
計画を承認します。作業を進めてください。
各ステップ完了後、計画ファイルのチェックボックスをマークしてください。
```

---

**作成者**: Claude (AI Engineer)
**最終更新**: 2025-11-18
