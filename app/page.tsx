"use client";

import { useState } from "react";
import Link from "next/link";
import type { InvestmentPlan, SimulationResult } from "@/lib/types";
import { calculateSimulation } from "@/lib/calculator";
import { validateInvestmentPlan } from "@/lib/validation";
import { INPUT_CONSTRAINTS } from "@/lib/constants";
import { InvestmentChart } from "@/components/InvestmentChart";

export default function Home() {
  const [plan, setPlan] = useState<InvestmentPlan>({
    monthlyAmount: 30000,
    years: 20,
    annualRate: INPUT_CONSTRAINTS.DEFAULT_ANNUAL_RATE,
  });

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleCalculate = () => {
    const validation = validateInvestmentPlan(plan);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setResult(null);
      return;
    }

    setErrors([]);
    const calculatedResult = calculateSimulation(plan);
    setResult(calculatedResult);
  };

  const handleInputChange = (field: keyof InvestmentPlan, value: number) => {
    setPlan((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 pb-20 font-sans">
      <main className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">
          NISA積立シミュレーター
        </h1>

        {/* ナビゲーション */}
        <div className="flex justify-center mb-8">
          <Link
            href="/comparison"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-md transition-colors"
          >
            複数シナリオ比較 →
          </Link>
        </div>

        {/* 2カラムレイアウト: デスクトップでは左右、モバイルでは上下 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左カラム: 入力フォーム */}
          <div className="space-y-6">
            {/* 入力フォーム */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">積立条件を入力</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                毎月の積立額（円）
              </label>
              <input
                type="number"
                value={plan.monthlyAmount}
                onChange={(e) => handleInputChange("monthlyAmount", Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                min={INPUT_CONSTRAINTS.MIN_MONTHLY_AMOUNT}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                積立期間（年）
              </label>
              <input
                type="number"
                value={plan.years}
                onChange={(e) => handleInputChange("years", Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                min={INPUT_CONSTRAINTS.MIN_YEARS}
                max={INPUT_CONSTRAINTS.MAX_YEARS}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                想定年利回り（%）
              </label>
              <input
                type="number"
                value={plan.annualRate}
                onChange={(e) => handleInputChange("annualRate", Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                min={INPUT_CONSTRAINTS.MIN_ANNUAL_RATE}
                max={INPUT_CONSTRAINTS.MAX_ANNUAL_RATE}
                step="0.1"
              />
            </div>

            <button
              onClick={handleCalculate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition-colors"
            >
              計算する
            </button>
          </div>

          {/* エラー表示 */}
          {errors.length > 0 && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 rounded-md">
              <p className="font-semibold text-red-800 dark:text-red-200 mb-2">入力エラー:</p>
              <ul className="list-disc list-inside text-red-700 dark:text-red-300">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
            </div>
          </div>

          {/* 右カラム: 結果表示 */}
          {result && (
            <div className="space-y-6">
              {/* 結果表示 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">シミュレーション結果</h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">総資産額</p>
                      <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                        {result.totalAssets.toLocaleString('ja-JP')}円
                      </p>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">元本合計</p>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                        {result.totalPrincipal.toLocaleString('ja-JP')}円
                      </p>
                    </div>

                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">運用益</p>
                      <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                        {result.totalProfit.toLocaleString('ja-JP')}円
                      </p>
                    </div>
                  </div>

                  {/* NISA枠情報 */}
                  <div className={`p-4 rounded-md ${
                    result.isOverNisaLimit
                      ? 'bg-red-50 dark:bg-red-900/20 border border-red-400'
                      : 'bg-gray-50 dark:bg-gray-900/20'
                  }`}>
                    <p className="text-sm font-medium mb-2">NISA投資枠の活用状況</p>
                    <p className="text-lg">
                      年間投資額: <span className="font-semibold">{result.annualInvestment.toLocaleString('ja-JP')}円</span>
                    </p>
                    <p className="text-lg">
                      活用率: <span className="font-semibold">{(result.nisaUtilizationRate * 100).toFixed(1)}%</span>
                    </p>
                    {result.isOverNisaLimit && (
                      <p className="mt-2 text-red-700 dark:text-red-300 font-semibold">
                        ⚠️ 年間投資額がNISA枠（120万円）を超過しています
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* グラフ表示 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <InvestmentChart chartData={result.chartData} />
              </div>
            </div>
          )}
        </div>

        {/* 免責事項 */}
        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-400 rounded-md">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            ※ 本シミュレーションは参考値であり、実際の運用結果を保証するものではありません。投資判断は自己責任で行ってください。
          </p>
        </div>
      </main>
    </div>
  );
}
