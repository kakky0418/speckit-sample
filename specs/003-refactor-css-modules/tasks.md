# タスクリスト: CSS Modules リファクタリング

**ブランチ**: `003-refactor-css-modules`
**作成日**: 2025-11-18
**ステータス**: 📋 計画済み（実装待ち）
**技術スタック**: Next.js 15+, React 19, TypeScript, CSS Modules

---

## フェーズ 1: 小さいコンポーネントのリファクタリング

**目的**: 依存が少ないコンポーネントから段階的に Tailwind CSS から CSS Modules に移行

### Step 1.1: InvestmentChart コンポーネント

- [ ] T001: `components/InvestmentChart.module.css` を作成
  - `w-full h-[400px]` を CSS Modules に変換
- [ ] T002: `components/InvestmentChart.tsx` を更新
  - Tailwind クラスを削除
  - CSS Modules の import を追加
- [ ] T003: ビジュアル検証とテスト実行
  - グラフ表示の確認
  - 高さ 400px の維持確認
  - 既存テストの成功確認

### Step 1.2: ComparisonChart コンポーネント

- [ ] T004: `components/ComparisonChart.module.css` を作成
- [ ] T005: `components/ComparisonChart.tsx` を更新
  - Tailwind クラスを削除
  - CSS Modules の import を追加
- [ ] T006: ビジュアル検証とテスト実行

**成果物**:
- `components/InvestmentChart.module.css` (新規)
- `components/ComparisonChart.module.css` (新規)
- `components/InvestmentChart.tsx` (変更)
- `components/ComparisonChart.tsx` (変更)

---

## フェーズ 2: ページコンポーネントのリファクタリング

**目的**: 中規模のページコンポーネントを CSS Modules に移行

### Step 2.1: メインページ

- [ ] T007: `app/page.module.css` を作成
  - レイアウト、フォーム、ボタンなどのスタイルを定義
- [ ] T008: `app/page.tsx` を更新
  - すべての Tailwind クラスを削除
  - CSS Modules に置き換え
- [ ] T009: ビジュアル検証とテスト実行
  - レイアウトの確認
  - レスポンシブ対応の確認

### Step 2.2: 比較ページ

- [ ] T010: `app/comparison/page.module.css` を作成
- [ ] T011: `app/comparison/page.tsx` を更新
  - Tailwind クラスを削除
  - CSS Modules に置き換え
- [ ] T012: ビジュアル検証とテスト実行

**成果物**:
- `app/page.module.css` (新規)
- `app/comparison/page.module.css` (新規)
- `app/page.tsx` (変更)
- `app/comparison/page.tsx` (変更)

---

## フェーズ 3: レイアウトのリファクタリング

**目的**: アプリケーション全体に影響するレイアウトを CSS Modules に移行

- [ ] T013: `app/layout.module.css` を作成
  - グローバルレイアウトのスタイルを定義
- [ ] T014: `app/layout.tsx` を更新
  - Tailwind クラスを削除
  - CSS Modules に置き換え
- [ ] T015: 全ページのビジュアル検証
  - すべてのページで正しく表示されることを確認

**成果物**:
- `app/layout.module.css` (新規)
- `app/layout.tsx` (変更)

---

## フェーズ 4: グローバル設定とクリーンアップ

**目的**: Tailwind CSS の完全な削除とプロジェクトのクリーンアップ

### Step 4.1: グローバル CSS の更新

- [ ] T016: `app/globals.css` を更新
  - Tailwind の `@tailwind` ディレクティブを削除
  - CSS 変数を追加（カラーパレット、スペーシングなど）

### Step 4.2: Tailwind 依存関係の削除

- [ ] T017: `package.json` から Tailwind パッケージを削除
  - `tailwindcss`
  - `postcss`
  - `autoprefixer`
- [ ] T018: 依存関係の再インストール
  - `bun install` を実行

### Step 4.3: 設定ファイルの削除

- [ ] T019: Tailwind 設定ファイルを削除
  - `tailwind.config.ts`
  - `postcss.config.js`
- [ ] T020: ビルドの成功確認
  - `bun run build` の実行
  - エラーがないことを確認

**成果物**:
- `app/globals.css` (変更)
- `package.json` (変更)
- `tailwind.config.ts` (削除)
- `postcss.config.js` (削除)

---

## フェーズ 5: 最終検証とドキュメント

**目的**: リファクタリングの完了確認とドキュメント整備

- [ ] T021: すべてのテストを実行
  - ユニットテストの成功確認
  - E2E テストの成功確認（存在する場合）
- [ ] T022: 全ページのビジュアル回帰テスト
  - リファクタリング前後のスクリーンショット比較
  - UI の変更がないことを確認
- [ ] T023: tsx と CSS の 1対1 対応を確認
  - すべての tsx ファイルに対応する .module.css が存在
  - Tailwind クラスが完全に削除されている
- [ ] T024: ドキュメントの更新
  - README.md にスタイル管理手法を記載
  - リファクタリング完了レポートを作成

**成果物**:
- リファクタリング完了レポート
- 更新された README.md

---

## 実装サマリー

### 📊 タスク概要
- **Total**: 24 タスク
- **Phase 1**: 6 タスク（小さいコンポーネント）
- **Phase 2**: 6 タスク（ページコンポーネント）
- **Phase 3**: 3 タスク（レイアウト）
- **Phase 4**: 5 タスク（クリーンアップ）
- **Phase 5**: 4 タスク（最終検証）

### 🎯 目標成果物
- **新規 CSS Modules**: 約 6〜8 ファイル
- **変更ファイル**: 約 6〜8 tsx ファイル
- **削除ファイル**: 2 ファイル（Tailwind 設定）

### 🚀 実装戦略
1. **段階的アプローチ**: 1ファイルずつリファクタリング
2. **安全性優先**: 各フェーズ完了後に Git コミット
3. **ビジュアル検証**: UI の変更がないことを確認
4. **テスト駆動**: 各フェーズでテストを実行

### ⚠️ 注意事項
- リファクタリング中は機能追加を避ける
- 各ステップで必ずテストを実行
- 問題があれば即座にロールバック
- UI の変更は一切行わない（内部構造のみ変更）

---

## 次のステップ

リファクタリング計画の詳細は `refactoring-plan.md` を参照してください。

---

**ステータス**: 📋 **計画済み**（実装待ち）
**Last Updated**: 2025-11-19
