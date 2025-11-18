# Research & Technology Decisions: NISA積立シミュレーター

**Date**: 2025-11-18
**Feature**: NISA積立シミュレーター

## 技術スタック選定

### Decision 1: フレームワーク選定 - React + Next.js

**Decision**: React 18+ + Next.js 14+ を採用

**Rationale**:
- **モダンな Web 開発**: React は最も広く使われているフロントエンドライブラリであり、豊富なエコシステム
- **Next.js の利点**: ファイルベースルーティング、ビルトイン最適化、Vercel との統合
- **App Router**: Next.js 14 の最新 App Router により、React Server Components のメリットを享受
- **TypeScript サポート**: 型安全性により、バグを早期に発見
- **パフォーマンス**: 自動コード分割、画像最適化、プリフェッチによる高速化
- **静的エクスポート**: バックエンド不要で静的ホスティング可能（Vercel、Netlify、GitHub Pages）
- **開発体験**: Fast Refresh（ホットリロード）により開発速度が向上

**Alternatives Considered**:
1. **Flutter/Dart**
   - 利点: クロスプラットフォーム対応（Web、iOS、Android）
   - 欠点: Web のみの要件には過剰、学習コストが高い

2. **Vue + Nuxt**
   - 利点: 学習曲線が緩やか、軽量
   - 欠点: エコシステムが React より小さい、TypeScript サポートが React より劣る

3. **Plain JavaScript/HTML/CSS**
   - 利点: 依存関係が少ない、シンプル
   - 欠点: UI コンポーネントやグラフを一から構築する必要がある

**選定理由**: Web のみの要件に対し、React + Next.js が最も成熟しており、静的ホスティング可能でコスト効率が高い。

---

### Decision 2: パッケージマネージャー - bun

**Decision**: bun を採用

**Rationale**:
- **高速**: npm/yarn/pnpm より圧倒的に高速なインストールとビルド
- **オールインワン**: パッケージマネージャー、タスクランナー、バンドラーが統合
- **TypeScript ネイティブ**: 追加設定なしで TypeScript を実行可能
- **Node.js 互換**: 既存の npm パッケージがそのまま使用可能
- **開発体験**: 高速な起動時間により開発サイクルが短縮

**Alternatives Considered**:
1. **npm**
   - 利点: Node.js に標準搭載、最も安定
   - 欠点: 速度が遅い

2. **pnpm**
   - 利点: ディスク容量効率が高い、高速
   - 欠点: bun ほど高速ではない

**選定理由**: 開発速度を最大化するため、最新の高速ツールである bun を採用。

---

### Decision 3: チャートライブラリ - Chart.js + react-chartjs-2

**Decision**: Chart.js + react-chartjs-2 パッケージを採用

**Rationale**:
- **広く使用されている**: 最も人気のある JavaScript チャートライブラリ
- **軽量**: バンドルサイズが小さく、ページロード時間に影響しない
- **React ラッパー**: react-chartjs-2 により React コンポーネントとして簡単に統合
- **豊富なグラフタイプ**: 折れ線グラフ、棒グラフ、円グラフなど多様なグラフに対応
- **カスタマイズ性**: 色、スタイル、アニメーションを細かく調整可能
- **アクティブなメンテナンス**: 継続的に更新されており、ドキュメントが豊富
- **アクセシビリティ**: WAI-ARIA 対応で、スクリーンリーダーフレンドリー

**Alternatives Considered**:
1. **Recharts**
   - 利点: React 専用に設計、宣言的API
   - 欠点: バンドルサイズが大きい、Chart.js ほど軽量ではない

2. **D3.js**
   - 利点: 高度なカスタマイズ可能、柔軟性が高い
   - 欠点: 学習コストが高い、過剰に複雑

3. **Victory**
   - 利点: React ネイティブ、アニメーション豊富
   - 欠点: バンドルサイズが大きい

**選定理由**: 軽量で使いやすく、spec.md で指定された Chart.js を採用。

---

### Decision 4: スタイリング - Tailwind CSS

**Decision**: Tailwind CSS を採用

**Rationale**:
- **ユーティリティファースト**: クラス名でスタイルを直接適用、CSS ファイル不要
- **レスポンシブデザイン**: ブレークポイントが組み込まれ、モバイル対応が容易
- **高速開発**: カスタムCSSを書く時間を削減
- **一貫性**: デザインシステムが統一され、保守しやすい
- **最適化**: PurgeCSS により未使用のスタイルを自動削除、バンドルサイズ最小化
- **Next.js との統合**: 公式サポートがあり、セットアップが簡単

**Alternatives Considered**:
1. **CSS Modules**
   - 利点: スコープ化されたCSS、コンポーネント単位
   - 欠点: CSS ファイルの管理が必要

2. **styled-components / emotion**
   - 利点: CSS-in-JS、動的スタイリング
   - 欠点: ランタイムオーバーヘッド、バンドルサイズ増加

**選定理由**: 高速開発とレスポンシブデザイン対応のため、Tailwind CSS が最適。

---

### Decision 5: テストフレームワーク

**Decision**: Jest + React Testing Library + Playwright を採用

**Test Strategy**:
- **Unit Tests**: ビジネスロジック（複利計算、NISA枠チェック）のテスト
- **Component Tests**: React コンポーネントの動作テスト
- **E2E Tests**: エンドツーエンドの機能テスト

**Testing Tools**:
- **Jest**: JavaScript テストフレームワーク（ユニットテスト）
- **React Testing Library**: React コンポーネントテスト（ユーザー視点）
- **Playwright**: E2Eテスト（ブラウザ自動化）

**Rationale**:
- **Jest**: Next.js の標準テストフレームワーク、設定が簡単
- **React Testing Library**: ユーザーの視点でテストを書く哲学、実装詳細に依存しない
- **Playwright**: 高速で信頼性の高いE2Eテスト、複数ブラウザ対応
- **TDD サポート**: Constitution Principle III に準拠

**Alternatives Considered**:
1. **Vitest**
   - 利点: Jest より高速
   - 欠点: Next.js との統合が Jest ほど成熟していない

2. **Cypress**
   - 利点: 開発者体験が良い、タイムトラベルデバッグ
   - 欠点: Playwright より遅い

**選定理由**: Next.js のベストプラクティスに従い、Jest + React Testing Library + Playwright を採用。

---

### Decision 6: プロジェクト構造 - Next.js App Router 標準構造

**Decision**: Next.js 14 App Router の標準構造を採用

**Structure**:
```
/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # ルートレイアウト
│   ├── page.tsx             # トップページ
│   └── globals.css          # グローバルスタイル
├── components/              # React コンポーネント
│   ├── SimulatorForm.tsx    # 入力フォーム
│   ├── ResultDisplay.tsx    # 結果表示
│   ├── Chart.tsx            # グラフ表示
│   └── NisaWarning.tsx      # NISA枠警告
├── lib/                     # ユーティリティ・ロジック
│   ├── calculator.ts        # 複利計算ロジック
│   ├── nisaValidator.ts     # NISA枠検証
│   └── types.ts             # TypeScript型定義
└── __tests__/               # テスト
```

**Rationale**:
- **Next.js 公式推奨**: ベストプラクティスに準拠
- **明確な責務分離**: UI（components）とロジック（lib）が分離
- **テスト容易性**: 各レイヤーを独立してテスト可能
- **Simplicity & YAGNI**: 過度な抽象化を避け、必要最小限の構造

**Alternatives Considered**:
1. **Pages Router**
   - 利点: 従来の Next.js 構造、学習コストが低い
   - 欠点: 古い方式、App Router の新機能が使えない

2. **Feature-First Structure**
   - 利点: 機能ごとにディレクトリ分割
   - 欠点: このシンプルなアプリには過剰

**選定理由**: Next.js 14 の最新機能を活用し、将来の拡張性を確保するため App Router を採用。

---

## Best Practices & Patterns

### 複利計算のベストプラクティス

**Formula**: FV = PMT × ((1 + r)^n - 1) / r

**Implementation Considerations**:
- **精度**: JavaScript の `Number` 型は IEEE 754 倍精度浮動小数点で十分な精度
- **オーバーフロー対策**: 極端な値（40年、高利回り）でもオーバーフローしないことを確認
- **丸め誤差**: 金額表示時は適切に丸める（整数円単位）

**Code Pattern**:
```typescript
export function calculateFutureValue({
  monthlyAmount,
  years,
  annualRate,
}: {
  monthlyAmount: number;
  years: number;
  annualRate: number;
}): number {
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;

  if (monthlyRate === 0) {
    return monthlyAmount * months;
  }

  return monthlyAmount * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
}
```

---

### グラフ表示のベストプラクティス

**Chart Type**: 折れ線グラフ（Line Chart）

**Data Points**:
- X軸: 期間（経過月数または経過年数）
- Y軸: 資産額（円）
- 2本の線: 元本累計、総資産額（元本 + 運用益）

**Visual Design**:
- 元本: 実線、青色 (#3b82f6)
- 総資産: 実線、緑色 (#10b981)
- グリッド線: 淡いグレー
- レスポンシブ: モバイルでも読みやすいサイズ

**Accessibility**:
- 色覚障害対応: 色だけでなく凡例でも区別
- ARIA ラベル: グラフの説明を提供

---

### 入力検証のベストプラクティス

**Validation Rules**:
1. 積立額: 100円以上、数値のみ
2. 積立期間: 1〜40年、整数のみ
3. 想定利回り: -10%〜20%、小数点2桁まで

**User Feedback**:
- リアルタイム検証: 入力中にエラーを表示
- エラーメッセージ: 具体的で修正方法を示す
- 視覚的フィードバック: エラー時は赤枠、正常時は緑チェック

**Error Messages**:
- 「積立額は100円以上を入力してください」
- 「積立期間は1年から40年の範囲で入力してください」
- 「利回りは-10%から20%の範囲で入力してください」

---

## Performance Optimization

### 計算パフォーマンス

**Goal**: 1秒以内に結果を表示

**Strategy**:
- 複利計算は O(1) の数式で実行（ループ不要）
- グラフデータポイントは最大 480点（月次データ × 40年）
- 計算は同期処理で十分（非同期化不要）

**Measurement**:
- React DevTools Profiler でパフォーマンス測定
- Lighthouse で Core Web Vitals を確認

### UI レスポンス

**Goal**: 入力変更時に即座に再計算

**Strategy**:
- React の `useState` と `useEffect` で状態管理
- debounce は不要（計算が十分高速）
- ボタンタップ時は即座に実行

---

## Security & Privacy

**Data Handling**:
- すべての計算はクライアントサイドで実行
- サーバーへのデータ送信なし
- localStorage への保存なし（プライバシー保護）

**Disclaimer**:
- 「本シミュレーションは参考値であり、実際の運用結果を保証するものではありません」
- 「投資判断は自己責任で行ってください」

---

## Summary

すべての技術選定が完了しました：

1. **Language/Version**: TypeScript 5.x + React 18+ + Next.js 14+
2. **Package Manager**: bun
3. **Primary Dependencies**: Chart.js, react-chartjs-2, Tailwind CSS
4. **Testing**: Jest, React Testing Library, Playwright
5. **Project Structure**: Next.js App Router 標準構造

これらの決定により、Phase 1（設計フェーズ）に進む準備が整いました。
