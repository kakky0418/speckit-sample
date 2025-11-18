"use client";

import { useState } from "react";
import Link from "next/link";
import type { InvestmentPlan, Scenario } from "@/lib/types";
import { calculateMultipleScenarios } from "@/lib/calculator";
import { validateInvestmentPlan } from "@/lib/validation";
import { INPUT_CONSTRAINTS } from "@/lib/constants";
import { ComparisonChart } from "@/components/ComparisonChart";

// デフォルトシナリオ設定
const DEFAULT_SCENARIOS = [
  { name: "保守的", annualRate: 3, color: "rgb(251, 146, 60)" }, // orange
  { name: "標準", annualRate: 5, color: "rgb(59, 130, 246)" }, // blue
  { name: "楽観的", annualRate: 7, color: "rgb(34, 197, 94)" }, // green
];

export default function ComparisonPage() {
  const [plan, setPlan] = useState<InvestmentPlan>({
    monthlyAmount: 30000,
    years: 20,
    annualRate: INPUT_CONSTRAINTS.DEFAULT_ANNUAL_RATE,
  });

  const [scenarios, setScenarios] = useState(DEFAULT_SCENARIOS);
  const [results, setResults] = useState<Scenario[] | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleCalculate = () => {
    const validation = validateInvestmentPlan(plan);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setResults(null);
      return;
    }

    setErrors([]);
    const calculatedResults = calculateMultipleScenarios(plan, scenarios);
    setResults(calculatedResults);
  };

  const handleInputChange = (field: keyof InvestmentPlan, value: number) => {
    setPlan((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleScenarioRateChange = (index: number, newRate: number) => {
    setScenarios((prev) =>
      prev.map((scenario, i) =>
        i === index ? { ...scenario, annualRate: newRate } : scenario
      )
    );
  };

  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-sans">
      <main className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4 inline-block"
          >
            ← 基本シミュレーターに戻る
          </Link>
          <h1 className="text-3xl font-bold text-center">
            運用シナリオ比較
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mt-2">
            複数の想定利回りで同時にシミュレーションを実行し、結果を比較できます
          </p>
        </div>

        {/* 基本条件入力フォーム */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">基本条件を入力</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* シナリオ設定 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">シナリオ設定</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {scenarios.map((scenario, index) => (
              <div
                key={index}
                className="p-4 border-2 rounded-md"
                style={{ borderColor: scenario.color }}
              >
                <p className="font-semibold mb-2">{scenario.name}</p>
                <label className="block text-sm font-medium mb-2">
                  想定年利回り（%）
                </label>
                <input
                  type="number"
                  value={scenario.annualRate}
                  onChange={(e) => handleScenarioRateChange(index, Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  min={INPUT_CONSTRAINTS.MIN_ANNUAL_RATE}
                  max={INPUT_CONSTRAINTS.MAX_ANNUAL_RATE}
                  step="0.1"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition-colors"
          >
            比較計算する
          </button>
        </div>

        {/* 結果表示 */}
        {results && (
          <>
            {/* 数値結果 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">シミュレーション結果比較</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.map((scenario, index) => (
                  <div
                    key={index}
                    className="p-4 border-2 rounded-md"
                    style={{ borderColor: scenario.color }}
                  >
                    <h3 className="font-bold text-lg mb-3">
                      {scenario.name}（{scenario.annualRate}%）
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">総資産額</p>
                        <p className="text-xl font-bold" style={{ color: scenario.color }}>
                          {scenario.result.totalAssets.toLocaleString('ja-JP')}円
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">元本合計</p>
                        <p className="text-lg font-semibold">
                          {scenario.result.totalPrincipal.toLocaleString('ja-JP')}円
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">運用益</p>
                        <p className="text-lg font-semibold">
                          {scenario.result.totalProfit.toLocaleString('ja-JP')}円
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* グラフ比較 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">資産推移グラフ比較</h2>
              <ComparisonChart scenarios={results} />
            </div>
          </>
        )}

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
