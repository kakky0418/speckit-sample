"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { InvestmentPlan } from "@/lib/types";

// Context の型定義
interface InvestmentPlanContextType {
  plan: InvestmentPlan;
  setPlan: (plan: InvestmentPlan) => void;
  updatePlan: (field: keyof InvestmentPlan, value: number) => void;
}

// デフォルト値
const defaultPlan: InvestmentPlan = {
  monthlyAmount: 30000,
  years: 20,
  annualRate: 5,
};

// Context の作成
const InvestmentPlanContext = createContext<InvestmentPlanContextType | undefined>(
  undefined
);

// Provider コンポーネント
export function InvestmentPlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<InvestmentPlan>(defaultPlan);

  // 個別フィールドの更新用ヘルパー関数
  const updatePlan = (field: keyof InvestmentPlan, value: number) => {
    setPlan((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <InvestmentPlanContext.Provider value={{ plan, setPlan, updatePlan }}>
      {children}
    </InvestmentPlanContext.Provider>
  );
}

// カスタムフック
export function useInvestmentPlan() {
  const context = useContext(InvestmentPlanContext);
  if (context === undefined) {
    throw new Error("useInvestmentPlan must be used within InvestmentPlanProvider");
  }
  return context;
}
