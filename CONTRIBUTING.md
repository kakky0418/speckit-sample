# Contributing Guide

NISA シミュレータープロジェクトへの貢献ガイドです。

## 📋 開発ワークフロー

### 新機能の実装フロー

#### 1. 実装開始時

1. **仕様ディレクトリを作成**
   ```bash
   mkdir -p specs/XXX-feature-name
   ```

2. **spec.md を作成**
   - 機能の目的、ユーザーストーリー、要件を記載

3. **tasks.md を作成**
   - すべてのタスクを `[ ]` で記載
   - フェーズごとに整理
   ```markdown
   ## フェーズ 1: 基盤構築
   - [ ] T001: ○○を実装
   - [ ] T002: △△を実装
   ```

4. **tasks.md をコミット**
   ```bash
   git add specs/XXX-feature-name/tasks.md
   git commit -m "docs(XXX): タスクリストを作成"
   ```

#### 2. 各タスク実装時

1. **コードを実装**
   - 機能を実装
   - 必要に応じてテストを追加

2. **tasks.md を更新**
   - 該当タスクを `[ ]` → `[x]` に変更
   ```markdown
   - [x] T001: ○○を実装  # ← チェックを入れる
   - [ ] T002: △△を実装
   ```

3. **コードと tasks.md を一緒にコミット**
   ```bash
   git add <実装ファイル> specs/XXX-feature-name/tasks.md
   git commit -m "feat(XXX): ○○を実装"
   ```

#### 3. フェーズ完了時

- フェーズごとに区切りの良いところで、まとめてレビュー・テストを実施

#### メリット

✅ **リアルタイムで進捗が記録される**
✅ **別セッションでも進捗が一目瞭然**
✅ **Git 履歴で「いつ何が完了したか」がわかる**
✅ **チーム開発でも進捗共有が容易**

---

## 🎯 コミットメッセージ規約

### Conventional Commits

このプロジェクトは [Conventional Commits](https://www.conventionalcommits.org/) に準拠します。

#### 形式

```
<type>[optional scope]: <description>

[optional body]
```

#### Type（種類）

- **feat**: 新機能
- **fix**: バグ修正
- **docs**: ドキュメントのみの変更
- **style**: コードフォーマット（機能に影響しない変更）
- **refactor**: リファクタリング
- **perf**: パフォーマンス改善
- **test**: テストの追加・修正
- **chore**: ビルドプロセスやツールの変更

#### Scope（スコープ）

機能番号を使用：
- `(001)`: 基本シミュレーター
- `(002)`: 税金比較機能
- `(003)`: CSS Modules リファクタリング

#### 例

```bash
# 新機能の追加
git commit -m "feat(002): 節税額表示コンポーネントを実装"

# バグ修正
git commit -m "fix(001): NISA 枠計算のバグを修正"

# ドキュメント
git commit -m "docs(002): タスクリストを更新"

# テスト
git commit -m "test(002): 税金計算ロジックのテストを追加"
```

#### コミットメッセージの言語

- **日本語**を使用（プロジェクトの既存コミットに合わせる）
- 技術用語は英語のまま使用可能

---

## 📂 プロジェクト構造

```
.
├── app/                      # Next.js App Router
│   ├── page.tsx             # トップページ（基本シミュレーター）
│   ├── comparison/          # シナリオ比較
│   ├── tax-comparison/      # 税金比較
│   └── layout.tsx           # ルートレイアウト
├── components/              # React コンポーネント
│   ├── *.tsx                # コンポーネント
│   └── *.module.css         # CSS Modules（1:1 対応）
├── lib/                     # ビジネスロジック・ユーティリティ
│   ├── types.ts             # TypeScript 型定義
│   ├── calculator.ts        # 計算ロジック
│   ├── validation.ts        # バリデーション
│   ├── constants.ts         # 定数
│   └── formatters.ts        # フォーマッター
├── contexts/                # React Context API
│   └── InvestmentPlanContext.tsx
├── __tests__/               # テスト
│   ├── unit/                # ユニットテスト
│   └── integration/         # 統合テスト
├── specs/                   # 機能仕様
│   ├── 001-nisa-simulator/
│   │   ├── spec.md          # 仕様書
│   │   └── tasks.md         # タスクリスト
│   └── 002-nisa-tax-comparison/
│       ├── spec.md
│       └── tasks.md
├── CLAUDE.md                # AI エージェント向けガイドライン
└── CONTRIBUTING.md          # このファイル
```

### ファイル命名規則

- **TypeScript/JavaScript**: camelCase（例: `calculateTaxComparison.ts`）
- **React コンポーネント**: PascalCase（例: `TaxSavingsHighlight.tsx`）
- **CSS Modules**: `*.module.css`（コンポーネントと 1:1 対応）
- **テスト**: `*.test.ts` または `*.test.tsx`

---

## 🧪 テスト

### テストの実行

```bash
# すべてのテストを実行
bun test

# Watch モード
bun test --watch
```

### テストの作成ルール

1. **ユニットテスト必須**
   - `lib/` 内の関数は必ずユニットテストを作成
   - `__tests__/unit/` に配置

2. **テストケースの命名**
   - 日本語で記述（プロジェクトの既存テストに合わせる）
   - 「〜すること」の形式
   ```typescript
   test('基本的な複利計算が正しく行われること', () => {
     // ...
   });
   ```

3. **カバレッジ目標**
   - ビジネスロジック: 90% 以上
   - UI コンポーネント: 努力目標

---

## 🏗️ ビルド

### 開発サーバー

```bash
bun run dev
```

### プロダクションビルド

```bash
bun run build
```

### ビルド成功の確認

プルリクエスト前に必ず実行：
```bash
bun run build && bun test
```

---

## 🎨 コーディング規約

### TypeScript

- **型定義**: `lib/types.ts` に集約
- **any 禁止**: 可能な限り具体的な型を使用
- **インターフェース**: データ構造には `interface` を使用

### React

- **関数コンポーネント**: 常に関数コンポーネントを使用
- **"use client"**: クライアント専用機能を使う場合のみ明示
- **CSS Modules**: スタイルは必ず CSS Modules を使用

### CSS Modules

- **1:1 対応**: `Component.tsx` には `Component.module.css` を作成
- **命名**: camelCase（例: `.container`, `.cardTitle`）
- **グローバルスタイル禁止**: すべて CSS Modules でスコープ化

### インポート順序

```typescript
// 1. 外部ライブラリ
import { useState } from "react";
import Link from "next/link";

// 2. 型定義
import type { InvestmentPlan } from "@/lib/types";

// 3. ビジネスロジック
import { calculateSimulation } from "@/lib/calculator";

// 4. コンポーネント
import { TaxSavingsHighlight } from "@/components/TaxSavingsHighlight";

// 5. CSS
import styles from "./page.module.css";
```

---

## 🌿 ブランチ戦略

### ブランチ命名

- **機能ブランチ**: `001-nisa-simulator`, `002-nisa-tax-comparison`
- **機能番号を prefix**: 仕様ディレクトリと一致させる

### 開発フロー

1. 機能ブランチを作成
2. 実装とコミットを重ねる
3. テスト・ビルド確認
4. プルリクエスト作成（必要に応じて）

---

## 📝 ドキュメント

### 必須ドキュメント

各機能には以下を作成：

1. **spec.md**: 機能仕様
   - Intent（目的）
   - User Scenarios（ユーザーストーリー）
   - Requirements（要件）
   - Success Criteria（成功基準）

2. **tasks.md**: タスクリスト
   - フェーズごとに整理
   - `[ ]` / `[x]` でチェック管理
   - リアルタイム更新

### オプションドキュメント

- **plan.md**: 実装計画
- **design-artifacts/**: 設計資料

---

## 🤝 レビュー

### プルリクエスト前のチェックリスト

- [ ] ビルドが成功する（`bun run build`）
- [ ] すべてのテストが成功する（`bun test`）
- [ ] tasks.md がすべて `[x]` になっている
- [ ] コミットメッセージが Conventional Commits に準拠
- [ ] 新機能には必ずテストを追加
- [ ] CSS Modules が 1:1 対応している

---

## 💡 Tips

### セッション間の連携

別のセッションで作業を引き継ぐ場合：

1. `specs/*/tasks.md` を確認して進捗を把握
2. `git log --oneline -20` で最近のコミットを確認
3. `git status` で未コミットの変更を確認
4. `bun test && bun run build` で動作確認

### トラブルシューティング

- **ビルドエラー**: TypeScript の型エラーを確認
- **テスト失敗**: `bun test --verbose` で詳細を確認
- **スタイル崩れ**: CSS Modules のクラス名を確認

---

## 📞 質問・提案

プロジェクトに関する質問や改善提案は、GitHub Issues で受け付けています。

---

**Last Updated**: 2025-11-19
