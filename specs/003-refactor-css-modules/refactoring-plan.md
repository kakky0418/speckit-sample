# リファクタリング実行計画

**プロジェクト**: 003-refactor-css-modules
**作成日**: 2025-11-18
**目的**: 001-nisa-simulator を Tailwind CSS から CSS Modules に段階的に移行

---

## 📋 リファクタリング戦略

### 基本方針

1. **段階的アプローチ**: 1ファイルずつリファクタリングし、各ステップでテストを実行
2. **安全性優先**: 各フェーズ完了後に Git コミットし、問題があればロールバック可能にする
3. **ビジュアル検証**: リファクタリング前後のスクリーンショットを比較し、UI の変更がないことを確認
4. **テスト駆動**: 既存テストを維持し、各フェーズでテストを実行

### リファクタリングの順序（推奨）

```
Phase 1: 小さいコンポーネント（依存が少ない）
  ├─ Step 1.1: InvestmentChart.tsx
  └─ Step 1.2: ComparisonChart.tsx

Phase 2: ページコンポーネント（中規模）
  ├─ Step 2.1: app/page.tsx
  └─ Step 2.2: app/comparison/page.tsx

Phase 3: レイアウト（全体に影響）
  └─ Step 3.1: app/layout.tsx

Phase 4: グローバル設定とクリーンアップ
  ├─ Step 4.1: globals.css の更新（CSS 変数追加）
  ├─ Step 4.2: Tailwind 依存関係の削除
  └─ Step 4.3: 設定ファイルの削除
```

---

## 🎯 Phase 1: 小さいコンポーネントのリファクタリング

### Step 1.1: InvestmentChart.tsx

**優先度**: P1（最初に実施）
**所要時間**: 30分
**難易度**: 低

#### 現状分析

```tsx
// components/InvestmentChart.tsx（変更前）
export function InvestmentChart({ chartData }: InvestmentChartProps) {
  // ...
  return (
    <div className="w-full h-[400px]">
      <Line data={data} options={options} />
    </div>
  );
}
```

#### リファクタリング内容

1. **InvestmentChart.module.css を作成**

```css
/* components/InvestmentChart.module.css */
.container {
  width: 100%;
  height: 400px;
}
```

2. **InvestmentChart.tsx を更新**

```tsx
// components/InvestmentChart.tsx（変更後）
import styles from './InvestmentChart.module.css';

export function InvestmentChart({ chartData }: InvestmentChartProps) {
  // ...
  return (
    <div className={styles.container}>
      <Line data={data} options={options} />
    </div>
  );
}
```

#### テスト項目

- [ ] グラフが正しく表示される
- [ ] 高さが 400px のまま維持される
- [ ] レスポンシブ対応が機能する

#### 完了条件

- [ ] `InvestmentChart.module.css` が作成されている
- [ ] Tailwind のクラス（`w-full`, `h-[400px]`）が削除されている
- [ ] 既存テストが成功する
- [ ] ビジュアルリグレッションテストが成功する

---

### Step 1.2: ComparisonChart.tsx

**優先度**: P1
**所要時間**: 30分
**難易度**: 低

#### 現状分析

ComparisonChart.tsx も InvestmentChart.tsx と同様の構造のため、同じアプローチを適用します。

#### リファクタリング内容

1. **ComparisonChart.module.css を作成**

```css
/* components/ComparisonChart.module.css */
.container {
  width: 100%;
  height: 400px;
}
```

2. **ComparisonChart.tsx を更新**

```tsx
// components/ComparisonChart.tsx
import styles from './ComparisonChart.module.css';

export function ComparisonChart({ scenarios }: ComparisonChartProps) {
  // ...
  return (
    <div className={styles.container}>
      <Line data={data} options={options} />
    </div>
  );
}
```

#### 完了条件

- [ ] `ComparisonChart.module.css` が作成されている
- [ ] Tailwind のクラスが削除されている
- [ ] 既存テストが成功する

---

## 🎯 Phase 2: ページコンポーネントのリファクタリング

### Step 2.1: app/page.tsx（メインページ）

**優先度**: P1
**所要時間**: 2-3時間
**難易度**: 高（多くのスタイルを移行）

#### 現状分析

app/page.tsx は多くの Tailwind クラスを使用しており、以下の要素が含まれます：
- コンテナ（min-h-screen, p-4, sm:p-8）
- グリッドレイアウト（grid, grid-cols-1, lg:grid-cols-2）
- 入力フォーム（bg-white, rounded-lg, shadow-md）
- 結果表示カード
- エラー表示
- NISA 枠表示

#### リファクタリング内容

1. **page.module.css を作成**

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

.navigation {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.comparisonLink {
  background-color: #9333ea;
  color: white;
  font-weight: 600;
  padding: 0.5rem 1.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.comparisonLink:hover {
  background-color: #7e22ce;
}

.layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 1024px) {
  .layout {
    grid-template-columns: 1fr 1fr;
  }
}

.column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card {
  background-color: var(--color-card-bg);
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.cardTitle {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.formGroup {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  background-color: var(--color-input-bg);
}

.input:focus {
  outline: none;
  ring: 2px;
  ring-color: #3b82f6;
}

.button {
  width: 100%;
  background-color: #2563eb;
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.button:hover {
  background-color: #1d4ed8;
}

.errorContainer {
  margin-top: 1rem;
  padding: 1rem;
  background-color: var(--color-error-bg);
  border: 1px solid var(--color-error-border);
  border-radius: 0.375rem;
}

.errorTitle {
  font-weight: 600;
  color: var(--color-error-text);
  margin-bottom: 0.5rem;
}

.errorList {
  list-style: disc;
  list-style-position: inside;
  color: var(--color-error-text);
}

.resultGrid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .resultGrid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.resultCard {
  padding: 1rem;
  border-radius: 0.375rem;
}

.resultCardGreen {
  background-color: var(--color-green-bg);
}

.resultCardBlue {
  background-color: var(--color-blue-bg);
}

.resultCardPurple {
  background-color: var(--color-purple-bg);
}

.resultLabel {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.25rem;
}

.resultValue {
  font-size: 1.5rem;
  font-weight: 700;
}

.resultValueGreen {
  color: var(--color-green-text);
}

.resultValueBlue {
  color: var(--color-blue-text);
}

.resultValuePurple {
  color: var(--color-purple-text);
}

.nisaInfo {
  padding: 1rem;
  border-radius: 0.375rem;
  background-color: var(--color-gray-bg);
}

.nisaInfoError {
  background-color: var(--color-error-bg);
  border: 1px solid var(--color-error-border);
}

.nisaTitle {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.nisaText {
  font-size: 1.125rem;
}

.nisaValue {
  font-weight: 600;
}

.nisaWarning {
  margin-top: 0.5rem;
  color: var(--color-error-text);
  font-weight: 600;
}

.disclaimer {
  margin-top: 2rem;
  padding: 1rem;
  background-color: var(--color-warning-bg);
  border: 1px solid var(--color-warning-border);
  border-radius: 0.375rem;
}

.disclaimerText {
  font-size: 0.875rem;
  color: var(--color-text);
}
```

2. **page.tsx を更新**

```tsx
// app/page.tsx
import styles from './page.module.css';
import clsx from 'clsx';

export default function Home() {
  // ... state and handlers

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          NISA積立シミュレーター
        </h1>

        <div className={styles.navigation}>
          <Link href="/comparison" className={styles.comparisonLink}>
            複数シナリオ比較 →
          </Link>
        </div>

        <div className={styles.layout}>
          {/* 左カラム */}
          <div className={styles.column}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>積立条件を入力</h2>

              <div className={styles.formGroup}>
                <div>
                  <label className={styles.label}>
                    毎月の積立額（円）
                  </label>
                  <input
                    type="number"
                    value={plan.monthlyAmount}
                    onChange={(e) => handleInputChange("monthlyAmount", Number(e.target.value))}
                    className={styles.input}
                    min={INPUT_CONSTRAINTS.MIN_MONTHLY_AMOUNT}
                  />
                </div>
                {/* ... 他の入力フィールド */}

                <button onClick={handleCalculate} className={styles.button}>
                  計算する
                </button>
              </div>

              {/* エラー表示 */}
              {errors.length > 0 && (
                <div className={styles.errorContainer}>
                  <p className={styles.errorTitle}>入力エラー:</p>
                  <ul className={styles.errorList}>
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* 右カラム */}
          {result && (
            <div className={styles.column}>
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>シミュレーション結果</h2>

                <div className={styles.resultGrid}>
                  <div className={clsx(styles.resultCard, styles.resultCardGreen)}>
                    <p className={styles.resultLabel}>総資産額</p>
                    <p className={clsx(styles.resultValue, styles.resultValueGreen)}>
                      {result.totalAssets.toLocaleString('ja-JP')}円
                    </p>
                  </div>
                  {/* ... 他の結果カード */}
                </div>

                {/* NISA枠情報 */}
                <div className={clsx(styles.nisaInfo, {
                  [styles.nisaInfoError]: result.isOverNisaLimit
                })}>
                  {/* ... NISA情報 */}
                </div>
              </div>

              {/* グラフ */}
              <div className={styles.card}>
                <InvestmentChart chartData={result.chartData} />
              </div>
            </div>
          )}
        </div>

        {/* 免責事項 */}
        <div className={styles.disclaimer}>
          <p className={styles.disclaimerText}>
            ※ 本シミュレーションは参考値であり、実際の運用結果を保証するものではありません。
          </p>
        </div>
      </main>
    </div>
  );
}
```

3. **clsx のインストール**

```bash
bun add clsx
```

#### 完了条件

- [ ] `page.module.css` が作成されている
- [ ] `clsx` がインストールされている
- [ ] すべての Tailwind クラスが削除されている
- [ ] 条件付きスタイル（エラー表示、NISA 超過警告）が動作する
- [ ] レスポンシブレイアウト（2カラム）が動作する
- [ ] 既存テストが成功する
- [ ] ビジュアルリグレッションテストが成功する

---

### Step 2.2: app/comparison/page.tsx

**優先度**: P1
**所要時間**: 2-3時間
**難易度**: 高

#### リファクタリング内容

app/comparison/page.tsx も app/page.tsx と同様の構造のため、同じアプローチを適用します。

1. **app/comparison/page.module.css を作成**
2. **page.tsx を更新**（styles を import し、className を置き換え）

#### 完了条件

- [ ] `app/comparison/page.module.css` が作成されている
- [ ] すべての Tailwind クラスが削除されている
- [ ] 既存テストが成功する

---

## 🎯 Phase 3: レイアウトのリファクタリング

### Step 3.1: app/layout.tsx

**優先度**: P2
**所要時間**: 1時間
**難易度**: 中

#### 現状分析

app/layout.tsx は比較的シンプルで、主に `<body>` タグにクラスを適用しています。

#### リファクタリング内容

1. **layout.module.css を作成**

```css
/* app/layout.module.css */
.body {
  font-family: var(--font-sans);
  background-color: var(--color-background);
  color: var(--color-text);
}
```

2. **layout.tsx を更新**

```tsx
// app/layout.tsx
import styles from './layout.module.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={styles.body}>
        {children}
      </body>
    </html>
  );
}
```

#### 完了条件

- [ ] `layout.module.css` が作成されている
- [ ] すべての Tailwind クラスが削除されている
- [ ] フォントとテーマが正しく適用される

---

## 🎯 Phase 4: グローバル設定とクリーンアップ

### Step 4.1: globals.css の更新

**優先度**: P1
**所要時間**: 30分
**難易度**: 中

#### 作業内容

1. **Tailwind の @directives を削除**

```css
/* app/globals.css（変更前） */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

2. **CSS 変数を追加**

```css
/* app/globals.css（変更後） */

/* リセット CSS */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* CSS 変数（ライトモード） */
:root {
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

  /* 背景色 */
  --color-background: #ffffff;
  --color-card-bg: #ffffff;
  --color-input-bg: #ffffff;

  /* テキスト色 */
  --color-text: #1a1a1a;
  --color-text-secondary: #6b7280;

  /* ボーダー */
  --color-border: #e5e7eb;

  /* 結果カード */
  --color-green-bg: #f0fdf4;
  --color-green-text: #15803d;
  --color-blue-bg: #eff6ff;
  --color-blue-text: #1d4ed8;
  --color-purple-bg: #faf5ff;
  --color-purple-text: #7e22ce;

  /* エラー */
  --color-error-bg: #fee2e2;
  --color-error-border: #f87171;
  --color-error-text: #991b1b;

  /* 警告 */
  --color-warning-bg: #fef3c7;
  --color-warning-border: #fbbf24;

  /* グレー */
  --color-gray-bg: #f9fafb;
}

/* ダークモード */
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #1a1a1a;
    --color-card-bg: #1f2937;
    --color-input-bg: #374151;

    --color-text: #ffffff;
    --color-text-secondary: #9ca3af;

    --color-border: #374151;

    --color-green-bg: rgba(16, 185, 129, 0.2);
    --color-green-text: #34d399;
    --color-blue-bg: rgba(59, 130, 246, 0.2);
    --color-blue-text: #60a5fa;
    --color-purple-bg: rgba(168, 85, 247, 0.2);
    --color-purple-text: #a78bfa;

    --color-error-bg: rgba(239, 68, 68, 0.3);
    --color-error-border: #ef4444;
    --color-error-text: #fca5a5;

    --color-warning-bg: rgba(251, 191, 36, 0.2);
    --color-warning-border: #fbbf24;

    --color-gray-bg: rgba(0, 0, 0, 0.2);
  }
}

body {
  font-family: var(--font-sans);
  background-color: var(--color-background);
  color: var(--color-text);
}
```

#### 完了条件

- [ ] Tailwind の @directives が削除されている
- [ ] CSS 変数が定義されている
- [ ] ダークモードの CSS 変数が定義されている

---

### Step 4.2: Tailwind 依存関係の削除

**優先度**: P1
**所要時間**: 10分
**難易度**: 低

#### 作業内容

1. **package.json から Tailwind を削除**

```bash
bun remove tailwindcss postcss autoprefixer
```

2. **package.json の確認**

```json
{
  "dependencies": {
    // tailwindcss, postcss, autoprefixer が削除されていることを確認
  }
}
```

#### 完了条件

- [ ] `tailwindcss` が package.json から削除されている
- [ ] `postcss` が package.json から削除されている
- [ ] `autoprefixer` が package.json から削除されている
- [ ] `bun install` が成功する

---

### Step 4.3: 設定ファイルの削除

**優先度**: P1
**所要時間**: 5分
**難易度**: 低

#### 作業内容

1. **tailwind.config.ts を削除**

```bash
rm tailwind.config.ts
```

2. **postcss.config.js を削除**（存在する場合）

```bash
rm postcss.config.js
```

#### 完了条件

- [ ] `tailwind.config.ts` が削除されている
- [ ] `postcss.config.js` が削除されている（存在した場合）
- [ ] ビルドが成功する（`bun run build`）

---

## 🧪 テスト戦略

### 各フェーズでのテスト

#### 1. ユニットテスト

```bash
bun test
```

各フェーズ完了後に実行し、すべてのテストが成功することを確認。

#### 2. ビルドテスト

```bash
bun run build
```

各フェーズ完了後に実行し、TypeScript のコンパイルエラーがないことを確認。

#### 3. ビジュアルリグレッションテスト

```bash
# リファクタリング前にスクリーンショットを撮影
bun run dev
# 各ページをブラウザで開き、スクリーンショットを保存

# リファクタリング後に同じ手順でスクリーンショットを撮影
# 2つのスクリーンショットを比較
```

**撮影対象ページ**:
- `/` （メインページ）
- `/comparison` （複数シナリオ比較）

**撮影条件**:
- デスクトップ（1920x1080）
- タブレット（768x1024）
- モバイル（375x667）
- ライトモード
- ダークモード（対応している場合）

#### 4. E2E テスト（推奨）

Playwright または Cypress を使用して、ユーザーシナリオをテスト。

```typescript
// e2e/refactoring.spec.ts
test('メインページの基本フローが動作する', async ({ page }) => {
  await page.goto('/');

  // 積立額を入力
  await page.fill('input[type="number"]', '30000');

  // 計算ボタンをクリック
  await page.click('button:has-text("計算する")');

  // 結果が表示される
  await expect(page.locator('text=総資産額')).toBeVisible();
});
```

---

## 🔄 Git ブランチ戦略

### ブランチ構造

```
main
  └─ 003-refactor-css-modules (base branch)
       ├─ 003-phase1-components (Phase 1)
       ├─ 003-phase2-pages (Phase 2)
       ├─ 003-phase3-layout (Phase 3)
       └─ 003-phase4-cleanup (Phase 4)
```

### コミット戦略

各ステップ完了後に Git コミットを作成：

```bash
# Step 1.1 完了後
git add components/InvestmentChart.tsx components/InvestmentChart.module.css
git commit -m "refactor: InvestmentChart を CSS Modules に移行"

# Step 1.2 完了後
git add components/ComparisonChart.tsx components/ComparisonChart.module.css
git commit -m "refactor: ComparisonChart を CSS Modules に移行"

# Phase 1 完了後
git add .
git commit -m "refactor(phase1): コンポーネントの CSS Modules 移行完了"
```

---

## 📊 進捗管理

### チェックリスト

#### Phase 1: コンポーネント
- [ ] Step 1.1: InvestmentChart.tsx
- [ ] Step 1.2: ComparisonChart.tsx
- [ ] Phase 1 テスト実施
- [ ] Phase 1 Git コミット

#### Phase 2: ページ
- [ ] Step 2.1: app/page.tsx
- [ ] Step 2.2: app/comparison/page.tsx
- [ ] Phase 2 テスト実施
- [ ] Phase 2 Git コミット

#### Phase 3: レイアウト
- [ ] Step 3.1: app/layout.tsx
- [ ] Phase 3 テスト実施
- [ ] Phase 3 Git コミット

#### Phase 4: クリーンアップ
- [ ] Step 4.1: globals.css の更新
- [ ] Step 4.2: Tailwind 依存関係の削除
- [ ] Step 4.3: 設定ファイルの削除
- [ ] Phase 4 テスト実施
- [ ] Phase 4 Git コミット

#### 最終確認
- [ ] すべてのユニットテストが成功
- [ ] ビルドが成功
- [ ] ビジュアルリグレッションテストが成功
- [ ] E2E テストが成功（実施した場合）
- [ ] デスクトップ・モバイル両方で動作確認
- [ ] ライトモード・ダークモード両方で動作確認

---

## ⚠️ ロールバック戦略

### 問題が発生した場合

#### ステップレベルのロールバック

```bash
# 最新のコミットを取り消す
git reset --hard HEAD~1
```

#### フェーズレベルのロールバック

```bash
# Phase 2 全体を取り消して Phase 1 に戻る
git reset --hard <Phase1のコミットハッシュ>
```

#### 完全なロールバック

```bash
# リファクタリング開始前の状態に戻る
git reset --hard <リファクタリング開始前のコミットハッシュ>
```

---

## 📝 完了条件（Definition of Done）

### 必須条件

- [ ] すべての tsx ファイル（5ファイル）に対応する .module.css が存在する
- [ ] tsx ファイル内に Tailwind のクラスが 0個
- [ ] `tailwindcss`, `postcss`, `autoprefixer` が package.json から削除されている
- [ ] `tailwind.config.ts` と `postcss.config.js` が削除されている
- [ ] `globals.css` から Tailwind @directives が削除されている
- [ ] `globals.css` に CSS 変数が定義されている
- [ ] すべてのユニットテストが成功する
- [ ] `bun run build` が成功する
- [ ] ビジュアルリグレッションテストで差分 0%
- [ ] デスクトップ・モバイル両方で動作確認完了
- [ ] ライトモード・ダークモード両方で動作確認完了

### 推奨条件

- [ ] E2E テストが成功する
- [ ] バンドルサイズが削減されている（約 50KB 削減）
- [ ] コードレビューが完了している
- [ ] ドキュメントが更新されている

---

**作成者**: Claude (AI Architect)
**最終更新**: 2025-11-18
