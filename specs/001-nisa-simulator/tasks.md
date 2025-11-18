# Tasks: NISA積立シミュレーター

**Input**: Design documents from `/specs/001-nisa-simulator/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: テストタスクは含まれていません。必要に応じて追加してください。

**Organization**: タスクはユーザーストーリーごとにグループ化されており、各ストーリーを独立して実装・テストできます。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 並列実行可能（異なるファイル、依存関係なし）
- **[Story]**: タスクが属するユーザーストーリー（例: US1, US2, US3）
- 説明に正確なファイルパスを含める

## Path Conventions

Flutter プロジェクトの標準的な Feature-First 構造：
- **Models**: `nisa_simulator/lib/models/`
- **Services**: `nisa_simulator/lib/services/`
- **UI**: `nisa_simulator/lib/ui/`
- **Utils**: `nisa_simulator/lib/utils/`
- **Tests**: `nisa_simulator/test/`

---

## Phase 1: Setup (プロジェクト初期化)

**Purpose**: Flutter プロジェクトの作成と基本構造のセットアップ

- [ ] T001 Create Flutter Web project with `flutter create --platforms web nisa_simulator`
- [ ] T002 Configure pubspec.yaml with dependencies (provider ^6.1.0, fl_chart ^0.66.0, intl ^0.19.0)
- [ ] T003 [P] Install dependencies with `flutter pub get`
- [ ] T004 [P] Create project directory structure (lib/models, lib/services, lib/ui, lib/utils, test/)
- [ ] T005 [P] Configure Flutter lints in analysis_options.yaml

---

## Phase 2: Foundational (基盤となるコンポーネント)

**Purpose**: すべてのユーザーストーリーが依存する核となるモデルとユーティリティ

**⚠️ CRITICAL**: この Phase 完了後、ユーザーストーリーの実装を開始できます

- [ ] T006 [P] Create InvestmentPlan model in lib/models/investment_plan.dart with fields (monthlyAmount, years, annualRate)
- [ ] T007 [P] Create SimulationResult model in lib/models/simulation_result.dart with all fields per data-model.md
- [ ] T008 [P] Create ChartDataPoint model in lib/models/chart_data_point.dart with (year, principal, totalAssets)
- [ ] T009 [P] Create constants file in lib/utils/constants.dart (NISA_LIMIT, MIN_MONTHLY_AMOUNT, etc.)
- [ ] T010 [P] Create number formatter utility in lib/utils/formatters.dart for currency display

**Checkpoint**: 基盤準備完了 - ユーザーストーリーの実装を並列開始可能

---

## Phase 3: User Story 1 - 基本的な積立シミュレーション (Priority: P1) 🎯 MVP

**Goal**: ユーザーが毎月の積立額、積立期間、想定利回りを入力し、将来の資産額（元本と運用益を分けて）を確認できる

**Independent Test**: 毎月3万円、20年間、年利5%を入力して「計算する」ボタンを押すことで、正しい将来資産額（約1,233万円）が表示されることを確認できる

### Implementation for User Story 1

- [ ] T011 [US1] Implement CalculatorService in lib/services/calculator_service.dart with calculateSimulation method
- [ ] T012 [US1] Implement _generateChartData method in CalculatorService for graph data points
- [ ] T013 [US1] Create InvestmentPlanProvider in lib/providers/investment_plan_provider.dart using ChangeNotifier
- [ ] T014 [US1] Create SimulationResultProvider in lib/providers/simulation_result_provider.dart using ChangeNotifier
- [ ] T015 [P] [US1] Create SimulatorScreen in lib/ui/screens/simulator_screen.dart with basic layout
- [ ] T016 [P] [US1] Create InputForm widget in lib/ui/widgets/input_form.dart with text fields (積立額, 期間, 利回り)
- [ ] T017 [US1] Add input validation to InputForm (monthlyAmount >= 100, years 1-40, annualRate -10~20)
- [ ] T018 [P] [US1] Create ResultDisplay widget in lib/ui/widgets/result_display.dart showing 総資産額, 元本, 運用益
- [ ] T019 [P] [US1] Create ChartWidget in lib/ui/widgets/chart_widget.dart using fl_chart LineChart
- [ ] T020 [US1] Configure ChartWidget to display 元本 (blue line) and 総資産 (green line)
- [ ] T021 [US1] Wire InputForm to InvestmentPlanProvider and trigger calculation on button press
- [ ] T022 [US1] Wire ResultDisplay to SimulationResultProvider to show calculated results
- [ ] T023 [US1] Update main.dart to provide InvestmentPlanProvider and SimulationResultProvider
- [ ] T024 [US1] Add error handling for invalid inputs and display error messages in InputForm
- [ ] T025 [US1] Format currency values using formatters.dart utility in ResultDisplay

**Checkpoint**: US1 完了 - 基本的な積立シミュレーション機能が完全に動作し、独立してテスト可能

---

## Phase 4: User Story 2 - NISA投資枠の活用状況表示 (Priority: P2)

**Goal**: ユーザーが入力した積立プランがNISA制度の年間投資上限（年間120万円）をどの程度活用しているかを確認でき、枠を超過する場合は警告が表示される

**Independent Test**: 毎月10万円の積立を入力した場合、年間投資額120万円がつみたて投資枠の上限に達していることが表示される

### Implementation for User Story 2

- [ ] T026 [P] [US2] Create NisaLimitIndicator widget in lib/ui/widgets/nisa_limit_indicator.dart
- [ ] T027 [US2] Display annual investment amount (年間投資額) in NisaLimitIndicator
- [ ] T028 [US2] Display NISA utilization rate (活用率) as percentage in NisaLimitIndicator
- [ ] T029 [US2] Add visual indicator (progress bar or gauge) for NISA utilization rate
- [ ] T030 [US2] Implement warning display when isOverNisaLimit is true (red background, warning icon)
- [ ] T031 [US2] Add warning message showing excess amount when over limit (e.g., "120,000円超過")
- [ ] T032 [US2] Integrate NisaLimitIndicator into ResultDisplay widget below main results
- [ ] T033 [US2] Add color coding (green: <80%, yellow: 80-100%, red: >100%) for utilization indicator
- [ ] T034 [US2] Add disclaimer text about NISA rules at bottom of NisaLimitIndicator

**Checkpoint**: US2 完了 - NISA枠表示機能が動作し、US1と独立してテスト可能

---

## Phase 5: User Story 3 - 運用シナリオ比較 (Priority: P3)

**Goal**: ユーザーが複数の想定利回り（保守的3%、標準5%、楽観的7%）で同時にシミュレーションを実行し、結果を比較できる

**Independent Test**: 毎月3万円、20年間の条件で、3%、5%、7%の3つのシナリオを選択すると、それぞれの将来資産額が並んで表示される

### Implementation for User Story 3

- [ ] T035 [P] [US3] Create Scenario model in lib/models/scenario.dart with (name, annualRate, result, color)
- [ ] T036 [US3] Create ScenarioProvider in lib/providers/scenario_provider.dart using ChangeNotifier
- [ ] T037 [US3] Implement calculateMultipleScenarios method in CalculatorService
- [ ] T038 [US3] Add predefined scenarios (保守的 3%, 標準 5%, 楽観的 7%) in ScenarioProvider
- [ ] T039 [P] [US3] Create ComparisonScreen in lib/ui/screens/comparison_screen.dart
- [ ] T040 [P] [US3] Create ScenarioCard widget in lib/ui/widgets/scenario_card.dart to display single scenario result
- [ ] T041 [US3] Create scenario selection UI in ComparisonScreen (3 cards for predefined scenarios)
- [ ] T042 [US3] Allow user to customize annual rate for each scenario (input field in ScenarioCard)
- [ ] T043 [US3] Calculate all 3 scenarios when user inputs base plan (monthlyAmount, years)
- [ ] T044 [P] [US3] Create ComparisonChartWidget in lib/ui/widgets/comparison_chart_widget.dart
- [ ] T045 [US3] Display 3 lines (different colors) in ComparisonChartWidget for scenario comparison
- [ ] T046 [US3] Add legend to ComparisonChartWidget showing scenario names and colors
- [ ] T047 [US3] Add navigation between SimulatorScreen and ComparisonScreen (button or tab)
- [ ] T048 [US3] Share InvestmentPlan (base) between both screens via provider
- [ ] T049 [US3] Update main.dart to provide ScenarioProvider

**Checkpoint**: US3 完了 - シナリオ比較機能が動作し、すべてのユーザーストーリーが独立して機能

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 複数のユーザーストーリーに影響する改善と仕上げ

- [ ] T050 [P] Add app title and branding to AppBar in SimulatorScreen
- [ ] T051 [P] Improve responsive layout for mobile and desktop browsers
- [ ] T052 [P] Add loading states or animations during calculations (if needed)
- [ ] T053 [P] Add accessibility labels and semantic widgets for screen readers
- [ ] T054 [P] Add color-blind friendly color scheme (beyond just color differentiation)
- [ ] T055 Add disclaimer text at bottom of app ("本シミュレーションは参考値であり...")
- [ ] T056 [P] Add app icon and favicon for web deployment
- [ ] T057 [P] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] T058 Test all edge cases from spec.md (極端な値, マイナス利回り, 小数点入力, etc.)
- [ ] T059 [P] Create README.md with project description and setup instructions
- [ ] T060 Run `flutter analyze` and fix all lint warnings
- [ ] T061 Run `flutter format lib test` to ensure consistent code style
- [ ] T062 Verify quickstart.md instructions work end-to-end
- [ ] T063 Final end-to-end testing of all 3 user stories

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 依存なし - すぐに開始可能
- **Foundational (Phase 2)**: Setup 完了後 - すべてのユーザーストーリーをブロック
- **User Stories (Phase 3-5)**: すべて Foundational Phase 完了に依存
  - ユーザーストーリーは並列実行可能（スタッフがいる場合）
  - または優先順位順に順次実行（P1 → P2 → P3）
- **Polish (Phase 6)**: 希望するすべてのユーザーストーリー完了後

### User Story Dependencies

- **User Story 1 (P1)**: Foundational 完了後に開始可能 - 他のストーリーへの依存なし
- **User Story 2 (P2)**: Foundational 完了後に開始可能 - US1 と統合するが独立してテスト可能
- **User Story 3 (P3)**: Foundational 完了後に開始可能 - US1 の InvestmentPlan を共有するが独立してテスト可能

### Within Each User Story

- モデル → サービス → プロバイダー → UI ウィジェット → 統合の順
- 並列タスク [P] は同時実行可能
- ストーリー完了後、次の優先順位に移行

### Parallel Opportunities

- Setup の [P] タスクはすべて並列実行可能
- Foundational の [P] タスク (T006-T010) はすべて並列実行可能
- Foundational 完了後、すべてのユーザーストーリーを並列開始可能（チーム容量がある場合）
- 各ユーザーストーリー内の [P] タスクは並列実行可能
- 異なるユーザーストーリーは異なるチームメンバーが並列作業可能

---

## Parallel Example: User Story 1

```bash
# US1 の並列実行可能なタスクを一緒に起動:
Task: "Create SimulatorScreen in lib/ui/screens/simulator_screen.dart"
Task: "Create InputForm widget in lib/ui/widgets/input_form.dart"
Task: "Create ResultDisplay widget in lib/ui/widgets/result_display.dart"
Task: "Create ChartWidget in lib/ui/widgets/chart_widget.dart"

# 依存関係があるタスクは順次実行:
1. First: T011-T014 (Services and Providers)
2. Then: T015-T020 (UI Components in parallel)
3. Finally: T021-T025 (Integration and wiring)
```

---

## Implementation Strategy

### MVP First (User Story 1 のみ)

1. Phase 1 完了: Setup
2. Phase 2 完了: Foundational (**重要** - すべてのストーリーをブロック)
3. Phase 3 完了: User Story 1
4. **停止して検証**: US1 を独立してテスト
5. 準備ができたらデプロイ/デモ

### Incremental Delivery（段階的デリバリー）

1. Setup + Foundational 完了 → 基盤準備完了
2. User Story 1 追加 → 独立してテスト → デプロイ/デモ（MVP!）
3. User Story 2 追加 → 独立してテスト → デプロイ/デモ
4. User Story 3 追加 → 独立してテスト → デプロイ/デモ
5. 各ストーリーが以前のストーリーを壊すことなく価値を追加

### Parallel Team Strategy（並列チーム戦略）

複数の開発者がいる場合:

1. チーム全体で Setup + Foundational を完了
2. Foundational 完了後:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. ストーリーを独立して完成・統合

---

## Task Count Summary

- **Total Tasks**: 63
- **Phase 1 (Setup)**: 5 tasks
- **Phase 2 (Foundational)**: 5 tasks
- **Phase 3 (US1)**: 15 tasks
- **Phase 4 (US2)**: 9 tasks
- **Phase 5 (US3)**: 15 tasks
- **Phase 6 (Polish)**: 14 tasks

### Parallel Opportunities

- **Setup phase**: 3 parallel tasks (T003, T004, T005)
- **Foundational phase**: 5 parallel tasks (T006-T010 all parallel)
- **User Story 1**: 6 parallel tasks (T015, T016, T018, T019 - UI widgets)
- **User Story 2**: 2 parallel tasks (T026, T033)
- **User Story 3**: 6 parallel tasks (T035, T039, T040, T044 - models and widgets)
- **Polish phase**: 10 parallel tasks (most documentation and testing tasks)

**Total Parallel Tasks**: 32 tasks marked [P]

---

## Notes

- **[P] タスク** = 異なるファイル、依存関係なし
- **[Story] ラベル** = タスクを特定のユーザーストーリーにマッピング（追跡可能性のため）
- 各ユーザーストーリーは独立して完成・テスト可能であるべき
- 各タスクまたは論理的なグループの後にコミット
- 各チェックポイントで停止してストーリーを独立して検証
- 避けるべき: 曖昧なタスク、同じファイルの競合、独立性を壊すストーリー間の依存関係

---

## Suggested MVP Scope

**推奨 MVP**: User Story 1 のみ

User Story 1（基本的な積立シミュレーション）だけで、ユーザーに十分な価値を提供できます:
- 複利計算による将来資産額の表示
- 元本と運用益の明確な区別
- グラフによる視覚的な理解
- 入力バリデーションとエラーハンドリング

US1 完成後、ユーザーフィードバックに基づいて US2（NISA枠表示）と US3（シナリオ比較）を追加できます。
