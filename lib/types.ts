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
