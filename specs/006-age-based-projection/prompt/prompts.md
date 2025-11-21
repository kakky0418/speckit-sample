# プロンプト履歴（要約）: 006-age-based-projection

**目的**: チーム共有用のセッション要約
**Git 管理**: あり

---

## セッション 1: 仕様作成（2025-11-21）

**実施内容**: `/speckit.specify` で仕様書を作成

**やったこと**:
- 機能名の短縮名を生成: `age-based-projection`
- 既存のブランチとディレクトリをチェック（001, 002, 003, 005 が存在）
- 番号 006 で新規ブランチとディレクトリを作成
- 仕様書 `spec.md` を作成
- 品質チェックリスト `checklists/requirements.md` を作成して検証

**なぜそうしたか**:
- ユーザーの要望「年齢を入力して何歳のときにいくらになるかの指標を追加」を具体的な仕様に落とし込む
- AI-DLC のインセプションフェーズ成果物を作成
- 既存の NISA シミュレーターの文脈を理解し、一貫性のある仕様を策定

**成果物**:
- `specs/006-age-based-projection/spec.md` - 年齢ベース資産予測機能の仕様書
  - 3 つの優先度付きユーザーストーリー（P1: 基本機能、P2: マイルストーン、P3: 逆算）
  - 10 個の機能要件（FR-001〜FR-010）
  - 5 つの成功基準（SC-001〜SC-005）
- `specs/006-age-based-projection/checklists/requirements.md` - 品質チェックリスト（全項目合格）

**次のステップ**: `/speckit.plan` で技術計画を作成

---

## セッション 2: 実装計画作成（2025-11-21）

**実施内容**: `/speckit.plan` で実装計画を作成

**やったこと**:
- セットアップスクリプト実行で `plan.md` テンプレートを取得
- 仕様書、憲法、既存コードを読み込み
- Technical Context と Constitution Check を記入
- Phase 0: リサーチを実施（8 つの技術的意思決定）
- Phase 1: データモデル、契約定義、クイックスタートを作成
- エージェントコンテキストを更新（CLAUDE.md）

**なぜそうしたか**:
- AI-DLC のコンストラクションフェーズ成果物を作成
- 既存のプロジェクト構造（React 19 + Next.js 15 + Chart.js）を理解
- 後方互換性を維持しながら最小限の変更で年齢機能を追加する設計
- 憲法の Simplicity & YAGNI 原則に従い、新規ライブラリの導入を避ける

**成果物**:
- `specs/006-age-based-projection/plan.md` - 実装計画書
  - Technical Context: TypeScript 5.x, React 19, Next.js 15.1.3, Chart.js
  - Constitution Check: すべての原則に準拠（違反なし）
  - Project Structure: 既存構造を維持、新規ファイルは最小限
- `specs/006-age-based-projection/research.md` - リサーチ結果
  - 8 つの技術的意思決定（データモデル拡張、State 管理、グラフ X 軸切り替えなど）
- `specs/006-age-based-projection/data-model.md` - データモデル
  - InvestmentPlan に `currentAge?: number` を追加（オプション）
  - 新規エンティティ: Milestone（P2）、ReverseCalculation（P3）
- `specs/006-age-based-projection/contracts/` - 型定義契約
  - `types.ts`: TypeScript インターフェース定義
  - `README.md`: 契約の説明
- `specs/006-age-based-projection/quickstart.md` - 実装ガイド
  - 優先度別実装順序（P1→P2→P3）
  - TDD サイクルの手順
  - トラブルシューティング

**重要な設計判断**:
1. **既存コンポーネント拡張**: 新規ライブラリ不要、Chart.js をそのまま活用
2. **後方互換性**: 年齢フィールドはすべてオプション、未入力時は従来通り動作
3. **段階的リリース**: P1（MVP）→ P2 → P3 で独立してリリース可能
4. **TDD 厳守**: 実装前に必ずテストを書く（憲法の非交渉的ルール）

**次のステップ**: `/speckit.tasks` でタスク分解

---

## 主要な技術的意思決定の理由

### 1. なぜ年齢フィールドをオプションにしたか
- **後方互換性**: 既存ユーザーが年齢を入力しなくても従来通り使える
- **段階的採用**: ユーザーが必要に応じて年齢機能を使い始められる

### 2. なぜ Context API や Redux を導入しなかったか
- **Simplicity 原則**: 小規模アプリケーションには過剰
- **既存パターン維持**: props drilling パターンで十分
- **YAGNI 原則**: 今必要ない機能は追加しない

### 3. なぜグラフコンポーネントを新規作成せず既存を拡張したか
- **コードの重複回避**: 既存のグラフロジックを再利用
- **保守性**: 1 つのコンポーネントで管理する方が変更が容易
- **条件分岐のシンプルさ**: X 軸ラベル生成を三項演算子で切り替えるだけ

---

## チームへの引き継ぎ事項

### 実装前の重要事項
1. **TDD 厳守**: テストを先に書くこと（Red-Green-Refactor サイクル）
2. **既存テスト確認**: 年齢機能追加後も既存テストが通ることを確認
3. **段階的リリース**: P1 のみを先にリリースし、ユーザーフィードバックを収集

### 実装時の注意点
1. `InvestmentPlan` に `currentAge?: number` を追加（`lib/types.ts`）
2. `validateAge` 関数を追加（`lib/validation.ts`）
3. `InvestmentChart.tsx` の X 軸ラベル生成を条件分岐で切り替え
4. 年齢が未入力の場合、従来の期間ベース表示を維持

### デプロイ戦略
- **Phase 1**: P1 のみリリース（MVP）
- **Phase 2**: P2 追加（マイルストーン表示）
- **Phase 3**: P3 追加（逆算機能）

---

## セッション 3: タスク分解（2025-11-21）

**実施内容**: `/speckit.tasks` でタスク分解を実行

**やったこと**:
- 前提条件チェックスクリプトで利用可能なドキュメントを確認
- plan.md, spec.md, data-model.md, quickstart.md を読み込み
- ユーザーストーリー別にタスクを生成（P1, P2, P3）
- TDD アプローチでテストタスクを含める（憲法の非交渉的ルール）
- 依存関係グラフと並行実行例を作成

**なぜそうしたか**:
- 各ユーザーストーリーを独立して実装・テスト・デプロイ可能にする
- TDD サイクル（Red-Green-Refactor）を実践するためテストタスクを先に配置
- 複数開発者での並行作業を可能にする
- MVP 優先の実装戦略を明確化

**成果物**:
- `specs/006-age-based-projection/tasks.md` - 55 タスクの詳細な分解
  - Phase 1: Setup（5 タスク）
  - Phase 2: Foundational（3 タスク）- ブロッキング
  - Phase 3: User Story 1 - P1（17 タスク：10 テスト + 7 実装）🎯 MVP
  - Phase 4: User Story 2 - P2（9 タスク：5 テスト + 4 実装）
  - Phase 5: User Story 3 - P3（13 タスク：8 テスト + 5 実装）
  - Phase 6: Polish（8 タスク）
  - 並行実行可能タスク: 31 個（[P] マーク付き）

**タスク構成**:
- テストタスク: 23（42%）- TDD アプローチ
- 実装タスク: 24（44%）
- インフラタスク: 8（14%）

**並行実行戦略**:
- 3 開発者で並行作業可能（Phase 2 完了後、US1, US2, US3 を同時実装）
- タイムライン: 1-2 週間（逐次実行なら 3 週間）

**MVP スコープ**:
- Phase 1-3（25 タスク）で User Story 1（P1）を完成させ、最小限の価値を提供
- その後、Phase 4-5 でP2, P3 を追加

**次のステップ**: `/speckit.implement` で実装開始

---

## セッション 4: 実装・e2e 追加（2025-11-21）

**実施内容**: US1〜US3 実装とテスト、Polish の主要項目、e2e 自動化を実施

**やったこと**:
- 年齢入力・マイルストーン・逆算モードを実装し、結果表示/グラフの年齢切替を対応
- ageUtils を本実装（calculateFutureAge, generateMilestones, calculateRequiredMonthlyAmount）、コンポーネント分割 (InputForm, ResultDisplay, Milestone, ReverseCalculator)
- Playwright 導入で e2e シナリオ自動化（年齢表示、マイルストーン、逆算、警告、結果&グラフ 1 秒以内計測）
- ESLint を静的設定化（.eslintrc.json）、`outputFileTracingRoot` を next.config.js に追加してルート警告を抑制
- README に年齢ベース資産予測の使い方を追記、レスポンシブ/アクセシビリティ調整（InputForm ラベル htmlFor/id など）

**テスト**:
- `bun test __tests__` すべて pass
- `bunx playwright test --config=playwright.config.ts --project=chromium e2e/age-based-projection.spec.ts` すべて pass
- `bun lint`（対話なしで完了）

**成果物**:
- `lib/ageUtils.ts`（逆算ロジックを含む）
- 新規コンポーネント/スタイル: ReverseCalculator*, Milestone*, 年齢対応した InputForm/ResultDisplay/InvestmentChart
- `e2e/age-based-projection.spec.ts`、`playwright.config.ts`
- `.eslintrc.json`、README 追記

**次のステップ**:
- 必要なら CI に Playwright を組み込み（ブラウザキャッシュ手順を追加）
- 逆算モード/年齢表示を手動でもう一度確認し、リリース判断へ進む
