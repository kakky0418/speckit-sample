# back_to_the_future

## Intent（インテント）

### 目的
投資初心者が資産形成の具体的なイメージを持ち、安心して投資を始められる金融シミュレーションプラットフォームを提供する。

### 背景
NISA や iDeCo などの非課税制度は投資初心者にとって有益だが、「毎月いくら積み立てると何年後にいくらになるのか」「どの制度を使うべきか」が直感的に分からず、投資を始めるハードルとなっている。複数の金融シミュレーションツールを統合したプラットフォームにより、投資の第一歩を後押しし、長期的な資産形成をサポートする。

### 期待される成果
- **直感的な将来予測**: ユーザーが具体的な数値で将来の資産額をイメージでき、投資計画を立てやすくなる
- **複数シナリオの比較**: 保守的・標準・楽観的な複数のシミュレーションを比較し、リスクとリターンを理解できる
- **制度の最大活用**: NISA、iDeCo、ふるさと納税など、各種非課税制度を最大限活用した計画を立てられる
- **教育的価値**: 複利効果や長期投資の重要性を実感し、金融リテラシーが向上する

### 成功した未来の状態
投資未経験者が「これなら自分にもできそう」と感じ、シミュレーション結果をもとに月 3 万円の積立投資を開始。プラットフォームを通じて資産形成を実践するユーザーが増え、5 年後には累計 100 万人が利用し、平均 500 万円の資産形成に成功している。金融庁や投資信託会社からも「投資教育ツール」として認知され、資産形成の入口として定着している。

### 開発原則
このプロジェクトは `.specify/memory/constitution.md` で定義された 5 つのコア原則に従います：
1. Specification-First
2. AI-DLC Workflow
3. Test-Driven Development (NON-NEGOTIABLE)
4. Independent User Stories
5. Simplicity & YAGNI

---

## プロジェクト構造

```text
back_to_the_future/
├── .specify/              # speckit のコア設定・テンプレート
│   ├── memory/
│   │   └── constitution.md  # プロジェクト開発原則
│   ├── templates/         # 各種テンプレート
│   └── scripts/           # 自動化スクリプト
├── .claude/              # Claude Code のコマンド定義
│   └── commands/         # speckit コマンド
├── specs/                # 各機能の仕様・設計ドキュメント
│   └── ###-feature-name/ # 機能ごとのディレクトリ
│       ├── spec.md       # 機能仕様書
│       ├── plan.md       # 実装計画
│       ├── tasks.md      # タスクリスト
│       ├── data-model.md # データモデル
│       ├── research.md   # 調査結果
│       ├── quickstart.md # クイックスタート
│       └── contracts/    # サービス契約定義
├── src/                  # プロダクションコード
└── tests/                # テストコード
```

---

## 開発ワークフロー

### 新機能追加の流れ

```bash
# 1. 機能ブランチ作成
bash .specify/scripts/bash/create-new-feature.sh "機能説明"

# 2. 仕様作成
/speckit.specify

# 3. 仕様明確化
/speckit.clarify

# 4. 計画作成
/speckit.plan

# 5. タスク分解
/speckit.tasks

# 6. 実装
/speckit.implement

# 7. 整合性確認
/speckit.analyze
```

### AI-DLC の 3 フェーズ

1. **インセプションフェーズ**: spec.md 作成（ユーザーストーリー、受入れ基準、非機能要件）
2. **コンストラクションフェーズ**: plan.md、data-model.md、contracts/ 作成、コード生成、自動テスト実行
3. **オペレーションフェーズ**: デプロイ、運用、テレメトリー分析

---

## 利用可能なコマンド

| コマンド | 説明 |
|---------|------|
| `/speckit.specify` | 機能仕様の作成・更新 |
| `/speckit.clarify` | 仕様の曖昧な部分を特定・質問 |
| `/speckit.plan` | 実装計画の作成 |
| `/speckit.tasks` | タスクリストの生成 |
| `/speckit.implement` | 実装の実行 |
| `/speckit.analyze` | 成果物の一貫性分析 |
| `/speckit.checklist` | カスタムチェックリスト生成 |
| `/speckit.taskstoissues` | タスクを GitHub Issue に変換 |
| `/speckit.constitution` | プロジェクト原則の作成・更新 |

---

## セットアップ

### 前提条件

- **bun** 1.0 以上（推奨）
- または Node.js 18 以上 + npm

### bun のインストール

```bash
# macOS / Linux
curl -fsSL https://bun.sh/install | bash

# インストール確認
bun --version
```

### インストール手順

```bash
# リポジトリのクローン
git clone <repository-url>
cd back_to_the_future

# 依存パッケージのインストール
bun install

# 開発サーバーの起動
bun run dev
```

ブラウザで http://localhost:3000 を開いてください。

### ビルド

```bash
# 本番ビルド
bun run build

# 本番サーバーの起動
bun run start
```

### その他のコマンド

```bash
# Lint チェック
bun run lint

# テスト実行
bun test

# テスト（watch モード）
bun test --watch
```

## 現在の機能

### NISA積立シミュレーター (User Story 1 - MVP)

- ✅ 毎月の積立額、積立期間、想定利回りの入力
- ✅ 複利計算による将来資産額の算出
- ✅ 総資産額、元本合計、運用益の表示
- ✅ NISA投資枠の活用状況表示
- ✅ 入力バリデーションとエラーメッセージ
- ⏳ グラフ表示（実装予定）

### 実装済みのコア機能

- TypeScript による型安全な実装
- Next.js App Router によるモダンなアーキテクチャ
- Tailwind CSS によるレスポンシブデザイン
- クライアントサイド完結（オフライン動作可能）

## 新機能の追加

```bash
# Constitution の確認
cat .specify/memory/constitution.md

# 新機能の作成（例）
bash .specify/scripts/bash/create-new-feature.sh "ユーザー認証機能"
```

---

## ドキュメント

- [Constitution](.specify/memory/constitution.md) - プロジェクト開発原則
- [Development Guidelines](CLAUDE.md) - 開発ガイドライン

---

## ライセンス

[ライセンス情報を追加]
