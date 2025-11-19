# Unit 2: UI/プレゼンテーション層（Presentation Layer）

**Unit ID**: 002-U2
**Priority**: P1
**Status**: Draft
**Created**: 2025-11-18

---

## 📋 ユニットの目的

税金比較機能のメインページ、節税額表示コンポーネント、詳細内訳テーブルを提供する UI 層。ユーザーに分かりやすく情報を提示し、操作性を確保する。

---

## 🎯 含まれるユーザーストーリー

### US1: 節税額の視覚的確認
- 節税額の強調表示
- 手取り金額の比較表示
- ページレイアウト

### US2（部分）: 詳細な税金比較グラフ
- 詳細内訳テーブル

---

## ✅ 受け入れ基準

### AC-1: 節税額の強調表示
**Given** 税金比較ページを表示
**When** ページを読み込む
**Then**:
- 💰 アイコン付きで「NISA の節税効果」というタイトルが表示される
- 節税額が大きく表示される（例: 「1,041,895円」）
- 「特定口座なら税金で失う金額」というサブタイトルが表示される

### AC-2: 手取り金額の比較
**Given** 税金比較ページを表示
**When** ページをスクロールまたは確認
**Then**:
- NISA の手取り総資産が表示される（例: 12,330,000円）
- 特定口座の手取り総資産が表示される（例: 11,288,105円）
- 差額が明示される（例: △1,041,895円）

### AC-3: 詳細内訳テーブル
**Given** 税金比較ページを表示
**When** 詳細内訳セクションを確認
**Then** 以下の項目が NISA と特定口座で並列表示される:
- 元本合計
- 運用益（税引前）
- 税金（20.315%）
- 手取り運用益
- 総資産（手取り）

### AC-4: レスポンシブ対応
**Given** モバイルデバイスで閲覧
**When** 税金比較ページを表示
**Then**:
- コンポーネントが縦スクロールで表示される
- テキストサイズが適切に調整される
- 画面幅に合わせてレイアウトが調整される

---

## 🛠️ 技術スタックと主要コンポーネント

### ファイル構成（tsx と CSS の 1対1 対応）

```
app/tax-comparison/
  page.tsx                                   # メインページ
  page.module.css                            # ページスタイル

components/
  TaxSavingsHighlight.tsx                    # 節税額強調表示
  TaxSavingsHighlight.module.css             # 節税額スタイル

  TaxDetailTable.tsx                         # 詳細内訳テーブル
  TaxDetailTable.module.css                  # テーブルスタイル
```

**設計原則**: 各 `.tsx` ファイルに対応する `.module.css` ファイルを必ず作成

---

## 📄 コンポーネント詳細

### 1. TaxSavingsHighlight.tsx

```typescript
// components/TaxSavingsHighlight.tsx

'use client';

import styles from './TaxSavingsHighlight.module.css';
import { TaxComparisonResult } from '@/lib/types';

interface TaxSavingsHighlightProps {
  result: TaxComparisonResult;
}

export default function TaxSavingsHighlight({ result }: TaxSavingsHighlightProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.icon}>💰</span>
        <h2 className={styles.title}>NISA の節税効果</h2>
      </div>

      <div className={styles.savingsAmount}>
        {result.taxSavings.toLocaleString()}円
      </div>

      <p className={styles.subtitle}>
        特定口座なら税金で失う金額
      </p>

      <div className={styles.comparison}>
        <div className={styles.comparisonItem}>
          <span className={styles.label}>NISA 手取り</span>
          <span className={styles.value}>
            {result.nisa.netAssets.toLocaleString()}円
          </span>
        </div>

        <div className={styles.comparisonItem}>
          <span className={styles.label}>特定口座 手取り</span>
          <span className={styles.value}>
            {result.tokutei.netAssets.toLocaleString()}円
          </span>
        </div>

        <div className={styles.difference}>
          <span className={styles.label}>差額</span>
          <span className={styles.value}>
            △{result.taxSavings.toLocaleString()}円
          </span>
        </div>
      </div>
    </div>
  );
}
```

```css
/* components/TaxSavingsHighlight.module.css */

.container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 2rem;
}

.header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.icon {
  font-size: 2rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.savingsAmount {
  font-size: 3rem;
  font-weight: 900;
  text-align: center;
  margin: 1.5rem 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  text-align: center;
  font-size: 0.95rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.comparison {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 8px;
}

.comparisonItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
}

.difference {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 700;
  padding-top: 1rem;
  border-top: 2px solid rgba(255, 255, 255, 0.3);
}

.label {
  opacity: 0.9;
}

.value {
  font-weight: 600;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .container {
    padding: 1.5rem;
  }

  .title {
    font-size: 1.25rem;
  }

  .savingsAmount {
    font-size: 2rem;
  }

  .comparisonItem,
  .difference {
    font-size: 1rem;
  }
}
```

---

### 2. TaxDetailTable.tsx

```typescript
// components/TaxDetailTable.tsx

'use client';

import styles from './TaxDetailTable.module.css';
import { TaxComparisonResult } from '@/lib/types';

interface TaxDetailTableProps {
  result: TaxComparisonResult;
}

export default function TaxDetailTable({ result }: TaxDetailTableProps) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>詳細内訳</h3>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.headerCell}>項目</th>
              <th className={styles.headerCell}>NISA</th>
              <th className={styles.headerCell}>特定口座</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.cell}>元本合計</td>
              <td className={styles.cell}>
                {result.principal.toLocaleString()}円
              </td>
              <td className={styles.cell}>
                {result.principal.toLocaleString()}円
              </td>
            </tr>

            <tr>
              <td className={styles.cell}>運用益（税引前）</td>
              <td className={styles.cell}>
                {result.profitBeforeTax.toLocaleString()}円
              </td>
              <td className={styles.cell}>
                {result.profitBeforeTax.toLocaleString()}円
              </td>
            </tr>

            <tr className={styles.highlightRow}>
              <td className={styles.cell}>税金（20.315%）</td>
              <td className={`${styles.cell} ${styles.nisaTax}`}>
                <strong>0円</strong>
              </td>
              <td className={`${styles.cell} ${styles.tokuteiTax}`}>
                <strong>{result.tokutei.tax.toLocaleString()}円</strong>
              </td>
            </tr>

            <tr>
              <td className={styles.cell}>手取り運用益</td>
              <td className={styles.cell}>
                {result.nisa.netAssets - result.principal}円
              </td>
              <td className={styles.cell}>
                {(result.tokutei.netAssets - result.principal).toLocaleString()}円
              </td>
            </tr>

            <tr className={styles.totalRow}>
              <td className={styles.cell}>
                <strong>総資産（手取り）</strong>
              </td>
              <td className={styles.cell}>
                <strong>{result.nisa.netAssets.toLocaleString()}円</strong>
              </td>
              <td className={styles.cell}>
                <strong>{result.tokutei.netAssets.toLocaleString()}円</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

```css
/* components/TaxDetailTable.module.css */

.container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #333;
}

.tableWrapper {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
}

.headerCell {
  background: #f7f7f7;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #555;
  border-bottom: 2px solid #ddd;
}

.cell {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  color: #333;
}

.highlightRow {
  background: #fffbf0;
}

.nisaTax {
  color: #10b981;
  font-weight: 600;
}

.tokuteiTax {
  color: #ef4444;
  font-weight: 600;
}

.totalRow {
  background: #f0f9ff;
  font-weight: 700;
}

.totalRow .cell {
  font-size: 1.1rem;
  padding: 1.25rem 1rem;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .title {
    font-size: 1.25rem;
  }

  .table {
    font-size: 0.9rem;
  }

  .headerCell,
  .cell {
    padding: 0.75rem;
  }
}
```

---

### 3. page.tsx（メインページ）

```typescript
// app/tax-comparison/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useInvestmentPlan } from '@/contexts/InvestmentPlanContext';
import { calculateTaxComparison } from '@/lib/calculator';
import { TaxComparisonResult } from '@/lib/types';
import TaxSavingsHighlight from '@/components/TaxSavingsHighlight';
import TaxDetailTable from '@/components/TaxDetailTable';
import styles from './page.module.css';

export default function TaxComparisonPage() {
  const { plan } = useInvestmentPlan();
  const [result, setResult] = useState<TaxComparisonResult | null>(null);

  useEffect(() => {
    if (plan) {
      const calculatedResult = calculateTaxComparison(plan);
      setResult(calculatedResult);
    }
  }, [plan]);

  if (!plan || !result) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <p>まず基本シミュレーションで条件を入力してください</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>税金比較</h1>
        <p className={styles.pageSubtitle}>
          NISA と特定口座の税金の差を確認できます
        </p>
      </header>

      <div className={styles.content}>
        <TaxSavingsHighlight result={result} />
        <TaxDetailTable result={result} />

        {/* Unit 3（グラフ層）のコンポーネントをここに配置 */}
      </div>
    </div>
  );
}
```

```css
/* app/tax-comparison/page.module.css */

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  margin-bottom: 2rem;
}

.pageTitle {
  font-size: 2rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.pageSubtitle {
  font-size: 1.1rem;
  color: #666;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.emptyState {
  text-align: center;
  padding: 4rem 2rem;
  background: #f7f7f7;
  border-radius: 12px;
}

.emptyState p {
  font-size: 1.1rem;
  color: #666;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .pageTitle {
    font-size: 1.5rem;
  }

  .pageSubtitle {
    font-size: 1rem;
  }
}
```

---

## 🔗 他ユニットとのインターフェース

### 依存するインターフェース（Input）

**Unit 1（計算・データ層）から**:
```typescript
import { useInvestmentPlan } from '@/contexts/InvestmentPlanContext';
import { calculateTaxComparison } from '@/lib/calculator';
import { TaxComparisonResult } from '@/lib/types';
```

### 提供するインターフェース（Output）

**Unit 3（グラフ層）へ**:
```typescript
// TaxComparisonResult を props として渡す
<TaxComparisonBarChart result={result} />
<TaxComparisonLineChart result={result} />
```

---

## 🧪 テスト戦略

### コンポーネントテスト

```typescript
// __tests__/components/TaxSavingsHighlight.test.tsx

import { render, screen } from '@testing-library/react';
import TaxSavingsHighlight from '@/components/TaxSavingsHighlight';

describe('TaxSavingsHighlight', () => {
  const mockResult = {
    nisa: { totalAssets: 12330000, tax: 0, netAssets: 12330000 },
    tokutei: { totalAssetsBeforeTax: 12330000, tax: 1041895, netAssets: 11288105 },
    taxSavings: 1041895,
    principal: 7200000,
    profitBeforeTax: 5130000,
  };

  it('節税額が正しく表示される', () => {
    render(<TaxSavingsHighlight result={mockResult} />);
    expect(screen.getByText('1,041,895円')).toBeInTheDocument();
  });

  it('手取り金額が正しく表示される', () => {
    render(<TaxSavingsHighlight result={mockResult} />);
    expect(screen.getByText('12,330,000円')).toBeInTheDocument();
    expect(screen.getByText('11,288,105円')).toBeInTheDocument();
  });
});
```

---

## 📦 成果物

### 新規作成ファイル
- `app/tax-comparison/page.tsx`
- `app/tax-comparison/page.module.css`
- `components/TaxSavingsHighlight.tsx`
- `components/TaxSavingsHighlight.module.css`
- `components/TaxDetailTable.tsx`
- `components/TaxDetailTable.module.css`

### テストファイル
- `__tests__/components/TaxSavingsHighlight.test.tsx`
- `__tests__/components/TaxDetailTable.test.tsx`
- `__tests__/app/tax-comparison/page.test.tsx`

---

## 🎯 完了の定義（Definition of Done）

- [ ] すべてのコンポーネントが正しく表示される
- [ ] tsx と CSS の 1対1 対応が守られている
- [ ] CSS Modules が正しく適用されている
- [ ] レスポンシブデザインが正しく動作する（デスクトップ・モバイル）
- [ ] Context から正しくデータを取得できる
- [ ] すべてのコンポーネントテストが成功する
- [ ] TypeScript のコンパイルエラーがない
- [ ] ESLint・Prettier が適用されている

---

**作成者**: Claude (AI Architect)
**最終更新**: 2025-11-18
