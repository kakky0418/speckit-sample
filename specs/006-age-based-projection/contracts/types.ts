// contracts/types.ts
// TypeScript 型定義契約 - 年齢ベース資産予測機能

/**
 * 投資計画（拡張版）
 * 既存の InvestmentPlan に currentAge を追加
 */
export interface InvestmentPlanWithAge extends InvestmentPlan {
  /**
   * 現在の年齢（歳）
   * - オプション: 未入力の場合は年齢ベース機能を使用しない
   * - バリデーション: 1-120、整数のみ
   */
  currentAge?: number;
}

/**
 * 基本の投資計画（既存）
 */
export interface InvestmentPlan {
  /** 毎月の積立額（円） */
  monthlyAmount: number;
  /** 積立期間（年） */
  years: number;
  /** 想定年利回り（%） */
  annualRate: number;
  /** 初回投資額（円、オプション） */
  initialAmount?: number;
}

/**
 * マイルストーン情報（P2 用）
 * 節目の年齢での資産額を表す
 */
export interface Milestone {
  /** マイルストーン年齢（例: 40, 50, 60） */
  age: number;
  /** 現在からの経過年数 */
  yearFromNow: number;
  /** その年齢時点での総資産額（円） */
  assets: number;
}

/**
 * 逆算機能のパラメータ（P3 用）
 */
export interface ReverseCalculationParams {
  /** 現在の年齢（歳） */
  currentAge: number;
  /** 目標年齢（歳） */
  targetAge: number;
  /** 目標資産額（円） */
  targetAmount: number;
  /** 想定年利回り（%） */
  annualRate: number;
  /** 初回投資額（円、オプション） */
  initialAmount?: number;
}

/**
 * 逆算機能の結果（P3 用）
 */
export interface ReverseCalculationResult {
  /** 必要な毎月の積立額（円） */
  requiredMonthlyAmount: number;
  /** 積立期間（年） */
  years: number;
  /** 現実的かどうか（月額 100 万円以下を現実的と判定） */
  isRealistic: boolean;
  /** 警告メッセージ（非現実的な場合） */
  warningMessage: string | null;
}

/**
 * バリデーション結果
 */
export interface ValidationResult {
  /** バリデーションが成功したかどうか */
  isValid: boolean;
  /** エラーメッセージの配列 */
  errors: string[];
}
