# 実装計画: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]  
**Input**: `/specs/[###-feature-name]/spec.md` の機能仕様

**備考**: このテンプレートは `/speckit.plan` コマンドで自動生成されます。実行手順は `.specify/templates/commands/plan.md` を参照してください。

## サマリー

[feature spec から主要要件とリサーチで決めた技術アプローチを抜粋]

## 技術コンテキスト

<!-- プロジェクトに合わせて置き換えてください -->

**Language/Version**: [例: Python 3.11, Swift 5.9, Rust 1.75 など／未定なら NEEDS CLARIFICATION]  
**Primary Dependencies**: [例: FastAPI, UIKit, LLVM など／未定なら NEEDS CLARIFICATION]  
**Storage**: [例: PostgreSQL, CoreData, ファイル, N/A など]  
**Testing**: [例: pytest, XCTest, cargo test など／未定なら NEEDS CLARIFICATION]  
**Target Platform**: [例: Linux server, iOS 15+, WASM など／未定なら NEEDS CLARIFICATION]  
**Project Type**: [single / web / mobile など。構成に影響]  
**Performance Goals**: [ドメイン別指標例: 1000 req/s, 60 fps など／NEEDS CLARIFICATION]  
**Constraints**: [ドメイン別制約例: p95 <200ms, メモリ <100MB, オフライン対応 など]  
**Scale/Scope**: [規模例: 1 万ユーザー, 50 画面, 1M LOC など／NEEDS CLARIFICATION]

## 憲法チェック

*ゲート: Phase 0 リサーチ前に確認。Phase 1 設計後に再確認。*  
[憲法ファイルに基づくゲート判定を記載]

## プロジェクト構造

### ドキュメント（本機能）

```text
specs/[###-feature]/
├── plan.md              # 本ファイル（/speckit.plan 出力）
├── research.md          # Phase 0 (/speckit.plan 出力)
├── data-model.md        # Phase 1 (/speckit.plan 出力)
├── quickstart.md        # Phase 1 (/speckit.plan 出力)
├── contracts/           # Phase 1 (/speckit.plan 出力)
└── tasks.md             # Phase 2 (/speckit.tasks 出力: /speckit.plan では作らない)
```

### ソースコード（リポジトリ直下）
<!-- 下記は例。不要なオプションは削除し、実際の構成に書き換える -->

```text
# 例) 単一プロジェクト構成
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# 例) Web (frontend + backend)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# 例) Mobile + API
api/
└── [backend と同様]

ios/ or android/
└── [プラットフォーム別のモジュール/画面/テスト構成]
```

**Structure Decision**: [採用した構成と実ディレクトリを記述]

## Complexity Tracking

> **憲法チェックで違反がある場合のみ記入（理由を正当化）**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [例: 4 つ目のプロジェクト] | [必要理由] | [なぜ 3 つでは不足か] |
| [例: Repository パターン] | [必要理由] | [なぜ単純な DB 直叩きでは不足か] |
