<!--
Sync Impact Report:
Version Change: 1.0.0 → 1.1.0
Modified Principles: N/A
Added Sections:
  - Intent（インテント）を AI-DLC Requirements のインセプションフェーズ成果物に追加（必須化）
Removed Sections: N/A
Templates Status:
  ✅ plan-template.md - Constitution Check gate aligns with principles
  ✅ spec-template.md - Intent セクション追加（mandatory）
  ✅ tasks-template.md - User story organization aligns with Principle IV
  ✅ README.md - プロジェクトレベルの Intent セクション追加
  ✅ specs/001-nisa-simulator/spec.md - Intent セクション追加
Follow-up TODOs: None
-->

# speckit-sample Constitution

## Core Principles

### I. Specification-First

すべての機能開発は仕様書（spec.md）から開始する。仕様書には以下が必須：
- ユーザーストーリーと受入れ基準（Given-When-Then 形式）
- 機能要件（FR-001 形式）
- 成功基準（測定可能な指標）

**理由**: AI-DLC のインセプションフェーズの成果物を確実に作成し、実装前に要件を明確化することで手戻りを防ぐ。

### II. AI-DLC Workflow

開発は AI-DLC の 3 フェーズに従う：
1. **インセプションフェーズ**: spec.md 作成（ユーザーストーリー、受入れ基準、非機能要件）
2. **コンストラクションフェーズ**: plan.md、data-model.md、contracts/ 作成、コード生成、自動テスト実行
3. **オペレーションフェーズ**: デプロイ、運用、テレメトリー分析

**理由**: AI を設計の中核に組み込み、従来数ヶ月かかる開発を数日で完了できる体制を構築する。

### III. Test-Driven Development (NON-NEGOTIABLE)

TDD は非交渉的な必須プラクティス：
1. テスト仕様を作成
2. ユーザーの承認を得る
3. テストを実装（失敗することを確認）
4. 実装してテストをパスさせる
5. リファクタリング

**理由**: Red-Green-Refactor サイクルにより、品質を担保し、リグレッションを防ぐ。受入れ基準がそのままテスト仕様となる。

### IV. Independent User Stories

各ユーザーストーリーは独立して実装・テスト・デプロイ可能でなければならない：
- 優先度（P1、P2、P3...）を明確に付与
- P1 のみで MVP として価値を提供できること
- 依存関係を最小化し、並行開発を可能にする

**理由**: ユニット（作業単位）を小さく保ち、イテレーションを高速化する。各ストーリーが独立しているため、優先度に応じて段階的にデリバリーできる。

### V. Simplicity & YAGNI

シンプルさを最優先し、YAGNI（You Aren't Gonna Need It）原則を適用：
- 必要最小限の実装から始める
- 複雑さは明確な理由がある場合のみ許容（plan.md の「Complexity Tracking」で正当化）
- 過度な抽象化や将来の拡張性のための設計は避ける

**理由**: AI-DLC の高速イテレーションを最大化するため、不要な複雑さを排除する。必要になった時点で追加する方が効率的。

## AI-DLC Requirements

以下は AI-DLC 手法を実践するための必須要件：

### インセプションフェーズの成果物
- **Intent（インテント）**（必須）: 機能の「目的地」を定義（目的、背景、期待される成果、成功した未来の状態）
- **ユーザーストーリー**: Given-When-Then 形式の受入れシナリオ
- **非機能要件**: パフォーマンス、セキュリティ、スケーラビリティ
- **リスク説明**: 想定されるリスクと緩和策
- **測定基準**: 成功を測定可能な指標
- **PRFAQ**（オプション）: プレスリリース形式での機能説明

### コンストラクションフェーズの成果物
- **ドメインモデル**: data-model.md（エンティティ、リレーションシップ）
- **契約定義**: contracts/（サービス間 API 仕様）
- **自動テスト**: 受入れ基準に基づくテストコード
- **実装コード**: src/ 配下のプロダクションコード

### モブエラボレーション
- チーム全員が 1 つの画面を共有して仕様を詰める
- AI が提案し、人間が重要な判断ポイントで意思決定
- リアルタイムでの協働作業を推奨

## Development Workflow

### 新機能追加の流れ
1. **機能ブランチ作成**: `bash .specify/scripts/bash/create-new-feature.sh "機能説明"`
2. **仕様作成**: `/speckit.specify` で spec.md を作成
3. **仕様明確化**: `/speckit.clarify` で曖昧な部分を質問・解消
4. **計画作成**: `/speckit.plan` で plan.md、data-model.md、contracts/ を作成
5. **タスク分解**: `/speckit.tasks` で tasks.md を作成
6. **実装**: `/speckit.implement` でタスクを実行
7. **整合性確認**: `/speckit.analyze` でドキュメント間の一貫性をチェック

### ブランチ戦略
- フィーチャーブランチ: `###-feature-name` 形式（例: 001-nisa-simulator）
- 各ブランチに対応する specs/###-feature-name/ ディレクトリ
- 番号は自動採番（Git ブランチと specs/ ディレクトリから最大値を検出）

### コミットメッセージ
- コメントアウト、コミットメッセージ、テストコードのタイトルは日本語
- 形式: `<type>: <description>` （例: `feat: NISA シミュレーター計算機能を追加`）

## Governance

### 憲法の優先順位
この憲法はすべての開発プラクティスに優先する。憲法に反する実装やプロセスは認めない。

### 修正手順
憲法の修正には以下が必要：
1. 修正提案のドキュメント化
2. チームの承認
3. 影響を受けるテンプレート・ドキュメントの更新計画
4. バージョン番号の更新（セマンティックバージョニング）

### バージョニング
- **MAJOR**: 後方互換性のない原則の削除・再定義
- **MINOR**: 新しい原則・セクションの追加、ガイダンスの大幅な拡張
- **PATCH**: 明確化、文言修正、タイポ修正、非意味的な改善

### コンプライアンス
- すべての PR/レビューで憲法への準拠を検証
- 複雑さは plan.md の「Complexity Tracking」セクションで正当化必須
- ランタイム開発ガイダンスは CLAUDE.md を参照

**Version**: 1.1.0 | **Ratified**: 2025-11-18 | **Last Amended**: 2025-11-18
