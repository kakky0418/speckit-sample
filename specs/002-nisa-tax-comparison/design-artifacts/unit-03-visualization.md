# Unit 3: グラフ可視化層（Visualization Layer）

**Unit ID**: 002-U3
**Priority**: P1
**Status**: Draft
**Created**: 2025-11-18

---

## 📋 ユニットの目的

Chart.js を使用して NISA と特定口座の税金比較をグラフで視覚化するユニット。積み上げ棒グラフと年次推移グラフにより、ユーザーが直感的に税金の差を理解できるようにする。

---

## 🎯 含まれるユーザーストーリー

### US2: 詳細な税金比較グラフ
- 積み上げ棒グラフ（元本・運用益・税金）
- 年次推移グラフ（折れ線グラフ）

---

## ✅ 受け入れ基準

### AC-1: 積み上げ棒グラフの表示
**Given** 税金比較ページを表示
**When** 積み上げ棒グラフセクションを確認
**Then**:
- NISA: [元本（青）][運用益（緑）] が表示される
- 特定口座: [元本（青）][運用益（暗緑）][税金（赤）] が表示される
- 各セクションにマウスホバーで金額が表示される
- 凡例が表示される

### AC-2: 年次推移グラフの表示
**Given** 税金比較ページを表示
**When** 年次推移グラフセクションを確認
**Then**:
- X軸: 年数（0年〜20年）が表示される
- Y軸: 総資産額（手取り）が表示される
- 青線: NISA の手取り総資産が表示される
- 赤線: 特定口座の手取り総資産が表示される
- 2本の線の差が年々開いていく様子が視覚化される
- 凡例が表示される

### AC-3: レスポンシブ対応
**Given** モバイルデバイスで閲覧
**When** グラフを表示
**Then**:
- グラフが画面幅に合わせて調整される
- 縦スクロールで2つのグラフを閲覧できる

---

## 🛠️ 技術スタックと主要コンポーネント

### ファイル構成（tsx と CSS の 1対1 対応）

```
components/
  TaxComparisonBarChart.tsx                  # 積み上げ棒グラフ
  TaxComparisonBarChart.module.css           # 棒グラフスタイル

  TaxComparisonLineChart.tsx                 # 年次推移グラフ
  TaxComparisonLineChart.module.css          # 折れ線グラフスタイル
```

**設計原則**: 各 `.tsx` ファイルに対応する `.module.css` ファイルを必ず作成

### 依存ライブラリ

```json
{
  "dependencies": {
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0"
  }
}
```

---

## 📄 コンポーネント詳細

### 1. TaxComparisonBarChart.tsx（積み上げ棒グラフ）

```typescript
// components/TaxComparisonBarChart.tsx

'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import styles from './TaxComparisonBarChart.module.css';
import { TaxComparisonResult } from '@/lib/types';

// Chart.js の登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TaxComparisonBarChartProps {
  result: TaxComparisonResult;
}

export default function TaxComparisonBarChart({ result }: TaxComparisonBarChartProps) {
  const data = {
    labels: ['NISA', '特定口座'],
    datasets: [
      {
        label: '元本',
        data: [result.principal, result.principal],
        backgroundColor: 'rgba(59, 130, 246, 0.8)', // 青
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: '運用益（税引後）',
        data: [
          result.nisa.netAssets - result.principal,
          result.tokutei.netAssets - result.principal,
        ],
        backgroundColor: 'rgba(16, 185, 129, 0.8)', // 緑
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
      {
        label: '税金',
        data: [0, result.tokutei.tax],
        backgroundColor: 'rgba(239, 68, 68, 0.8)', // 赤
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
          },
          padding: 15,
        },
      },
      title: {
        display: true,
        text: '手取り金額の内訳比較',
        font: {
          size: 18,
          weight: 'bold' as const,
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += context.parsed.y.toLocaleString() + '円';
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return (value / 10000).toLocaleString() + '万円';
          },
        },
      },
    },
  };

  return (
    <div className={styles.container}>
      <div className={styles.chartWrapper}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
```

```css
/* components/TaxComparisonBarChart.module.css */

.container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.chartWrapper {
  height: 400px;
  position: relative;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .chartWrapper {
    height: 300px;
  }
}
```

---

### 2. TaxComparisonLineChart.tsx（年次推移グラフ）

```typescript
// components/TaxComparisonLineChart.tsx

'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useEffect, useState } from 'react';
import styles from './TaxComparisonLineChart.module.css';
import { InvestmentPlan, YearlyData } from '@/lib/types';
import { calculateYearlyTaxComparison } from '@/lib/calculator';

// Chart.js の登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TaxComparisonLineChartProps {
  plan: InvestmentPlan;
}

export default function TaxComparisonLineChart({ plan }: TaxComparisonLineChartProps) {
  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);

  useEffect(() => {
    const data = calculateYearlyTaxComparison(plan);
    setYearlyData(data);
  }, [plan]);

  const data = {
    labels: yearlyData.map(d => `${d.year}年`),
    datasets: [
      {
        label: 'NISA（手取り）',
        data: yearlyData.map(d => d.nisaAssets),
        borderColor: 'rgba(59, 130, 246, 1)', // 青
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: false,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
      {
        label: '特定口座（手取り）',
        data: yearlyData.map(d => d.tokuteiAssets),
        borderColor: 'rgba(239, 68, 68, 1)', // 赤
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: false,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
          },
          padding: 15,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: '手取り総資産の年次推移',
        font: {
          size: 18,
          weight: 'bold' as const,
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += context.parsed.y.toLocaleString() + '円';
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 10,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return (value / 10000).toLocaleString() + '万円';
          },
        },
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  return (
    <div className={styles.container}>
      <div className={styles.chartWrapper}>
        <Line data={data} options={options} />
      </div>

      <div className={styles.insight}>
        <p className={styles.insightText}>
          💡 長期運用により、NISA と特定口座の差は年々大きくなります
        </p>
      </div>
    </div>
  );
}
```

```css
/* components/TaxComparisonLineChart.module.css */

.container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.chartWrapper {
  height: 400px;
  position: relative;
  margin-bottom: 1.5rem;
}

.insight {
  background: #f0f9ff;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

.insightText {
  margin: 0;
  color: #1e40af;
  font-size: 0.95rem;
  font-weight: 500;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .chartWrapper {
    height: 300px;
  }

  .insight {
    padding: 0.75rem 1rem;
  }

  .insightText {
    font-size: 0.875rem;
  }
}
```

---

## 🔗 他ユニットとのインターフェース

### 依存するインターフェース（Input）

**Unit 1（計算・データ層）から**:
```typescript
import { calculateYearlyTaxComparison } from '@/lib/calculator';
import { InvestmentPlan, TaxComparisonResult, YearlyData } from '@/lib/types';
```

**Unit 2（UI層）から**:
```typescript
// props として TaxComparisonResult または InvestmentPlan を受け取る
<TaxComparisonBarChart result={result} />
<TaxComparisonLineChart plan={plan} />
```

### 提供するインターフェース（Output）

- なし（表示専用のユニット）

---

## 🧪 テスト戦略

### コンポーネントテスト

```typescript
// __tests__/components/TaxComparisonBarChart.test.tsx

import { render, screen } from '@testing-library/react';
import TaxComparisonBarChart from '@/components/TaxComparisonBarChart';

describe('TaxComparisonBarChart', () => {
  const mockResult = {
    nisa: { totalAssets: 12330000, tax: 0, netAssets: 12330000 },
    tokutei: { totalAssetsBeforeTax: 12330000, tax: 1041895, netAssets: 11288105 },
    taxSavings: 1041895,
    principal: 7200000,
    profitBeforeTax: 5130000,
  };

  it('グラフのタイトルが表示される', () => {
    render(<TaxComparisonBarChart result={mockResult} />);
    expect(screen.getByText('手取り金額の内訳比較')).toBeInTheDocument();
  });

  it('凡例が表示される', () => {
    render(<TaxComparisonBarChart result={mockResult} />);
    expect(screen.getByText('元本')).toBeInTheDocument();
    expect(screen.getByText('運用益（税引後）')).toBeInTheDocument();
    expect(screen.getByText('税金')).toBeInTheDocument();
  });
});
```

```typescript
// __tests__/components/TaxComparisonLineChart.test.tsx

import { render, screen } from '@testing-library/react';
import TaxComparisonLineChart from '@/components/TaxComparisonLineChart';

describe('TaxComparisonLineChart', () => {
  const mockPlan = {
    monthlyAmount: 30000,
    years: 20,
    annualReturn: 5,
  };

  it('グラフのタイトルが表示される', () => {
    render(<TaxComparisonLineChart plan={mockPlan} />);
    expect(screen.getByText('手取り総資産の年次推移')).toBeInTheDocument();
  });

  it('インサイトメッセージが表示される', () => {
    render(<TaxComparisonLineChart plan={mockPlan} />);
    expect(screen.getByText(/長期運用により/)).toBeInTheDocument();
  });
});
```

### ビジュアルリグレッションテスト

```typescript
// __tests__/visual/charts.visual.test.tsx

import { render } from '@testing-library/react';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });

describe('Charts Visual Regression', () => {
  it('積み上げ棒グラフが正しく表示される', async () => {
    // スクリーンショット比較テスト
  });

  it('年次推移グラフが正しく表示される', async () => {
    // スクリーンショット比較テスト
  });
});
```

---

## 📦 成果物

### 新規作成ファイル
- `components/TaxComparisonBarChart.tsx`
- `components/TaxComparisonBarChart.module.css`
- `components/TaxComparisonLineChart.tsx`
- `components/TaxComparisonLineChart.module.css`

### テストファイル
- `__tests__/components/TaxComparisonBarChart.test.tsx`
- `__tests__/components/TaxComparisonLineChart.test.tsx`
- `__tests__/visual/charts.visual.test.tsx`

### 依存関係の追加
```bash
bun add chart.js react-chartjs-2
```

---

## ⚠️ 制約事項と前提条件

### 制約事項
- Chart.js v4.4.0 以上が必要
- グラフは Canvas で描画されるため、SSR では動作しない（'use client' 必須）
- モバイルではグラフサイズが調整される（高さ 300px）

### 前提条件
- Unit 1（計算・データ層）が完成していること
- `calculateYearlyTaxComparison()` 関数が実装されていること

---

## 🎯 完了の定義（Definition of Done）

- [ ] 積み上げ棒グラフが正しく表示される
- [ ] 年次推移グラフが正しく表示される
- [ ] tsx と CSS の 1対1 対応が守られている
- [ ] CSS Modules が正しく適用されている
- [ ] Chart.js が正しく設定されている（凡例、ツールチップ、軸ラベル）
- [ ] レスポンシブデザインが正しく動作する（デスクトップ・モバイル）
- [ ] マウスホバーで金額が表示される
- [ ] すべてのコンポーネントテストが成功する
- [ ] TypeScript のコンパイルエラーがない
- [ ] ESLint・Prettier が適用されている

---

**作成者**: Claude (AI Architect)
**最終更新**: 2025-11-18
