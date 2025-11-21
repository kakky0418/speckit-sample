# 実装計画: 年齢ベース資産予測機能

**Branch**: `006-age-based-projection` | **Date**: 2025-11-21 | **Spec**: [spec.md](spec.md)
**入力**: 機能仕様: `/specs/006-age-based-projection/spec.md`

## サマリー

NISA シミュレーターに年齢入力機能を追加し、「何歳のときにいくらになるか」をライフプランの視点で可視化する。既存の期間ベース表示と並行して年齢ベース表示を提供し、グラフの X 軸を動的に切り替える。マイルストーン表示（節目の年齢での資産額強調）と、目標年齢からの逆算機能も含む。

技術的アプローチ：既存の React コンポーネントを拡張し、年齢情報を state に追加。グラフコンポーネントの X 軸ラベル生成ロジックを条件分岐で切り替え。計算ロジックは既存の複利計算を活用し、結果表示時に年齢情報を併記する形で実装。

## 技術コンテキスト

**Language/Version**: TypeScript 5.x
**Primary Dependencies**: React 19, Next.js 15.1.3, Chart.js 4.4.0, react-chartjs-2 5.2.0
**Storage**: なし（クライアントサイド state のみ、永続化なし）
**Testing**: Jest 29.7.0 + React Testing Library 16.1.0
**Target Platform**: Web アプリケーション（ブラウザベース）、デスクトップ・モバイル両対応
**Project Type**: Web（フロントエンドのみ、バックエンドなし）
**Performance Goals**: 計算結果表示 1 秒以内、グラフ描画 1 秒以内
**Constraints**: クライアントサイドレンダリング（CSR）のみ、データ永続化なし、ステートレス
**Scale/Scope**: 単一ページアプリケーション、既存機能への機能追加

## 憲法チェック

*ゲート: Phase 0 リサーチ前に確認。Phase 1 設計後に再確認。*

### ✅ I. Specification-First
- [x] spec.md 作成済み
- [x] ユーザーストーリー定義済み（P1, P2, P3）
- [x] Given-When-Then 形式の受入れ基準あり
- [x] 機能要件（FR-001〜FR-010）定義済み
- [x] 成功基準（SC-001〜SC-005）測定可能

### ✅ II. AI-DLC Workflow
- [x] インセプションフェーズ完了（spec.md）
- [x] コンストラクションフェーズ完了（plan.md, research.md, data-model.md, contracts/, quickstart.md）
- [ ] オペレーションフェーズ未実施（実装後に実施）

### ✅ III. Test-Driven Development
- [x] テスト仕様作成済み（quickstart.md に記載）
- [x] TDD サイクル定義済み（Red-Green-Refactor）
- [x] テストファイル構造定義済み（data-model.md, quickstart.md）

**NOTE**: 実装前に必ずテストを先に書くこと。TDD は非交渉的なルール。

### ✅ IV. Independent User Stories
- [x] P1: 現在の年齢入力と年齢ベース表示（MVP として独立）
- [x] P2: 節目の年齢でのマイルストーン表示（P1 完了後に独立実装可能）
- [x] P3: 目標年齢での資産額逆算機能（P1, P2 なしでも独立実装可能）
- [x] 依存関係最小化済み

### ✅ V. Simplicity & YAGNI
- [x] 必要最小限の実装（既存コンポーネント拡張、新規ライブラリ不要）
- [x] 過度な抽象化なし（年齢情報を state に追加し、条件分岐で表示切り替え）
- [x] 後方互換性維持（年齢未入力時は既存の期間ベース表示を継続）

### 🚨 Violations
なし。すべての原則に準拠しています。

## プロジェクト構造

### ドキュメント（本機能）

```text
specs/006-age-based-projection/
├── spec.md              # 仕様書（完成済み）
├── plan.md              # 本ファイル（作成中）
├── research.md          # Phase 0 リサーチ結果（これから作成）
├── data-model.md        # Phase 1 データモデル（これから作成）
├── quickstart.md        # Phase 1 クイックスタート（これから作成）
├── contracts/           # Phase 1 契約定義（これから作成、フロントエンドのみのため API 契約なし）
└── tasks.md             # Phase 2 タスク分解（/speckit.tasks で作成）
```

### Source Code (repository root)

既存プロジェクトの構造に従い、以下のディレクトリに実装を追加します:

```text
app/                     # Next.js App Router（ページコンポーネント）
├── page.tsx             # メインページ（年齢入力欄を追加）
├── layout.tsx           # ルートレイアウト
└── globals.css          # グローバルスタイル

components/              # React コンポーネント
├── NisaSimulator.tsx    # メインシミュレーターコンポーネント（年齢 state 追加）
├── InputForm.tsx        # 入力フォーム（年齢入力欄追加）
├── ResultDisplay.tsx    # 結果表示（年齢ベース表示追加）
├── Chart.tsx            # グラフコンポーネント（X 軸の年齢/期間切り替え）
├── Milestone.tsx        # 【新規】マイルストーン表示コンポーネント（P2）
└── ReverseCalculator.tsx # 【新規】逆算機能コンポーネント（P3）

lib/                     # ビジネスロジック・ユーティリティ
├── calculator.ts        # 複利計算ロジック（既存、年齢計算を追加）
├── formatter.ts         # 数値フォーマッター（既存）
└── ageUtils.ts          # 【新規】年齢関連ユーティリティ

__tests__/               # テストコード
├── components/          # コンポーネントテスト
│   ├── NisaSimulator.test.tsx
│   ├── InputForm.test.tsx
│   ├── ResultDisplay.test.tsx
│   ├── Chart.test.tsx
│   ├── Milestone.test.tsx      # 【新規】P2 用テスト
│   └── ReverseCalculator.test.tsx # 【新規】P3 用テスト
└── lib/                 # ロジックテスト
    ├── calculator.test.ts
    └── ageUtils.test.ts        # 【新規】年齢ユーティリティテスト
```

**Structure Decision**: 既存の Next.js プロジェクト構造（app/ + components/ + lib/）を維持し、年齢機能を既存コンポーネントに組み込む形で実装します。フロントエンドのみのプロジェクトのため、backend/ ディレクトリは不要です。

## 複雑性トラッキング

**該当なし**

すべての憲法原則に準拠しており、複雑さの正当化は不要です。既存の単純なフロントエンドアーキテクチャを維持し、新規ライブラリの追加もありません。
