# Feature Specification: CSS Modules リファクタリング

**Feature Branch**: `003-refactor-css-modules`
**Created**: 2025-11-18
**Status**: Draft
**Input**: User description: "001-nisa-simulator を CSS Modules 構造（tsx と CSS の 1対1 対応）にリファクタリング"

## Intent（インテント）

### 目的
001-nisa-simulator の既存コードを Tailwind CSS インラインスタイルから CSS Modules に移行し、tsx ファイルと CSS ファイルの 1対1 対応構造を確立する。これにより、スタイルの保守性、再利用性、可読性を向上させる。

### 背景
- 現在、001 は **Tailwind CSS のユーティリティクラス**をインラインで使用している
- インラインスタイルは簡単だが、**長い className が可読性を損なう**
- スタイルとロジックが混在し、**保守が難しくなる**
- 002（税金比較機能）では CSS Modules（1対1 対応）を採用しており、**一貫性が欠如**している
- 統一されたスタイル管理手法を確立することで、**チーム開発の効率が向上**する

### 期待される成果
- **保守性の向上**: スタイルが独立したファイルに分離され、変更が容易になる
- **可読性の向上**: tsx ファイルがロジックに集中でき、長い className が削減される
- **一貫性の確立**: 001 と 002 が同じスタイル管理手法を使用し、統一感が生まれる
- **再利用性の向上**: CSS Modules により、コンポーネント単位でスタイルを管理できる

### 成功した未来の状態
開発者が「001 のコンポーネントを修正する際に、対応する .module.css ファイルを開くだけでスタイルを変更できる」ようになった。Tailwind の長い className が消え、tsx ファイルが読みやすくなり、002 との統一感が生まれた。新しい開発者がプロジェクトに参加しても、一貫したスタイル管理手法により、迷わずに開発を進められるようになった。

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 既存機能の動作保証 (Priority: P1)

リファクタリング後も、ユーザーから見た UI と機能は完全に同じ動作をします。見た目の変更は一切ありません。

**Why this priority**: リファクタリングの最優先事項は「既存機能を壊さない」ことです。ユーザー体験を維持しながら、内部構造を改善します。

**Independent Test**: 既存の E2E テストをすべて実行し、リファクタリング前後で結果が同じであることを確認できます。

**Acceptance Scenarios**:

1. **Given** ユーザーがメインページ（基本シミュレーション）を開いている、**When** リファクタリング後のページを表示する、**Then** 見た目と機能が完全に同じ（色、レイアウト、フォント、余白など）
2. **Given** ユーザーが複数シナリオ比較ページを開いている、**When** リファクタリング後のページを表示する、**Then** グラフの表示が完全に同じ
3. **Given** ユーザーが入力フォームに値を入力して計算する、**When** リファクタリング後の機能を使用する、**Then** 計算結果とエラーハンドリングが完全に同じ

---

### User Story 2 - tsx と CSS の 1対1 対応 (Priority: P1)

すべての tsx ファイルに対応する .module.css ファイルが存在し、スタイルが明確に分離されています。開発者はスタイル変更時に対応する CSS ファイルを開くだけで済みます。

**Why this priority**: これがリファクタリングの中核的な目標であり、保守性と一貫性を確保するために必須です。

**Independent Test**: ファイル構造を確認し、すべての tsx ファイルに対応する .module.css ファイルが存在し、Tailwind のインラインクラスが削除されていることを確認できます。

**Acceptance Scenarios**:

1. **Given** 開発者が `app/page.tsx` を確認する、**When** 対応する CSS ファイルを探す、**Then** `app/page.module.css` が存在し、すべてのスタイルがそこに定義されている
2. **Given** 開発者が `components/InvestmentChart.tsx` を確認する、**When** className を確認する、**Then** Tailwind のユーティリティクラスではなく、`styles.container` のような CSS Modules のクラス名が使用されている
3. **Given** 開発者がスタイルを変更したい、**When** 対応する .module.css ファイルを編集する、**Then** 変更が即座に反映される

---

### User Story 3 - Tailwind CSS の完全な削除 (Priority: P2)

Tailwind CSS の依存関係を削除し、CSS Modules のみでスタイリングを行います。バンドルサイズの削減と、依存関係の単純化を実現します。

**Why this priority**: Tailwind CSS を使用しなくなるため、不要な依存関係を削除することでプロジェクトがシンプルになります。

**Independent Test**: `package.json` から Tailwind 関連のパッケージが削除され、`tailwind.config.ts` が削除されていることを確認できます。また、ビルドが成功することを確認できます。

**Acceptance Scenarios**:

1. **Given** 開発者が `package.json` を確認する、**When** dependencies を確認する、**Then** `tailwindcss`, `postcss`, `autoprefixer` が削除されている
2. **Given** 開発者がプロジェクトをビルドする、**When** `bun run build` を実行する、**Then** エラーなくビルドが成功する
3. **Given** 開発者が設定ファイルを確認する、**When** プロジェクトルートを確認する、**Then** `tailwind.config.ts` と `postcss.config.js` が削除されている

---

### Edge Cases

- リファクタリング中に一部のスタイルが抜け落ちないよう、ビジュアルリグレッションテストを実施する
- ダークモード対応（`dark:` プレフィックス）を CSS Modules で再現する
- レスポンシブデザイン（`sm:`, `md:`, `lg:` など）を CSS Modules のメディアクエリで再現する
- 動的なスタイル（条件付き className）を CSS Modules で適切に処理する

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: すべての tsx ファイルに対応する .module.css ファイルが 1対1 で存在しなければならない
- **FR-002**: tsx ファイル内の Tailwind CSS ユーティリティクラスをすべて CSS Modules のクラス名に置き換えなければならない
- **FR-003**: リファクタリング後も、ユーザーから見た UI（色、レイアウト、フォント、余白など）が完全に同じでなければならない
- **FR-004**: レスポンシブデザイン（デスクトップ・モバイル対応）が維持されなければならない
- **FR-005**: ダークモード対応が維持されなければならない（該当する場合）
- **FR-006**: 動的なスタイル（条件付き className）が正しく動作しなければならない
- **FR-007**: Tailwind CSS の依存関係（tailwindcss, postcss, autoprefixer）を package.json から削除しなければならない
- **FR-008**: tailwind.config.ts と postcss.config.js を削除しなければならない
- **FR-009**: globals.css から Tailwind の @directives（@tailwind base, components, utilities）を削除しなければならない
- **FR-010**: すべての既存のユニットテストと E2E テストが成功しなければならない

### Key Entities

- **tsx ファイル**: コンポーネントのロジックと構造を定義するファイル
- **module.css ファイル**: tsx ファイルに 1対1 対応するスタイルファイル
- **CSS Modules**: ローカルスコープを持つ CSS の仕組み

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: すべての tsx ファイル（5ファイル）に対応する .module.css ファイルが存在する
- **SC-002**: tsx ファイル内に Tailwind のユーティリティクラス（`className="bg-blue-500"` など）が 0個 になる
- **SC-003**: ビジュアルリグレッションテストで、リファクタリング前後のスクリーンショットが一致する（差分 0%）
- **SC-004**: すべての既存テスト（ユニットテスト・E2E テスト）が成功する（成功率 100%）
- **SC-005**: バンドルサイズが削減される（Tailwind CSS の削除により約 50KB 削減が期待される）

## Assumptions *(optional)*

### 前提条件

- 001-nisa-simulator が正常に動作している（既存テストが成功している）
- 現在の UI デザインは変更しない（リファクタリングのみ）
- CSS Modules は Next.js 14+ でネイティブサポートされている
- ダークモード対応は CSS 変数または `prefers-color-scheme` メディアクエリで実装可能
- レスポンシブデザインは CSS のメディアクエリで実装可能

## Clarifications

### Session 2025-11-18

- Q: Tailwind CSS を完全に削除しますか、それとも併用しますか？ → A: 完全に削除し、CSS Modules のみを使用する
- Q: globals.css はどう扱いますか？ → A: Tailwind の @directives を削除し、グローバルなリセット CSS やカスタムプロパティ（CSS 変数）のみを残す
- Q: ダークモードはどのように実装しますか？ → A: CSS 変数（--color-background など）とメディアクエリ `@media (prefers-color-scheme: dark)` を使用
- Q: 動的なスタイル（条件付き className）はどう処理しますか？ → A: `classnames` または `clsx` ライブラリを使用して、複数のクラスを動的に結合
- Q: 002 との並行開発は可能ですか？ → A: 可能。003 は 001 のみを対象とし、002 とは独立している

## Technical Context

### Platform & Architecture
- **プラットフォーム**: Web アプリケーション（ブラウザベース）
- **対応デバイス**: デスクトップ・モバイル両対応（レスポンシブデザイン）
- **技術スタック**:
  - **フロントエンド**: React 19+
  - **フレームワーク**: Next.js 14+（App Router）
  - **パッケージマネージャー**: bun
  - **スタイリング**: ~~Tailwind CSS~~ → **CSS Modules**（移行後）
  - **ユーティリティライブラリ**: `clsx` または `classnames`（動的 className 用）

### リファクタリング対象ファイル

#### 変更対象の tsx ファイル（5ファイル）

```
app/
  layout.tsx                    → layout.module.css (新規作成)
  page.tsx                      → page.module.css (新規作成)
  comparison/
    page.tsx                    → page.module.css (新規作成)

components/
  InvestmentChart.tsx           → InvestmentChart.module.css (新規作成)
  ComparisonChart.tsx           → ComparisonChart.module.css (新規作成)
```

#### 削除対象ファイル

```
tailwind.config.ts              (削除)
postcss.config.js               (削除)
```

#### 変更対象ファイル

```
app/globals.css                 (Tailwind @directives を削除、CSS 変数のみ残す)
package.json                    (Tailwind 依存関係を削除)
```

### CSS Modules の構造

#### 変更前（Tailwind CSS）

```tsx
// app/page.tsx
export default function Home() {
  return (
    <div className="min-h-screen p-4 sm:p-8 pb-20 font-sans">
      <main className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">
          NISA積立シミュレーター
        </h1>
        {/* ... */}
      </main>
    </div>
  );
}
```

#### 変更後（CSS Modules）

```tsx
// app/page.tsx
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          NISA積立シミュレーター
        </h1>
        {/* ... */}
      </main>
    </div>
  );
}
```

```css
/* app/page.module.css */
.container {
  min-height: 100vh;
  padding: 1rem;
  padding-bottom: 5rem;
  font-family: var(--font-sans);
}

@media (min-width: 640px) {
  .container {
    padding: 2rem;
  }
}

.main {
  max-width: 80rem;
  margin: 0 auto;
}

.title {
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
}
```

### 動的 className の処理

#### clsx の使用例

```bash
bun add clsx
```

```tsx
import clsx from 'clsx';
import styles from './page.module.css';

<div className={clsx(styles.card, {
  [styles.error]: errors.length > 0,
  [styles.success]: result !== null,
})}>
  {/* ... */}
</div>
```

### ダークモード対応

#### globals.css に CSS 変数を定義

```css
/* app/globals.css */
:root {
  --color-background: #ffffff;
  --color-text: #1a1a1a;
  --color-border: #e5e7eb;
  /* ... その他の色変数 */
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #1a1a1a;
    --color-text: #ffffff;
    --color-border: #374151;
    /* ... その他の色変数 */
  }
}
```

#### CSS Modules で CSS 変数を使用

```css
/* app/page.module.css */
.container {
  background-color: var(--color-background);
  color: var(--color-text);
}

.card {
  border: 1px solid var(--color-border);
}
```

## Scope *(optional)*

### 対象範囲

- 001-nisa-simulator の全 tsx ファイル（5ファイル）のリファクタリング
- Tailwind CSS から CSS Modules への完全移行
- tsx と CSS の 1対1 対応構造の確立
- 既存機能とデザインの完全保持

### 対象外

- 新機能の追加
- UI デザインの変更
- 002-nisa-tax-comparison への影響（002 は既に CSS Modules を使用）
- パフォーマンス最適化（リファクタリングに直接関係しない）
- テストコードのリファクタリング（既存テストを維持）

## Risks & Mitigations

### Risk 1: スタイルの抜け漏れ
**影響**: 一部のスタイルが適用されず、UI が崩れる
**対策**: ビジュアルリグレッションテストを実施し、リファクタリング前後のスクリーンショットを比較

### Risk 2: レスポンシブデザインの不具合
**影響**: モバイルやタブレットで表示が崩れる
**対策**: 各ブレークポイントでテストを実施し、メディアクエリを正しく実装

### Risk 3: ダークモードの動作不良
**影響**: ダークモードで色が正しく表示されない
**対策**: CSS 変数とメディアクエリを使用し、ダークモード専用のテストを実施

### Risk 4: 動的 className の不具合
**影響**: エラー表示や条件付きスタイルが正しく適用されない
**対策**: `clsx` ライブラリを使用し、条件付きロジックのユニットテストを追加

---

**作成者**: Claude (AI Architect)
**最終更新**: 2025-11-18
