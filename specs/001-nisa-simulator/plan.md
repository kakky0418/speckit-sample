# 実装計画: NISA積立シミュレーター

**Branch**: `001-nisa-simulator` | **Date**: 2025-11-18 | **Spec**: [spec.md](./spec.md)
**入力**: 機能仕様: `/specs/001-nisa-simulator/spec.md`

## サマリー

NISA（少額投資非課税制度）を活用した積立投資の将来シミュレーションを提供する Web アプリケーション。投資初心者が毎月の積立額と期間を入力し、複利計算による将来資産額を確認できる。React + Next.js + bun で構築し、Chart.js によるグラフ表示で視覚的に資産推移を理解できる。完全にステートレスなフロントエンドアプリケーションとして実装し、Vercel で静的ホスティング可能。

## 技術コンテキスト

**Language/Version**: TypeScript 5.x + React 18+ + Next.js 14+
**Primary Dependencies**: Next.js (App Router), Chart.js, react-chartjs-2, Tailwind CSS
**Package Manager**: bun
**Storage**: N/A（完全にステートレス、データ永続化なし）
**Testing**: Jest + React Testing Library（ユニットテスト）、Playwright（E2E テスト）
**Target Platform**: Web ブラウザ（Chrome, Safari, Firefox, Edge 最新版）
**Project Type**: Web アプリケーション（フロントエンドのみ）
**Performance Goals**:
- 計算結果表示 < 1秒
- 初回ページロード < 2秒
- グラフ描画 < 500ms

**Constraints**:
- バックエンド不要（フロントエンドのみで完結）
- ページリロード時にデータリセット（永続化なし）
- レスポンシブデザイン必須（デスクトップ・モバイル両対応）

**Scale/Scope**:
- 1機能（NISA積立シミュレーター）
- 3つのユーザーストーリー（P1: 基本計算、P2: NISA枠表示、P3: シナリオ比較）
- 想定ユーザー数: 制限なし（静的ホスティング）

## 憲法チェック

*ゲート: Phase 0 リサーチ前に確認。Phase 1 設計後に再確認。*

### ✅ I. Specification-First
- spec.md 作成済み（ユーザーストーリー、受入れ基準、機能要件すべて記載）
- Intent セクション記載済み
- **Status**: PASS

### ✅ II. AI-DLC Workflow
- インセプションフェーズ: spec.md 完了
- コンストラクションフェーズ: plan.md（このファイル）を作成中
- **Status**: PASS（進行中）

### ✅ III. Test-Driven Development
- spec.md の Acceptance Scenarios がテスト仕様として使用可能
- Testing フレームワーク選定済み（Jest + React Testing Library）
- **Status**: PASS（テストは tasks.md で定義予定）

### ✅ IV. Independent User Stories
- P1（基本計算）、P2（NISA枠表示）、P3（シナリオ比較）が独立
- P1 のみで MVP として価値提供可能
- **Status**: PASS

### ✅ V. Simplicity & YAGNI
- バックエンド不要、データ永続化なしで最小構成
- 必要な機能のみ実装（スコープ明確）
- 複雑さの正当化不要
- **Status**: PASS

**Constitution Check Result**: ✅ **ALL GATES PASSED** - Phase 0 research に進む

## プロジェクト構造

### ドキュメント（本機能）

```text
specs/001-nisa-simulator/
├── spec.md              # 機能仕様書
├── plan.md              # このファイル（実装計画）
├── research.md          # Phase 0 出力（技術調査）
├── data-model.md        # Phase 1 出力（データモデル）
├── quickstart.md        # Phase 1 出力（クイックスタート）
├── contracts/           # Phase 1 出力（サービス契約）
│   └── calculator_service.md  # 計算ロジックの仕様
└── tasks.md             # Phase 2 出力（/speckit.tasks で作成）
```

### Source Code (repository root)

```text
# Next.js Web アプリケーション構造
/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # ルートレイアウト
│   ├── page.tsx             # トップページ（NISA シミュレーター）
│   └── globals.css          # グローバルスタイル
├── components/              # React コンポーネント
│   ├── SimulatorForm.tsx    # 入力フォーム（左カラム）
│   ├── ResultDisplay.tsx    # 結果表示（右カラム）
│   ├── Chart.tsx            # グラフ表示（Chart.js ラッパー）
│   ├── NisaWarning.tsx      # NISA枠警告
│   └── ScenarioComparison.tsx # シナリオ比較（P3）
├── lib/                     # ユーティリティ・ロジック
│   ├── calculator.ts        # 複利計算ロジック
│   ├── nisaValidator.ts     # NISA枠検証
│   └── types.ts             # TypeScript型定義
├── __tests__/               # テスト
│   ├── unit/                # ユニットテスト
│   │   ├── calculator.test.ts
│   │   └── nisaValidator.test.ts
│   ├── components/          # コンポーネントテスト
│   │   ├── SimulatorForm.test.tsx
│   │   └── ResultDisplay.test.tsx
│   └── e2e/                 # E2Eテスト
│       └── simulator.spec.ts
├── public/                  # 静的ファイル
├── package.json
├── bun.lockb                # bun ロックファイル
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

**Structure Decision**:

Next.js 14 App Router を使用した標準的な Web アプリケーション構造を採用しました。この構造は以下の理由で選択されました：

1. **App Router の活用**: Next.js 14 の最新機能を活用し、React Server Components のメリットを享受（今回はCSRだが将来の拡張性を確保）
2. **明確な責務分離**: コンポーネント（UI）とロジック（lib/）が分離されており、テスト容易性が高い
3. **Simplicity & YAGNI**: バックエンド不要のため、`app/` と `components/` でフロントエンドを構成し、過度な抽象化を避ける
4. **スケーラビリティ**: 将来的な機能追加（iDeCo シミュレーター等）が容易
5. **ベストプラクティス**: Next.js 公式ドキュメントで推奨されるディレクトリ構造

## 複雑性トラッキング

> **Fill ONLY if Constitution Check has violations that must be justified**

Constitution Check で violation なし。このセクションは不要。
