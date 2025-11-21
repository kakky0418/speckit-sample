---

description: "機能実装用のタスクリストテンプレート"
---

# タスクリスト: [FEATURE NAME]

**入力**: `/specs/[###-feature-name]/` の設計ドキュメント  
**前提**: plan.md（必須）、spec.md（ユーザーストーリーに必須）、research.md、data-model.md、contracts/

**テスト**: 以下のサンプルにはテストタスクが含まれています。テストは任意であり、仕様で明示された場合のみ含めてください。

**構成**: 各ユーザーストーリーを独立して実装・テストできるようにグルーピングします。

## 記法: `[ID] [P?] [Story] 説明`

- **[P]**: 並行実行可（異なるファイルで依存がない場合）
- **[Story]**: 属するユーザーストーリー（例: US1, US2, US3）
- 説明には正確なファイルパスを含めること

## パス規約

- **単一プロジェクト**: `src/`, `tests/` をリポジトリ直下に配置
- **Web**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` もしくは `android/src/`
- 以下のパスは単一プロジェクト前提。plan.md の構成に合わせて調整すること

<!-- 
  ============================================================================
  重要: 以下はサンプルです。実際のタスクは /speckit.tasks が生成します。
  
  /speckit.tasks で参照するもの:
  - spec.md のユーザーストーリー（優先度 P1, P2, P3...）
  - plan.md の機能要件
  - data-model.md のエンティティ
  - contracts/ のエンドポイント・契約
  
  タスクは各ユーザーストーリーが単独で:
  - 実装できる
  - テストできる
  - MVP として価値を出せる
  ように構成する。
  
  サンプルのまま tasks.md に残さないこと。
  ============================================================================
-->

## Phase 1: Setup（共通基盤）

**目的**: プロジェクト初期化と基本構造整備

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize [language] project with [framework] dependencies
- [ ] T003 [P] Configure linting and formatting tools

---

## Phase 2: Foundational（必須ブロッカー）

**目的**: すべての User Story に先立ち完了させる基盤

**⚠️ CRITICAL**: このフェーズ完了前に User Story 着手不可

（例。プロジェクトに合わせて調整）

- [ ] T004 Setup database schema and migrations framework
- [ ] T005 [P] Implement authentication/authorization framework
- [ ] T006 [P] Setup API routing and middleware structure
- [ ] T007 Create base models/entities that all stories depend on
- [ ] T008 Configure error handling and logging infrastructure
- [ ] T009 Setup environment configuration management

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [このストーリーが提供する価値を簡潔に]

**Independent Test**: [単独で機能を検証する方法]

### Tests for User Story 1（任意。テストが要求された場合のみ）⚠️

> **NOTE: 先にテストを書き、実装前に必ず失敗を確認すること**

- [ ] T010 [P] [US1] Contract test for [endpoint] in tests/contract/test_[name].py
- [ ] T011 [P] [US1] Integration test for [user journey] in tests/integration/test_[name].py

### Implementation for User Story 1

- [ ] T012 [P] [US1] Create [Entity1] model in src/models/[entity1].py
- [ ] T013 [P] [US1] Create [Entity2] model in src/models/[entity2].py
- [ ] T014 [US1] Implement [Service] in src/services/[service].py (depends on T012, T013)
- [ ] T015 [US1] Implement [endpoint/feature] in src/[location]/[file].py
- [ ] T016 [US1] Add validation and error handling
- [ ] T017 [US1] Add logging for user story 1 operations

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [このストーリーが提供する価値を簡潔に]

**Independent Test**: [単独で機能を検証する方法]

### Tests for User Story 2（任意。テストが要求された場合のみ）⚠️

- [ ] T018 [P] [US2] Contract test for [endpoint] in tests/contract/test_[name].py
- [ ] T019 [P] [US2] Integration test for [user journey] in tests/integration/test_[name].py

### Implementation for User Story 2

- [ ] T020 [P] [US2] Create [Entity] model in src/models/[entity].py
- [ ] T021 [US2] Implement [Service] in src/services/[service].py
- [ ] T022 [US2] Implement [endpoint/feature] in src/[location]/[file].py
- [ ] T023 [US2] Integrate with User Story 1 components (if needed)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [このストーリーが提供する価値を簡潔に]

**Independent Test**: [単独で機能を検証する方法]

### Tests for User Story 3（任意。テストが要求された場合のみ）⚠️

- [ ] T024 [P] [US3] Contract test for [endpoint] in tests/contract/test_[name].py
- [ ] T025 [P] [US3] Integration test for [user journey] in tests/integration/test_[name].py

### Implementation for User Story 3

- [ ] T026 [P] [US3] Create [Entity] model in src/models/[entity].py
- [ ] T027 [US3] Implement [Service] in src/services/[service].py
- [ ] T028 [US3] Implement [endpoint/feature] in src/[location]/[file].py

**Checkpoint**: All user stories should now be independently functional

---

[必要に応じて追加の User Story フェーズを同形式で記述]

---

## Phase N: Polish & 横断的対応

**目的**: 複数ストーリーにまたがる改善

- [ ] TXXX [P] Documentation updates in docs/
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Performance optimization across all stories
- [ ] TXXX [P] Additional unit tests (if requested) in tests/unit/
- [ ] TXXX Security hardening
- [ ] TXXX Run quickstart.md validation

---

## 依存関係と実行順序

### フェーズ依存

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- テスト（含める場合）は実装前に書き、失敗を確認する
- Models → Services → Endpoints の順
- コア実装の後に統合
- 次の優先度へ進む前にストーリーを完了

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## 並行実行例: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for [endpoint] in tests/contract/test_[name].py"
Task: "Integration test for [user journey] in tests/integration/test_[name].py"

# Launch all models for User Story 1 together:
Task: "Create [Entity1] model in src/models/[entity1].py"
Task: "Create [Entity2] model in src/models/[entity2].py"
```

---

## 実装ストラテジー

### MVP First（User Story 1 に集中）

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery（段階追加）

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy（複数人で並行）

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] タスク = 異なるファイルで依存なし
- [Story] ラベルで追跡性を確保
- 各ユーザーストーリーは独立して完結・テスト可能にする
- 実装前にテストが失敗することを確認
- タスクごと、または論理的なまとまりでコミット
- 任意のチェックポイントでストーリー単位の検証を行う
- 避けること: 曖昧なタスク、同一ファイル競合、ストーリー跨ぎの不要な依存
