# タスクリスト: 年齢ベース資産予測機能

**入力**: `/specs/006-age-based-projection/` の設計ドキュメント  
**前提**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**テスト**: TDD 必須（憲法で非交渉）- テストタスクを含む  
**構成**: 各ユーザーストーリー単位でタスクをまとめ、独立して実装・テストできるようにしています。

## 記法: `[ID] [P?] [Story] 説明`

- **[P]**: 並行実行可（異なるファイル・依存なし）
- **[Story]**: 対応するユーザーストーリー（例: US1, US2, US3）
- 説明には正確なファイルパスを含めること

## パス規約

単一の Next.js プロジェクト構成:
- **Components**: リポジトリ直下の `components/`
- **Library**: リポジトリ直下の `lib/`
- **Tests**: リポジトリ直下の `__tests__/`
- **App Router**: リポジトリ直下の `app/`

---

## フェーズ 1: Setup（共通基盤）

**目的**: 既存プロジェクト構造と依存関係を確認する

 - [X] T001 Next.js の構造 (app/, components/, lib/, __tests__) を確認する
 - [X] T002 [P] package.json の TypeScript 5.x, React 19, Next.js 15.1.3 を確認する
 - [X] T003 [P] Chart.js 4.4.0 と react-chartjs-2 5.2.0 を確認する
 - [X] T004 [P] Jest 29.7.0 と React Testing Library 16.1.0 を確認する
 - [X] T005 既存テストを実行しベースラインを確認: `bun test`

**チェックポイント**: 構造確認完了 → 実装に進行可能

---

## フェーズ 2: Foundational（ブロッカー）

**目的**: すべてのユーザーストーリーが依存する型定義とバリデーション基盤を用意

**⚠️ ブロック**: このフェーズ完了までユーザーストーリー着手不可

- [X] T006 lib/types.ts の InvestmentPlan に currentAge?: number を追加
- [X] T007 [P] lib/validation.ts に validateAge を追加
- [X] T008 [P] lib/ageUtils.ts を新規作成（calculateFutureAge, generateMilestones, calculateRequiredMonthlyAmount のプレースホルダー）

**チェックポイント**: 基盤完了 → ユーザーストーリーを並行開始可

---

## フェーズ 3: User Story 1 - 現在の年齢入力と年齢ベース表示 (P1) 🎯 MVP

**Goal**: 年齢入力により「何歳のときにいくらになるか」を確認できる基本機能を提供

**独立検証**: 年齢 35 歳・積立額 3 万円・期間 20 年を入力し「55 歳時点での資産額」が表示されること

### テスト（TDD 必須） ⚠️

> 先に書いて Red を確認してから実装

#### バリデーションテスト
- [X] T009 [P] [US1] validateAge(undefined) 正常 in __tests__/lib/validation.test.ts
- [X] T010 [P] [US1] validateAge(1-120 の整数) 正常 in __tests__/lib/validation.test.ts
- [X] T011 [P] [US1] validateAge(小数) でエラー in __tests__/lib/validation.test.ts
- [X] T012 [P] [US1] validateAge(<1, >120) でエラー in __tests__/lib/validation.test.ts

#### コンポーネントテスト
- [X] T013 [P] [US1] 年齢入力フィールド表示 in __tests__/components/InputForm.test.tsx
- [X] T014 [P] [US1] 年齢バリデーションエラー表示 in __tests__/components/InputForm.test.tsx
- [X] T015 [P] [US1] 年齢ベースの結果表示「XX 歳時点での資産額」 in __tests__/components/ResultDisplay.test.tsx
- [X] T016 [P] [US1] 年齢未入力時の期間ベース表示 in __tests__/components/ResultDisplay.test.tsx
- [X] T017 [P] [US1] グラフ X 軸の年齢ラベル「35 歳」「40 歳」 in __tests__/components/InvestmentChart.test.tsx
- [X] T018 [P] [US1] 年齢未入力時の期間ラベル in __tests__/components/InvestmentChart.test.tsx

### 実装（TDD サイクル）

- [X] T019 [US1] lib/validation.ts に validateAge 実装（T009-T012 を通す）
- [X] T020 [US1] components/InputForm.tsx に年齢入力欄を追加
- [X] T021 [US1] components/InputForm.tsx に年齢バリデーションエラー表示を追加
- [X] T022 [US1] components/ResultDisplay.tsx で currentAge 定義時に年齢ベース表示を出す
- [X] T023 [US1] components/InvestmentChart.tsx で X 軸ラベルを年齢/期間で切替

#### 連携
- [X] T024 [US1] 親から currentAge を InputForm/ResultDisplay/InvestmentChart へ受け渡す
- [X] T025 [US1] 全テスト実行で後方互換を確認: `bun test`

**チェックポイント**: User Story 1 (MVP) 完了・テスト可能

---

## フェーズ 4: User Story 2 - 節目の年齢でのマイルストーン表示 (P2)

**Goal**: 10 歳刻みの節目（40/50/60 歳など）の資産額を強調表示し、ライフプラン上の重要時点を把握できるようにする

**独立検証**: 年齢 35 歳・期間 30 年で 40/50/60 歳の資産額がハイライト表示されること

### テスト（TDD 必須） ⚠️

#### ユーティリティテスト
- [X] T026 [P] [US2] generateMilestones(35, 30) で [40,50,60] が返る in __tests__/lib/ageUtils.test.ts
- [X] T027 [P] [US2] 短期の場合は空/少数のマイルストーンになる in __tests__/lib/ageUtils.test.ts
- [X] T028 [P] [US2] エッジケース (38, 3) で [40] が返る in __tests__/lib/ageUtils.test.ts

#### コンポーネントテスト
- [X] T029 [P] [US2] Milestone コンポーネントで配列表示を確認 in __tests__/components/Milestone.test.tsx
- [X] T030 [P] [US2] 空配列時は描画しないことを確認 in __tests__/components/Milestone.test.tsx

### 実装

#### ユーティリティ
- [X] T031 [US2] generateMilestones を lib/ageUtils.ts に実装（T026-T028 通過）

#### コンポーネント
- [X] T032 [US2] components/Milestone.tsx を作成（T029-T030 通過）
- [X] T033 [US2] components/Milestone.module.css でスタイル追加
- [X] T034 [US2] 結果表示ページへ Milestone を統合

**チェックポイント**: User Story 2 完了（節目年齢のハイライト表示）

---

## フェーズ 5: User Story 3 - 目標年齢での資産額逆算機能 (P3)

**Goal**: 目標年齢・目標資産額から必要な毎月の積立額を逆算し提案する高度なプランニング機能を提供

**独立検証**: 年齢 35 歳・目標年齢 60 歳・目標資産額 2,000 万円で「毎月約 5 万円が必要」と表示されること

### テスト（TDD 必須） ⚠️

#### ユーティリティテスト
- [X] T035 [P] [US3] calculateRequiredMonthlyAmount の正常系 in __tests__/lib/ageUtils.test.ts
- [X] T036 [P] [US3] 利率 0% の場合の calculateRequiredMonthlyAmount in __tests__/lib/ageUtils.test.ts
- [X] T037 [P] [US3] initialAmount > 0 のケース in __tests__/lib/ageUtils.test.ts
- [X] T038 [P] [US3] 現実性フラグと警告の戻り値を確認 in __tests__/lib/ageUtils.test.ts

#### コンポーネントテスト
- [X] T039 [P] [US3] ReverseCalculator 入力フィールドの表示 in __tests__/components/ReverseCalculator.test.tsx
- [X] T040 [P] [US3] ReverseCalculator の結果表示 in __tests__/components/ReverseCalculator.test.tsx
- [X] T041 [P] [US3] 非現実的な目標時の警告表示 in __tests__/components/ReverseCalculator.test.tsx
- [X] T042 [P] [US3] 「この金額でシミュレーションする」ボタン動作 in __tests__/components/ReverseCalculator.test.tsx

### 実装

#### ユーティリティ
- [X] T043 [US3] lib/ageUtils.ts に calculateRequiredMonthlyAmount を実装（T035-T038 を通す）

#### コンポーネント
- [X] T044 [US3] components/ReverseCalculator.tsx を作成（T039-T042 通過）
- [X] T045 [US3] components/ReverseCalculator.module.css でスタイル追加
- [X] T046 [US3] メイン画面に逆算モードのトグルを追加
- [X] T047 [US3] 逆算結果を通常モードへ反映するボタンを実装

**チェックポイント**: User Story 3 完了で逆算機能を提供

---

## フェーズ 6: Polish / 横断対応

**目的**: 仕上げ・性能・ドキュメント

- [X] T048 [P] モバイル向けレスポンシブを components/*.module.css に追加
- [X] T049 [P] README.md に年齢ベース資産予測のドキュメントを追記
- [X] T050 [P] 全テストを実行しリグレッションを修正: `bun test`
- [X] T051 [P] Lint 実行と修正: `bun lint`
- [X] T052 性能確認: シミュレーション結果 1 秒以内表示
- [X] T053 性能確認: グラフ描画 1 秒以内表示
- [X] T054 手動テスト: spec.md の受入れシナリオを網羅
- [X] T055 手動テスト: spec.md のエッジケースを網羅

**最終チェックポイント**: 機能が本番投入可能

---

## 依存関係と実行順

### ストーリー依存

```
Setup (Phase 1)
  ↓
Foundational (Phase 2) ← ブロック
  ↓
├─→ User Story 1 (P1) 🎯 MVP ← 単独リリース可
├─→ User Story 2 (P2) ← US3 とは独立、文脈として US1 に依存
└─→ User Story 3 (P3) ← US1/US2 と独立
  ↓
Polish (Phase 6)
```

**クリティカルパス**: Phase 1 → Phase 2 → Phase 3 (US1) → Phase 6（MVP 提供）

**並行ポイント**:
- Phase 2 以降: US1/US2/US3 を別担当で並行可
- 各フェーズ内: [P] 付きは並行可
- テスト (T009-T018, T026-T030, T035-T042) は並行で執筆可

### 詳細タスク依存

**Phase 2 (Foundational)**:
- T006, T007, T008 は並行可

**Phase 3 (US1)**:
- T009-T018（テスト）は並行可
- T019 は T007 依存
- T020-T023 は T019 完了後に並行可
- T024 は T020-T023 依存
- T025 は最終検証

**Phase 4 (US2)**:
- T026-T030（テスト）は並行可
- T031（ユーティリティ）と T032-T033（コンポーネント）は並行可
- T034 は T031-T033 依存

**Phase 5 (US3)**:
- T035-T042（テスト）は並行可
- T043 と T044-T045 は並行可
- T046-T047 は T043-T045 依存

**Phase 6 (Polish)**:
- T048-T051 は並行可
- T052-T055 は順次実施

---

## 実装ストラテジー

### MVP First（推奨）

**Week 1: P1 コア**
1. Phase 1-2 完了（基盤）
2. Phase 3 完了（US1）
3. MVP 提供: 年齢入力で年齢ベース表示

**Week 2: UX 改善 (P2)**
4. Phase 4 完了（US2）
5. v1.1: マイルストーン表示追加

**Week 3: 高度機能 (P3)**
6. Phase 5 完了（US3）
7. Phase 6 仕上げ
8. v1.2: 逆算機能付きフルセット

### All-at-Once（代替）

Phase 1 → 2 → 3 → 4 → 5 → 6 を順次実施  
**利点**: 1 回の包括リリース  
**欠点**: 初期価値提供が遅い・リスク高

---

## 並行実行例（3 名体制）

- **Dev 1: US1 (P1)**: Phase 1-2 → Phase 3 (T009-T025)
- **Dev 2: US2 (P2)**: Phase 2 後に Phase 4 (T026-T034)
- **Dev 3: US3 (P3)**: Phase 2 後に Phase 5 (T035-T047)
- **全員**: Phase 6 (T048-T055)

**タイムライン目安**: 並行なら 1-2 週間（逐次なら 3 週間）

---

## タスクサマリー

**総タスク**: 55

**フェーズ別**:
- Phase 1 (Setup): 5
- Phase 2 (Foundational): 3
- Phase 3 (US1 - P1): 17（テスト 10 + 実装 7）
- Phase 4 (US2 - P2): 9（テスト 5 + 実装 4）
- Phase 5 (US3 - P3): 13（テスト 8 + 実装 5）
- Phase 6 (Polish): 8

**種類別**:
- テスト: 23 (42%)
- 実装: 24 (44%)
- 基盤: 8 (14%)

**並行可能タスク**:
- [P] 付き 31 個はフェーズ内で並行可能
- Phase 2 完了後は 3 ストーリー並行可

**MVP スコープ** (Phase 1-3): 25  
**フル機能** (全フェーズ): 55

---

## 次のステップ

1. **レビュー/承認**: このタスクリストをチームで確認
2. **担当割当**: ユーザーストーリー単位で担当を設定
3. **MVP 着手**: Phase 1-3 を進め US1 をまず届ける
4. **TDD サイクル**: Red-Green-Refactor をタスクごとに適用
5. **フィードバック反映**: MVP 後に Phase 4-5 へ進む

**実装開始コマンド例**:
```bash
/speckit.implement
```
