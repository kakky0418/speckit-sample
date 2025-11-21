# データモデル: 年齢ベース資産予測機能

**Date**: 2025-11-21
**Feature**: 006-age-based-projection
**Phase**: 1 (Design & Contracts)

## Overview

この機能は既存の NISA シミュレーターに年齢情報を追加する拡張です。データモデルは既存の型定義を最小限の変更で拡張し、後方互換性を完全に維持します。

## Entities

### InvestmentPlan（拡張）

投資計画の設定情報を表すエンティティ。年齢情報を追加します。

**フィールド**:

| フィールド名 | 型 | 必須 | 説明 | バリデーション |
|------------|------|------|------|--------------|
| monthlyAmount | number | Yes | 毎月の積立額（円） | >= 0 |
| years | number | Yes | 積立期間（年） | 1-40 |
| annualRate | number | Yes | 想定年利回り（%） | -10 〜 20 |
| initialAmount | number | No | 初回投資額（円） | >= 0 |
| **currentAge** | **number** | **No** | **現在の年齢（歳）** | **1-120、整数のみ** |

**変更点**:
- `currentAge` フィールドを追加（オプション）
- 既存フィールドに変更なし

**バリデーションルール**:
- `currentAge` が undefined: OK（年齢機能を使用しない）
- `currentAge` が整数: OK
- `currentAge` が小数: NG（エラー: 「整数で入力してください」）
- `currentAge` < 1 または > 120: NG（エラー: 「1 歳以上 120 歳以下で入力してください」）

**リレーションシップ**:
- SimulationResult を生成する際の入力パラメータ

---

### SimulationResult（変更なし）

シミュレーション結果を表すエンティティ。既存の定義をそのまま使用します。

**フィールド**:

| フィールド名 | 型 | 説明 |
|------------|------|------|
| totalAssets | number | 総資産額（円） |
| totalPrincipal | number | 元本合計（円） |
| totalProfit | number | 運用益（円） |
| annualInvestment | number | 年間投資額（円） |
| nisaUtilizationRate | number | NISA 枠活用率（0-1） |
| isOverNisaLimit | boolean | NISA 枠超過フラグ |
| chartData | ChartDataPoint[] | グラフ表示用データ |

**変更点**:
- なし（既存のまま）

**Note**: 年齢情報は表示レイヤーで計算するため、結果データに含める必要はありません。

---

### ChartDataPoint（変更なし）

グラフ表示用のデータポイント。既存の定義をそのまま使用します。

**フィールド**:

| フィールド名 | 型 | 説明 |
|------------|------|------|
| year | number | 経過年数（0 から years まで） |
| principal | number | その時点での元本累計（円） |
| totalAssets | number | その時点での総資産額（円） |

**変更点**:
- なし（既存のまま）

**Note**: X 軸ラベルは React コンポーネント内で動的に生成するため、age フィールドの追加は不要です。

---

### Milestone（新規 - P2 用）

節目の年齢でのマイルストーン情報を表すエンティティ。

**フィールド**:

| フィールド名 | 型 | 説明 |
|------------|------|------|
| age | number | マイルストーン年齢（例: 40, 50, 60） |
| yearFromNow | number | 現在からの経過年数 |
| assets | number | その年齢時点での総資産額（円） |

**生成ルール**:
- マイルストーンは 10 歳刻み（40, 50, 60, 70...）
- 現在の年齢 + 積立期間の範囲内のみ生成
- 例: 現在 35 歳、積立 30 年 → 40, 50, 60 歳のマイルストーンを生成

**計算方法**:
1. `age = roundUp(currentAge / 10) * 10` から開始（次の 10 歳刻み）
2. `age <= currentAge + years` の範囲でループ
3. `yearFromNow = age - currentAge`
4. `assets = chartData[yearFromNow].totalAssets`

---

### ReverseCalculationParams（新規 - P3 用）

逆算機能のパラメータを表すエンティティ。

**フィールド**:

| フィールド名 | 型 | 必須 | 説明 | バリデーション |
|------------|------|------|------|--------------|
| currentAge | number | Yes | 現在の年齢（歳） | 1-120、整数 |
| targetAge | number | Yes | 目標年齢（歳） | currentAge より大きい |
| targetAmount | number | Yes | 目標資産額（円） | > 0 |
| annualRate | number | Yes | 想定年利回り（%） | -10 〜 20 |
| initialAmount | number | No | 初回投資額（円） | >= 0 |

**バリデーションルール**:
- `targetAge <= currentAge`: NG（エラー: 「目標年齢は現在の年齢より大きくしてください」）
- `targetAmount <= 0`: NG（エラー: 「目標資産額は 0 円より大きくしてください」）

---

### ReverseCalculationResult（新規 - P3 用）

逆算機能の結果を表すエンティティ。

**フィールド**:

| フィールド名 | 型 | 説明 |
|------------|------|------|
| requiredMonthlyAmount | number | 必要な毎月の積立額（円） |
| years | number | 積立期間（年） |
| isRealistic | boolean | 現実的かどうか（月額 100 万円以下を現実的と判定） |
| warningMessage | string \| null | 警告メッセージ（非現実的な場合） |

**計算式**:
```
years = targetAge - currentAge
months = years * 12
monthlyRate = annualRate / 12 / 100
requiredMonthlyAmount = (targetAmount - initialAmount * (1 + monthlyRate)^months) * monthlyRate / ((1 + monthlyRate)^months - 1)
```

---

## State Transitions

この機能はステートレスなクライアントサイドアプリケーションのため、永続的な状態遷移はありません。以下はユーザー操作フローです:

### 基本フロー（P1）

```
[初期状態]
  ↓ ユーザーが年齢を入力（オプション）
[年齢入力済み]
  ↓ ユーザーが積立額・期間・利回りを入力
[入力完了]
  ↓ 計算ボタンをクリック
[結果表示]
  - 年齢が入力されている場合: 年齢ベース表示（「55 歳時点で XX 円」）
  - 年齢が入力されていない場合: 期間ベース表示（「20 年後に XX 円」）
  ↓ ユーザーが値を変更
[入力完了] に戻る
```

### マイルストーン表示フロー（P2）

```
[結果表示] + [年齢入力済み]
  ↓ システムが節目の年齢を自動計算
[マイルストーン生成]
  ↓ 節目の年齢がある場合
[マイルストーン表示]
  - 40 歳: XX 円
  - 50 歳: YY 円
  - 60 歳: ZZ 円
```

### 逆算機能フロー（P3）

```
[初期状態]
  ↓ ユーザーが「逆算モード」を選択
[逆算モード]
  ↓ 現在の年齢、目標年齢、目標資産額を入力
[逆算入力完了]
  ↓ 計算ボタンをクリック
[逆算結果表示]
  - 必要な積立額: 月 XX 円
  - 警告（非現実的な場合）
  ↓ 「この積立額でシミュレーションする」ボタンをクリック
[通常モードに切り替え]
  - 積立額が自動入力される
```

---

## Data Flow

### 基本フロー（P1）

```
[ユーザー入力]
  InvestmentPlan { monthlyAmount, years, annualRate, initialAmount, currentAge }
    ↓
[calculator.ts]
  calculateSimulation(plan) → SimulationResult
    ↓
[ResultDisplay.tsx]
  - 年齢が入力されている場合:
    - 表示: 「55 歳時点での資産額: 1,233 万円」
  - 年齢が入力されていない場合:
    - 表示: 「20 年後の資産額: 1,233 万円」
    ↓
[InvestmentChart.tsx]
  - 年齢が入力されている場合:
    - X 軸ラベル: 「35 歳」「40 歳」「45 歳」...
  - 年齢が入力されていない場合:
    - X 軸ラベル: 「0 年」「5 年」「10 年」...
```

### マイルストーンフロー（P2）

```
[ユーザー入力]
  InvestmentPlan { currentAge, years } + SimulationResult { chartData }
    ↓
[ageUtils.ts]
  generateMilestones(currentAge, years, chartData) → Milestone[]
    ↓
[Milestone.tsx]
  マイルストーン表示
  - 40 歳: 200 万円
  - 50 歳: 800 万円
  - 60 歳: 2,000 万円
```

### 逆算フロー（P3）

```
[ユーザー入力]
  ReverseCalculationParams { currentAge, targetAge, targetAmount, annualRate, initialAmount }
    ↓
[ageUtils.ts]
  calculateRequiredMonthlyAmount(...) → ReverseCalculationResult
    ↓
[ReverseCalculator.tsx]
  結果表示 + 「この積立額でシミュレーションする」ボタン
    ↓（ボタンクリック時）
[親コンポーネント]
  InvestmentPlan.monthlyAmount に逆算結果を設定 → 通常モードに切り替え
```

---

## Validation Summary

すべてのバリデーションルールを `lib/validation.ts` に集約します:

| フィールド | バリデーション | エラーメッセージ |
|-----------|--------------|----------------|
| currentAge（未入力） | OK | - |
| currentAge（整数、1-120） | OK | - |
| currentAge（小数） | NG | 「整数で入力してください」 |
| currentAge（< 1 または > 120） | NG | 「1 歳以上 120 歳以下で入力してください」 |
| targetAge（<= currentAge） | NG | 「目標年齢は現在の年齢より大きくしてください」 |
| targetAmount（<= 0） | NG | 「目標資産額は 0 円より大きくしてください」 |

---

## Notes

- すべての年齢関連フィールドはオプション（`?`）として定義し、後方互換性を完全に維持
- 新規エンティティ（Milestone, ReverseCalculationParams, ReverseCalculationResult）は P2, P3 でのみ使用
- データの永続化は行わない（ページリロードで状態はリセットされる）
- 計算ロジックはすべてクライアントサイドで実行（バックエンド不要）
