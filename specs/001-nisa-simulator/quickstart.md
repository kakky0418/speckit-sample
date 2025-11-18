# Quick Start Guide: NISA積立シミュレーター

**Date**: 2025-11-18
**Feature**: NISA積立シミュレーター
**Tech Stack**: TypeScript + React + Next.js + bun

## 概要

このガイドでは、NISA積立シミュレーターの開発を開始するための手順を説明します。開発環境のセットアップから、最初の機能実装、テスト実行までをカバーします。

---

## 前提条件

開発を始める前に、以下がインストールされていることを確認してください：

1. **bun**: バージョン 1.0 以上（パッケージマネージャー + ランタイム）
2. **Node.js**: バージョン 18 以上（本番デプロイ用、オプション）
3. **Git**: バージョン管理用
4. **IDE**: VS Code 推奨（TypeScript、React、Tailwind CSS の拡張機能付き）

### bun のインストール

```bash
# macOS / Linux
curl -fsSL https://bun.sh/install | bash

# インストール確認
bun --version
# 1.0.0 以上が表示されることを確認
```

### 推奨 VS Code 拡張機能

```bash
# VS Code 拡張機能（推奨）
- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features
```

---

## プロジェクトセットアップ

### 1. Next.js プロジェクトの作成

```bash
# プロジェクトディレクトリに移動
cd /Users/shoichi.kakizaki/develop/speckit-sample

# Next.js プロジェクトの作成（bun を使用）
bunx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"

# プロンプトの回答例:
# ✔ Would you like to use TypeScript? … Yes
# ✔ Would you like to use ESLint? … Yes
# ✔ Would you like to use Tailwind CSS? … Yes
# ✔ Would you like to use `src/` directory? … No
# ✔ Would you like to use App Router? … Yes
# ✔ Would you like to customize the default import alias (@/*)? … No
```

### 2. 依存パッケージの追加

```bash
# Chart.js とその React ラッパーをインストール
bun add chart.js react-chartjs-2

# 開発依存パッケージをインストール
bun add -d @types/node @types/react @types/react-dom

# テスト関連パッケージをインストール
bun add -d jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
bun add -d playwright @playwright/test
```

### 3. プロジェクト構造の作成

```bash
# ディレクトリ構造を作成
mkdir -p components
mkdir -p lib
mkdir -p __tests__/unit
mkdir -p __tests__/components
mkdir -p __tests__/e2e
```

最終的なディレクトリ構造：

```
speckit-sample/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── SimulatorForm.tsx
│   ├── ResultDisplay.tsx
│   ├── Chart.tsx
│   ├── NisaWarning.tsx
│   └── ScenarioComparison.tsx
├── lib/
│   ├── types.ts
│   ├── constants.ts
│   ├── calculator.ts
│   ├── nisaValidator.ts
│   └── validation.ts
├── __tests__/
│   ├── unit/
│   │   ├── calculator.test.ts
│   │   └── nisaValidator.test.ts
│   ├── components/
│   │   ├── SimulatorForm.test.tsx
│   │   └── ResultDisplay.test.tsx
│   └── e2e/
│       └── simulator.spec.ts
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

---

## 開発の開始

### Step 1: 型定義の作成

`lib/types.ts` を作成：

```typescript
// lib/types.ts

export interface InvestmentPlan {
  monthlyAmount: number;
  years: number;
  annualRate: number;
}

export interface SimulationResult {
  totalAssets: number;
  totalPrincipal: number;
  totalProfit: number;
  annualInvestment: number;
  nisaUtilizationRate: number;
  isOverNisaLimit: boolean;
  chartData: ChartDataPoint[];
}

export interface ChartDataPoint {
  year: number;
  principal: number;
  totalAssets: number;
}

export interface Scenario {
  name: string;
  annualRate: number;
  result: SimulationResult;
  color: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
```

### Step 2: 定数の定義

`lib/constants.ts` を作成：

```typescript
// lib/constants.ts

export const NISA_LIMITS = {
  TSUMITATE_ANNUAL: 1_200_000,
  GROWTH_ANNUAL: 2_400_000,
  LIFETIME: 18_000_000,
} as const;

export const INPUT_CONSTRAINTS = {
  MIN_MONTHLY_AMOUNT: 100,
  MAX_YEARS: 40,
  MIN_YEARS: 1,
  MIN_ANNUAL_RATE: -10.0,
  MAX_ANNUAL_RATE: 20.0,
  DEFAULT_ANNUAL_RATE: 5.0,
} as const;
```

### Step 3: 計算ロジックの実装

`lib/calculator.ts` を作成：

```typescript
// lib/calculator.ts

import type { InvestmentPlan, SimulationResult, ChartDataPoint } from './types';
import { NISA_LIMITS } from './constants';

export function calculateSimulation(plan: InvestmentPlan): SimulationResult {
  const { monthlyAmount, years, annualRate } = plan;

  const totalPrincipal = monthlyAmount * years * 12;

  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;

  let totalAssets: number;
  if (monthlyRate === 0) {
    totalAssets = monthlyAmount * months;
  } else {
    totalAssets = monthlyAmount * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
  }

  const totalProfit = totalAssets - totalPrincipal;
  const annualInvestment = monthlyAmount * 12;
  const nisaUtilizationRate = annualInvestment / NISA_LIMITS.TSUMITATE_ANNUAL;
  const isOverNisaLimit = annualInvestment > NISA_LIMITS.TSUMITATE_ANNUAL;
  const chartData = generateChartData(plan);

  return {
    totalAssets: Math.floor(totalAssets),
    totalPrincipal: Math.floor(totalPrincipal),
    totalProfit: Math.floor(totalProfit),
    annualInvestment: Math.floor(annualInvestment),
    nisaUtilizationRate,
    isOverNisaLimit,
    chartData,
  };
}

export function generateChartData(plan: InvestmentPlan): ChartDataPoint[] {
  const { monthlyAmount, years, annualRate } = plan;
  const monthlyRate = annualRate / 12 / 100;
  const chartData: ChartDataPoint[] = [];

  for (let year = 0; year <= years; year++) {
    const monthsPassed = year * 12;
    const principal = monthlyAmount * monthsPassed;

    let totalAssets: number;
    if (monthlyRate === 0) {
      totalAssets = principal;
    } else {
      totalAssets = monthlyAmount * (Math.pow(1 + monthlyRate, monthsPassed) - 1) / monthlyRate;
    }

    chartData.push({
      year,
      principal: Math.floor(principal),
      totalAssets: Math.floor(totalAssets),
    });
  }

  return chartData;
}
```

### Step 4: 開発サーバーの起動

```bash
# 開発サーバーを起動
bun run dev

# ブラウザで http://localhost:3000 を開く
```

---

## テストの実行

### Unit テストのセットアップ

`jest.config.js` を作成：

```javascript
// jest.config.js

const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
```

`jest.setup.js` を作成：

```javascript
// jest.setup.js

import '@testing-library/jest-dom';
```

### Unit テストの作成

`__tests__/unit/calculator.test.ts` を作成：

```typescript
// __tests__/unit/calculator.test.ts

import { calculateSimulation } from '@/lib/calculator';
import type { InvestmentPlan } from '@/lib/types';

describe('calculateSimulation', () => {
  test('標準的な入力値で正しい結果を返す', () => {
    const plan: InvestmentPlan = {
      monthlyAmount: 30000,
      years: 20,
      annualRate: 5.0,
    };

    const result = calculateSimulation(plan);

    expect(result.totalPrincipal).toBe(7200000); // 30000 × 20 × 12
    expect(result.totalAssets).toBeGreaterThan(result.totalPrincipal);
    expect(result.totalAssets).toBeCloseTo(12330000, -4); // 約1,233万円
  });

  test('利回り0%の場合、総資産 = 元本', () => {
    const plan: InvestmentPlan = {
      monthlyAmount: 30000,
      years: 20,
      annualRate: 0,
    };

    const result = calculateSimulation(plan);

    expect(result.totalAssets).toBe(result.totalPrincipal);
    expect(result.totalProfit).toBe(0);
  });
});
```

### テストの実行

```bash
# Unit テストを実行
bun test

# または
bun run jest
```

---

## ビルドとデプロイ

### 本番ビルド

```bash
# 本番ビルドを作成
bun run build

# ビルド結果を確認
bun run start
```

### Vercel へのデプロイ

```bash
# Vercel CLI をインストール
bun add -g vercel

# Vercel にデプロイ
vercel
```

または、GitHub と連携して自動デプロイ：

1. GitHub にプッシュ
2. Vercel ダッシュボードでリポジトリをインポート
3. 自動デプロイが開始される

---

## 次のステップ

1. **タスクの確認**: `specs/001-nisa-simulator/tasks.md` で実装タスクを確認
2. **コンポーネントの作成**: `components/SimulatorForm.tsx` などを実装
3. **テストの追加**: 各機能に対応するテストを作成
4. **デザインの適用**: Tailwind CSS でスタイリング

---

## トラブルシューティング

### bun install でエラーが発生する場合

```bash
# キャッシュをクリア
bun pm cache rm

# 再インストール
bun install
```

### TypeScript エラーが表示される場合

```bash
# 型定義を再生成
bun run build
```

### Next.js の開発サーバーが起動しない場合

```bash
# .next ディレクトリを削除
rm -rf .next

# 再起動
bun run dev
```

---

## 参考リソース

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
- [bun Documentation](https://bun.sh/docs)

---

## サマリー

この Quick Start Guide に従うことで、以下が完了します：

1. ✅ 開発環境のセットアップ（bun、Next.js）
2. ✅ プロジェクト構造の作成
3. ✅ 型定義と計算ロジックの実装
4. ✅ テスト環境のセットアップ
5. ✅ 開発サーバーの起動

次は `/speckit.tasks` を実行してタスクリストを作成し、実装を進めましょう！
