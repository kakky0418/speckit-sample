# speckit-sample Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-11-17

## Active Technologies
- TypeScript 5.x + React 19 + Next.js 15.1.3 + React, Next.js, Chart.js, react-chartjs-2 (005-initial-investment)
- N/A（クライアントサイド state のみ、永続化なし） (005-initial-investment)

- (001-nisa-simulator)

## Project Structure

```text
src/
tests/
```

## Commands

# Add commands for

## Code Style

: Follow standard conventions

## Recent Changes
- 005-initial-investment: Added TypeScript 5.x + React 19 + Next.js 15.1.3 + React, Next.js, Chart.js, react-chartjs-2

- 001-nisa-simulator: Added

<!-- MANUAL ADDITIONS START -->

## AI-DLC ワークフロー

このプロジェクトは AI-DLC（AI駆動開発ライフサイクル）に従って開発します。

### プロンプト履歴の管理

**ディレクトリ構造**:
```
specs/00x-feature/
├── spec.md, plan.md, tasks.md    # 仕様・計画
└── prompt/
    ├── prompts.md                 # チーム共有用（Git管理）
    └── prompt_histories.md        # 個人作業継続用（.gitignore）
```

#### 1. prompt/prompts.md（チーム共有用）
- **目的**: 他の開発者が作業を引き継げるようにする
- **粒度**: セッションごとの要約（何をしたか、なぜそうしたか、成果物、次のステップ）
- **Git管理**: する

#### 2. prompt/prompt_histories.md（個人作業継続用）
- **目的**: 同じユーザーが別LLM・別セッションでも作業を継続できるようにする
- **粒度**: 全ての会話履歴を詳細に記録
- **Git管理**: しない（.gitignore に追加済み）

**記録タイミング**:
- 各セッション終了時
- 重要な決定をした直後
- フェーズ切り替え時（インセプション→コンストラクション）

**ファイルが大きくなりすぎた場合**:

単一ファイルが 5 セッション以上または 1000 行を超えた場合、以下のようにディレクトリに分割することを推奨：

```
prompt/
├── prompts.md                    # 要約（継続して単一ファイル）
└── prompt_histories/             # 詳細履歴をセッション別に分割
    ├── 2025-11-21_session1.md    # セッション 1
    ├── 2025-11-21_session2.md    # セッション 2
    └── 2025-11-22_session3.md    # セッション 3
```

**注意**: 分割後も `.gitignore` に `prompt/prompt_histories/` を追加すること

### LLM 切り替え時の手順

**異なる AI ツール間の引き継ぎ**:

1. **現在のセッション終了時**（例：Claude Code, Cursor, Gemini など）
   - `prompt/prompts.md` にセッション要約を記録
   - `prompt/prompt_histories.md` に完全な会話履歴を記録

2. **新しい AI ツールでの作業開始時**（例：Codex, GitHub Copilot, Cursor など）
   - 以下のドキュメントを読み込み：
     - `@specs/XXX/spec.md, plan.md, tasks.md`（必読）
     - `@specs/XXX/prompt/prompts.md`（必読）
     - `@specs/XXX/prompt/prompt_histories.md`（詳細が必要な場合）

**活用例**:
- 仕様作成: Claude Code → 実装: Cursor
- 設計: Gemini → 実装: Codex
- 実装: GitHub Copilot → レビュー: Claude Code

### セットアップ指示テンプレート

新規セッション開始時に AI に以下を指示：

```markdown
ドキュメントの保存先：
- 仕様・計画 → specs/XXX/spec.md, plan.md, tasks.md
- プロンプト履歴 → specs/XXX/prompt/

2種類のプロンプト履歴を記録：
1. prompt/prompts.md（要約・チーム共有・Git管理）
2. prompt/prompt_histories.md（詳細・個人用・.gitignore）

このルールを理解したら確認してください。
```

<!-- MANUAL ADDITIONS END -->
