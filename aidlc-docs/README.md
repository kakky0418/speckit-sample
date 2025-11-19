# AI-DLC ドキュメント管理ルール

このフォルダーには、AI-Driven Development Lifecycle に従って作成されたすべてのドキュメントが保存されます。

## 📁 フォルダー構造

```
aidlc-docs/
├── README.md                    # このファイル（ルール説明）
├── prompts.md                   # プロンプト履歴（順番に記録）
├── plans/                       # 実行計画
│   └── [plan-YYYYMMDD-N].md    # 各計画ファイル
├── requirements/                # 要件・機能変更ドキュメント
│   └── [requirement-NAME].md   # 要件定義
├── story-artifacts/             # ユーザーストーリー
│   └── [story-NAME].md         # ユーザーストーリー定義
└── design-artifacts/            # アーキテクチャ・設計ドキュメント
    └── [design-NAME].md        # 設計ドキュメント
```

---

## 🔄 ワークフロールール

### 1. **作業前に計画を立てる**
- すべての作業は、事前に計画を `aidlc-docs/plans/` に作成
- 計画ファイル名: `plan-YYYYMMDD-N.md` (N は連番)
- 計画には以下を含める:
  - 作業の目的
  - 実施内容
  - 影響範囲
  - 完了条件

### 2. **ユーザーの承認を得る**
- 計画を提示し、ユーザーからの承認を待つ
- 承認された計画のみを実行する

### 3. **ドキュメントを適切な場所に保存**
- **要件・機能変更** → `aidlc-docs/requirements/`
- **ユーザーストーリー** → `aidlc-docs/story-artifacts/`
- **アーキテクチャ・設計** → `aidlc-docs/design-artifacts/`

### 4. **プロンプト履歴を記録**
- すべてのユーザープロンプトを `aidlc-docs/prompts.md` に記録
- 対応内容も簡潔に記録

---

## 📝 ドキュメント分類ガイド

### `requirements/` - 要件・機能変更ドキュメント
**保存するもの**:
- 機能要件定義
- 非機能要件定義
- 制約事項
- ビジネスルール

**例**:
- `requirement-nisa-simulator.md` - NISA シミュレーターの要件
- `requirement-authentication.md` - 認証機能の要件

---

### `story-artifacts/` - ユーザーストーリー
**保存するもの**:
- User Story（Unit）の定義
- Acceptance Criteria（受け入れ基準）
- Independent Test（独立テスト方法）

**例**:
- `story-us1-basic-simulation.md` - 基本的な積立シミュレーション
- `story-us2-nisa-limit.md` - NISA 枠表示
- `story-us3-scenario-comparison.md` - シナリオ比較

---

### `design-artifacts/` - アーキテクチャ・設計ドキュメント
**保存するもの**:
- システムアーキテクチャ
- データモデル
- API 設計
- コンポーネント設計
- 技術選定理由

**例**:
- `design-architecture.md` - システム全体のアーキテクチャ
- `design-data-model.md` - データモデル定義
- `design-calculator-service.md` - 計算サービスの設計

---

### `plans/` - 実行計画
**保存するもの**:
- 作業計画
- タスク分解
- 実施順序
- 完了条件

**例**:
- `plan-20251118-1.md` - グラフ表示追加の計画
- `plan-20251118-2.md` - テスト追加の計画

---

## ✅ チェックリスト

作業前に以下を確認してください:

- [ ] 計画を `aidlc-docs/plans/` に作成した
- [ ] ユーザーから承認を得た
- [ ] 実行後、関連ドキュメントを適切なフォルダーに保存した
- [ ] プロンプト履歴を `aidlc-docs/prompts.md` に記録した

---

## 🔗 関連ドキュメント

- [Intent, Unit, Bolt の関係](./design-artifacts/) - AI-DLC の基本概念
- [プロンプト履歴](./prompts.md) - すべての作業履歴

---

## 📅 作成日

2025-11-18

## 📝 最終更新

2025-11-18
