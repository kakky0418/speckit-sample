# 実装計画: 初回投資額設定機能

**Branch**: `005-initial-investment` | **Date**: 2025-11-19 | **Spec**: [spec.md](./spec.md)
**入力**: 機能仕様: `/specs/005-initial-investment/spec.md`

## サマリー

NISA シミュレーターに初回投資額（一括投資額）の入力機能を追加し、シミュレーション計算に反映させる。既存の InvestmentPlan 型に `initialAmount` フィールドを追加し、計算ロジックを拡張する。UI には新しい入力フィールドを追加し、既存のフォームと統合する。

**技術的アプローチ**: 既存の型定義とコンポーネント構造を活用し、最小限の変更で機能を追加する。データモデルの拡張（Phase 0）→ UI 追加（Phase 1）→ 計算ロジック更新（Phase 2）の順で段階的に実装する。

## 技術コンテキスト

**Language/Version**: TypeScript 5.x + React 19 + Next.js 15.1.3
**Primary Dependencies**: React, Next.js, Chart.js, react-chartjs-2
**Storage**: N/A（クライアントサイド state のみ、永続化なし）
**Testing**: bun test（Jest + React Testing Library）
**Target Platform**: Web（モダンブラウザ）
**Project Type**: Web application（Next.js App Router）
**Performance Goals**: 入力から結果表示まで 3 秒以内
**Constraints**:
- UI の既存レイアウトを維持
- CSS Modules を使用（Tailwind CSS は使用しない）
- バックエンド・データベース不要（フロントエンドのみ）
**Scale/Scope**: 単一機能追加（既存シミュレーターへの拡張）

## 憲法チェック

*ゲート: Phase 0 リサーチ前に確認。Phase 1 設計後に再確認。*

### ✅ I. Specification-First
- [x] spec.md が存在し、ユーザーストーリー（P1, P2, P3）が定義されている
- [x] Given-When-Then 形式の受入れ基準が記載されている
- [x] 機能要件（FR-001〜FR-007）が明確に定義されている
- [x] 測定可能な成功基準（SC-001〜SC-004）が定義されている

**Status**: ✅ PASS

### ✅ II. AI-DLC Workflow
- [x] インセプションフェーズ完了（spec.md 作成済み）
- [x] コンストラクションフェーズ（plan.md, research.md, data-model.md, quickstart.md 作成完了）
- [ ] オペレーションフェーズ（未実施）

**Status**: ✅ PASS（コンストラクションフェーズ Phase 1 完了）

### ✅ III. Test-Driven Development (NON-NEGOTIABLE)
- [x] 受入れ基準がテスト仕様として使用可能な形式で記載されている
- [ ] テスト実装（Phase 2 で実施予定）

**Status**: ✅ PASS（受入れ基準が明確、テスト実装は後続フェーズ）

### ✅ IV. Independent User Stories
- [x] P1（初回投資額の設定とシミュレーション反映）: 入力からシミュレーション結果の反映まで一貫した機能。これだけで MVP として価値を提供可能
- [x] P2（リセット機能）: P1 がなくても手動削除で代替可能。P1 完了後に独立して追加可能なオプション機能

**Status**: ✅ PASS（ユニット分割が適切、P1 のみで完全な価値を提供）

### ✅ V. Simplicity & YAGNI
- [x] 必要最小限の実装（既存の InvestmentPlan 型に 1 フィールド追加）
- [x] 既存の Context API を活用（新規状態管理ライブラリ不要）
- [x] 過度な抽象化なし

**Status**: ✅ PASS（シンプルな拡張アプローチ）

**Overall Gate Status**: ✅ **PASS** - Phase 0 研究に進む準備完了

## プロジェクト構造

### ドキュメント（本機能）

```text
specs/005-initial-investment/
├── spec.md              # Feature specification（作成済み）
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output（これから作成）
├── data-model.md        # Phase 1 output（これから作成）
├── quickstart.md        # Phase 1 output（これから作成）
├── contracts/           # Phase 1 output（N/A - バックエンド API なし）
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── page.tsx                      # メインページ（初回投資額入力フィールドを追加）
├── page.module.css               # メインページのスタイル（変更）
├── layout.tsx                    # 既存レイアウト（変更なし）
├── globals.css                   # グローバルスタイル（変更なし）
├── comparison/                   # 比較ページ（変更なし）
└── tax-comparison/               # 税金比較ページ（変更なし）

components/
├── InvestmentChart.tsx           # グラフコンポーネント（変更の可能性あり）
└── InvestmentChart.module.css    # グラフのスタイル

contexts/
└── InvestmentPlanContext.tsx     # Context API（InvestmentPlan 型の更新が必要）

lib/
├── types.ts                      # 型定義（InvestmentPlan に initialAmount を追加）
└── calculator.ts                 # 計算ロジック（初回投資額を考慮した計算に更新）

__tests__/
├── unit/
│   └── calculator.test.ts        # 計算ロジックのユニットテスト（追加）
└── integration/                  # 統合テスト（必要に応じて追加）
```

**Structure Decision**: 既存の Next.js App Router 構造を維持し、Web アプリケーションとして実装する。バックエンド・API は不要（フロントエンドのみで完結）。

## 複雑性トラッキング

> **Fill ONLY if Constitution Check has violations that must be justified**

この機能には憲法違反がないため、このセクションは空です。

---

## Phase 0: Research & Unknowns Resolution

### Unknowns to Resolve

以下の項目について調査が必要です：

1. **初回投資額の複利計算への影響**
   - 初回投資額も月次積立と同様に年利で運用されるのか？
   - 計算式: 初回投資額も `initialAmount * (1 + annualRate/100)^years` で計算するのか？

2. **グラフ表示の調整**
   - 開始時点（0 ヶ月目）に初回投資額が反映されるようにグラフの X 軸を調整する必要があるか？
   - 既存の InvestmentChart コンポーネントで対応可能か？

3. **バリデーション**
   - 初回投資額の上限値は設定するか？（仕様書では上限なし）
   - 小数点以下の入力を許可するか？

### Research Tasks

Phase 0 の research.md で以下を調査・決定します：

- **Task 1**: 初回投資額を含む複利計算の数式を確認
- **Task 2**: 既存の InvestmentChart コンポーネントの実装を確認し、初回投資額表示に必要な変更を特定
- **Task 3**: 入力バリデーションのルールを確認（既存の monthlyAmount と同じルールを適用）

**Output**: `research.md` にすべての調査結果と決定事項を記載

---

## Phase 1: Design & Contracts

**Prerequisites**: `research.md` 完了

### 1. Data Model (`data-model.md`)

InvestmentPlan 型を拡張し、初回投資額を追加します。

**主要なエンティティ**:
- `InvestmentPlan`: 既存の型に `initialAmount?: number` フィールドを追加

**変更箇所**:
- `lib/types.ts`: InvestmentPlan インターフェースの更新
- `contexts/InvestmentPlanContext.tsx`: デフォルト値の追加

**詳細**: `data-model.md` に記載

### 2. API Contracts (`/contracts/`)

**Status**: N/A

バックエンド API が存在しないため、このフェーズはスキップします。

### 3. Quickstart Guide (`quickstart.md`)

開発者が初回投資額機能を理解し、実装・テストするための手順を記載します。

**内容**:
- 機能概要
- 変更ファイル一覧
- ローカル開発環境のセットアップ
- テスト実行方法

**Output**: `quickstart.md`

### 4. Agent Context Update

```bash
.specify/scripts/bash/update-agent-context.sh claude
```

このスクリプトを実行し、プロジェクトの技術スタック情報を更新します。

---

## Phase 2: Implementation Planning (Tasks Generation)

**Note**: このフェーズは `/speckit.tasks` コマンドで実行されます。`/speckit.plan` はここで終了します。

tasks.md には以下のフェーズが含まれる予定です（参考）:

### P1: 初回投資額の設定とシミュレーション反映

**フェーズ 1: データモデル更新**
- [ ] T001: `lib/types.ts` の InvestmentPlan に `initialAmount` を追加
- [ ] T002: `contexts/InvestmentPlanContext.tsx` の更新

**フェーズ 2: UI 実装**
- [ ] T003: `app/page.tsx` に初回投資額入力フィールドを追加
- [ ] T004: `app/page.module.css` にスタイルを追加
- [ ] T005: バリデーションロジックの追加

**フェーズ 3: 計算ロジック更新**
- [ ] T006: `lib/calculator.ts` の `calculateSimulation` を更新
- [ ] T007: `lib/calculator.ts` の `generateChartData` を更新
- [ ] T008: `lib/calculator.ts` の `calculateTaxComparison` を更新
- [ ] T009: `lib/calculator.ts` の `calculateYearlyTaxComparison` を更新

**フェーズ 4: テスト**
- [ ] T010: `__tests__/unit/calculator.test.ts` にテストケース追加
- [ ] T011: 統合テストの追加（必要に応じて）

### P2: 初回投資額のリセット（オプション）

**フェーズ 5: リセット機能**
- [ ] T012: リセットボタンの UI 追加（P1 完了後に実装可能）

---

## Next Steps

1. ✅ Constitution Check 完了（すべて PASS）
2. 🔄 Phase 0: `research.md` を作成（次のステップ）
3. ⏳ Phase 1: `data-model.md`, `quickstart.md` を作成
4. ⏳ Agent context 更新
5. ⏳ `/speckit.tasks` で tasks.md を生成

**Command completion**: `/speckit.plan` はここで終了します。
