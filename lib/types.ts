// lib/types.ts

export interface InvestmentPlan {
  monthlyAmount: number;
  years: number;
  annualRate: number;
}

export interface SimulationResult {
  totalAssets: number;
  totalPrincipal: number;
  totalProfit: number;
  annualInvestment: number;
  nisaUtilizationRate: number;
  isOverNisaLimit: boolean;
  chartData: ChartDataPoint[];
}

export interface ChartDataPoint {
  year: number;
  principal: number;
  totalAssets: number;
}

export interface Scenario {
  name: string;
  annualRate: number;
  result: SimulationResult;
  color: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// 税金比較結果の型定義
export interface TaxComparisonResult {
  nisa: {
    totalAssets: number;      // 総資産額（税引前と同じ）
    tax: number;               // 税金（常に 0）
    netAssets: number;         // 手取り総資産（税引後）
  };
  tokutei: {
    totalAssetsBeforeTax: number;  // 総資産額（税引前）
    tax: number;                    // 税金（運用益 × 0.20315）
    netAssets: number;              // 手取り総資産（税引後）
  };
  taxSavings: number;         // 節税額（NISA のメリット）
  principal: number;          // 元本合計
  profitBeforeTax: number;    // 運用益（税引前）
}

// 年次ごとの税金データ（グラフ用）
export interface YearlyTaxData {
  year: number;               // 経過年数
  principal: number;          // 元本累計
  nisaNetAssets: number;      // NISA の手取り総資産
  tokuteiNetAssets: number;   // 特定口座の手取り総資産
  taxAmount: number;          // その年までの累積税金額
}
