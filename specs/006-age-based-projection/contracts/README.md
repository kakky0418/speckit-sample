# Contracts: 年齢ベース資産予測機能

## Overview

このディレクトリには、年齢ベース資産予測機能の型定義契約が含まれています。この機能はフロントエンドのみで完結するため、API エンドポイントの定義はありません。TypeScript の型定義が契約として機能します。

## Type Contracts

### types.ts

年齢ベース機能で使用される TypeScript 型定義

**主要な型**:
- `InvestmentPlanWithAge`: 年齢情報を含む投資計画
- `Milestone`: 節目の年齢での資産額（P2）
- `ReverseCalculationParams`: 逆算機能の入力パラメータ（P3）
- `ReverseCalculationResult`: 逆算機能の結果（P3）

## Implementation Notes

- すべての年齢関連フィールドはオプション（`?`）として定義し、後方互換性を維持
- バリデーションは `lib/validation.ts` で実装
- 計算ロジックは `lib/calculator.ts` と `lib/ageUtils.ts` で実装
- UI コンポーネントは `components/` 配下に配置

## API Endpoints

該当なし。この機能はクライアントサイドのみで完結します。

## Data Persistence

該当なし。すべてのデータはクライアントサイドの state で管理され、永続化は行いません。
