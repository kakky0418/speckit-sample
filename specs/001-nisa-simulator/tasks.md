# タスクリスト: NISA積立シミュレーター

**入力**: Design documents from `/specs/001-nisa-simulator/`
**前提**: plan.md, spec.md, research.md, data-model.md, contracts/
**技術スタック**: Next.js 14+ (App Router), React 19, TypeScript, Tailwind CSS, Chart.js, bun

**テスト**: ユニットテストを `__tests__/unit/` に配置

**構成**: タスクはユーザーストーリーごとにグループ化されており、各ストーリーを独立して実装・テストできます。

## 記法: `[ID] [P?] [Story] 説明`

- **[P]**: 並列実行可能（異なるファイル、依存関係なし）
- **[Story]**: タスクが属するユーザーストーリー（例: US1, US2, US3）
- 説明に正確なファイルパスを含める

## パス規約

Next.js (App Router) + React プロジェクトの標準的な構造：
- **Types**: `lib/types.ts`
- **Business Logic**: `lib/calculator.ts`, `lib/validation.ts`
- **Constants & Utils**: `lib/constants.ts`, `lib/formatters.ts`
- **UI Components**: `components/*.tsx`
- **Pages**: `app/page.tsx`, `app/comparison/page.tsx`
- **Tests**: `__tests__/unit/*.test.ts`

---

## Phase 1: Setup (プロジェクト初期化)

**Purpose**: Next.js プロジェクトの作成と基本構造のセットアップ

- [x] T001 Create Next.js project with `npx create-next-app@latest` (App Router, TypeScript, Tailwind CSS)
- [x] T002 Install dependencies with bun (chart.js, react-chartjs-2)
- [x] T003 [P] Create project directory structure (lib/, components/, __tests__/)
- [x] T004 [P] Configure Tailwind CSS and global styles

---

## Phase 2: Foundational (基盤となるコンポーネント)

**Purpose**: すべてのユーザーストーリーが依存する核となるモデルとユーティリティ

**⚠️ CRITICAL**: この Phase 完了後、ユーザーストーリーの実装を開始できます

- [x] T005 [P] Create type definitions in lib/types.ts (InvestmentPlan, SimulationResult, ChartDataPoint, Scenario, ValidationResult)
- [x] T006 [P] Create constants file in lib/constants.ts (NISA_LIMITS, INPUT_CONSTRAINTS)
- [x] T007 [P] Create number formatter utility in lib/formatters.ts for currency display
- [x] T008 Create calculator service in lib/calculator.ts with calculateSimulation function
- [x] T009 Create validation utility in lib/validation.ts with validateInvestmentPlan function

**Checkpoint**: 基盤準備完了 - ユーザーストーリーの実装を並列開始可能

---

## Phase 3: User Story 1 - 基本的な積立シミュレーション (Priority: P1) 🎯 MVP

**Goal**: ユーザーが毎月の積立額、積立期間、想定利回りを入力し、将来の資産額（元本と運用益を分けて）を確認できる

**Independent Test**: 毎月3万円、20年間、年利5%を入力して「計算する」ボタンを押すことで、正しい将来資産額（約1,233万円）が表示されることを確認できる

### Implementation for User Story 1

- [x] T010 [US1] Implement calculateSimulation method in lib/calculator.ts with compound interest calculation
- [x] T011 [US1] Implement generateChartData method in lib/calculator.ts for graph data points
- [x] T012 [US1] Create main page in app/page.tsx with "use client" directive
- [x] T013 [US1] Add React state management for InvestmentPlan and SimulationResult using useState
- [x] T014 [P] [US1] Create input form section with text fields (積立額, 期間, 利回り)
- [x] T015 [US1] Add input validation using validateInvestmentPlan and display error messages
- [x] T016 [US1] Add calculation button that triggers handleCalculate function
- [x] T017 [P] [US1] Create result display section showing 総資産額, 元本, 運用益
- [x] T018 [US1] Style result cards with Tailwind CSS (green for total, blue for principal, purple for profit)
- [x] T019 [P] [US1] Create InvestmentChart component in components/InvestmentChart.tsx using Chart.js
- [x] T020 [US1] Configure chart to display 元本 (blue line) and 総資産 (green line)
- [x] T021 [US1] Integrate InvestmentChart into main page below result display
- [x] T022 [US1] Format currency values using Intl.NumberFormat for Japanese locale
- [x] T023 [US1] Add disclaimer text at bottom of page

**Checkpoint**: US1 完了 - 基本的な積立シミュレーション機能が完全に動作し、独立してテスト可能

---

## Phase 4: User Story 2 - NISA投資枠の活用状況表示 (Priority: P2)

**Goal**: ユーザーが入力した積立プランがNISA制度の年間投資上限（年間120万円）をどの程度活用しているかを確認でき、枠を超過する場合は警告が表示される

**Independent Test**: 毎月10万円の積立を入力した場合、年間投資額120万円がつみたて投資枠の上限に達していることが表示される

### Implementation for User Story 2

- [x] T024 [US2] Add NISA limit calculations to calculateSimulation (annualInvestment, nisaUtilizationRate, isOverNisaLimit)
- [x] T025 [US2] Create NISA limit indicator section in result display
- [x] T026 [US2] Display annual investment amount (年間投資額) in NISA section
- [x] T027 [US2] Display NISA utilization rate (活用率) as percentage
- [x] T028 [US2] Add conditional styling for NISA section (red background when over limit)
- [x] T029 [US2] Display warning message when isOverNisaLimit is true
- [x] T030 [US2] Add warning icon (⚠️) for visual emphasis

**Checkpoint**: US2 完了 - NISA枠表示機能が動作し、US1と独立してテスト可能

---

## Phase 5: User Story 3 - 運用シナリオ比較 (Priority: P3)

**Goal**: ユーザーが複数の想定利回り（保守的3%、標準5%、楽観的7%）で同時にシミュレーションを実行し、結果を比較できる

**Independent Test**: 毎月3万円、20年間の条件で、3%、5%、7%の3つのシナリオを選択すると、それぞれの将来資産額が並んで表示される

### Implementation for User Story 3

- [x] T031 [US3] Implement calculateMultipleScenarios method in lib/calculator.ts
- [x] T032 [P] [US3] Create comparison page at app/comparison/page.tsx with "use client"
- [x] T033 [US3] Add state management for scenarios and comparison results
- [x] T034 [US3] Define default scenarios (保守的 3%, 標準 5%, 楽観的 7%) with colors
- [x] T035 [P] [US3] Create base input form (monthlyAmount, years) in comparison page
- [x] T036 [US3] Create scenario configuration cards with customizable annual rates
- [x] T037 [US3] Add border styling using scenario colors for visual distinction
- [x] T038 [US3] Implement comparison calculation when user clicks button
- [x] T039 [P] [US3] Create result comparison section showing all 3 scenarios side by side
- [x] T040 [US3] Display scenario cards with color-coded borders and results
- [x] T041 [P] [US3] Create ComparisonChart component in components/ComparisonChart.tsx
- [x] T042 [US3] Configure chart to display 3 lines (different colors) for scenario comparison
- [x] T043 [US3] Add legend to ComparisonChart showing scenario names and colors
- [x] T044 [US3] Add navigation link from main page to comparison page
- [x] T045 [US3] Add back navigation link from comparison page to main page

**Checkpoint**: US3 完了 - シナリオ比較機能が動作し、すべてのユーザーストーリーが独立して機能

---

## Phase 6: Responsive Layout & Polish

**Purpose**: レスポンシブ対応と UI の改善

- [x] T046 Implement 2-column layout for desktop (left: input, right: results) using Tailwind grid
- [x] T047 Implement 1-column layout for mobile (top: input, bottom: results)
- [x] T048 Add responsive breakpoint (lg:grid-cols-2) for desktop/mobile switching
- [x] T049 Update max-width container from max-w-4xl to max-w-7xl for wider layout
- [x] T050 Add responsive padding (p-4 sm:p-8) for mobile and desktop
- [x] T051 Test responsive layout on multiple screen sizes
- [x] T052 [P] Add app title and navigation button styling
- [x] T053 [P] Ensure all colors work in dark mode (dark: variants)

---

## Phase 7: Testing

**Purpose**: ユニットテストの追加と品質保証

- [x] T054 [P] Create calculator unit tests in __tests__/unit/calculator.test.ts
- [x] T055 [P] Test basic compound interest calculation (30k/month, 20 years, 5%)
- [x] T056 [P] Test edge cases (0% rate, negative rate, NISA limit exceeded)
- [x] T057 [P] Test generateChartData function with various inputs
- [x] T058 [P] Test calculateMultipleScenarios with 3 scenarios
- [x] T059 [P] Create validation unit tests in __tests__/unit/validation.test.ts
- [x] T060 [P] Test input validation for monthlyAmount (min: 100)
- [x] T061 [P] Test input validation for years (1-40 range)
- [x] T062 [P] Test input validation for annualRate (-10% to 20% range)
- [x] T063 [P] Test multiple validation errors at once
- [x] T064 [P] Test boundary values (minimum and maximum allowed values)
- [x] T065 Run all tests with `bun test` and verify 100% pass rate
- [x] T066 Run production build with `bun run build` and verify success

---

## Phase 8: Final Verification

**Purpose**: 最終確認とデプロイ準備

- [x] T067 Verify all 3 user stories work independently
- [x] T068 Test navigation between main page and comparison page
- [x] T069 Verify chart displays correctly on both pages
- [x] T070 Verify responsive layout on mobile and desktop
- [x] T071 Run final production build and verify no errors
- [x] T072 Verify all tests pass (18 tests, 68 expect calls)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 依存なし - すぐに開始可能
- **Foundational (Phase 2)**: Setup 完了後 - すべてのユーザーストーリーをブロック
- **User Stories (Phase 3-5)**: すべて Foundational Phase 完了に依存
  - ユーザーストーリーは並列実行可能（スタッフがいる場合）
  - または優先順位順に順次実行（P1 → P2 → P3）
- **Responsive Layout (Phase 6)**: 希望するすべてのユーザーストーリー完了後
- **Testing (Phase 7)**: 実装完了後に並列実行可能
- **Final Verification (Phase 8)**: すべての Phase 完了後

### User Story Dependencies

- **User Story 1 (P1)**: Foundational 完了後に開始可能 - 他のストーリーへの依存なし
- **User Story 2 (P2)**: Foundational 完了後に開始可能 - US1 と統合するが独立してテスト可能
- **User Story 3 (P3)**: Foundational 完了後に開始可能 - US1 の InvestmentPlan を共有するが独立してテスト可能

### Parallel Opportunities

- Foundational の [P] タスク (T005-T009) はすべて並列実行可能
- Foundational 完了後、すべてのユーザーストーリーを並列開始可能（チーム容量がある場合）
- 各ユーザーストーリー内の [P] タスクは並列実行可能
- Testing Phase のすべてのテストは並列実行可能

---

## Task Count Summary

- **Total Tasks**: 72
- **Phase 1 (Setup)**: 4 tasks ✅
- **Phase 2 (Foundational)**: 5 tasks ✅
- **Phase 3 (US1)**: 14 tasks ✅
- **Phase 4 (US2)**: 7 tasks ✅
- **Phase 5 (US3)**: 15 tasks ✅
- **Phase 6 (Responsive)**: 8 tasks ✅
- **Phase 7 (Testing)**: 13 tasks ✅
- **Phase 8 (Verification)**: 6 tasks ✅

**All tasks completed**: 72/72 (100%)

---

## Implementation Strategy

### MVP First (User Story 1 のみ)

1. Phase 1 完了: Setup ✅
2. Phase 2 完了: Foundational ✅
3. Phase 3 完了: User Story 1 ✅
4. 検証: US1 を独立してテスト ✅

### Incremental Delivery（段階的デリバリー）

1. Setup + Foundational 完了 → 基盤準備完了 ✅
2. User Story 1 追加 → 独立してテスト → MVP完了 ✅
3. User Story 2 追加 → 独立してテスト → NISA枠表示追加 ✅
4. User Story 3 追加 → 独立してテスト → シナリオ比較追加 ✅
5. Responsive Layout → デスクトップ・モバイル対応 ✅
6. Testing → 品質保証 ✅

---

## Notes

- **[P] タスク** = 異なるファイル、依存関係なし
- **[Story] ラベル** = タスクを特定のユーザーストーリーにマッピング（追跡可能性のため）
- 各ユーザーストーリーは独立して完成・テスト可能
- Next.js App Router の "use client" ディレクティブが必要なページに使用
- Chart.js コンポーネント登録はクライアントサイドのみで実行
- Tailwind CSS の responsive utilities (sm:, md:, lg:) を活用
- bun をパッケージマネージャーおよびテストランナーとして使用

---

## Current Status

✅ **All phases completed successfully**

- ✅ All 3 user stories implemented and tested
- ✅ Responsive 2-column layout for desktop, 1-column for mobile
- ✅ Chart.js integration with line charts
- ✅ 18 unit tests, 100% pass rate
- ✅ Production build successful
- ✅ Ready for deployment

**Next steps**: Deploy to Vercel or run locally with `bun run dev`
