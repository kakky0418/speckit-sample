"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { TaxComparisonResult } from "@/lib/types";
import styles from "./TaxComparisonBarChart.module.css";

// Chart.js のコンポーネントを登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TaxComparisonBarChartProps {
  result: TaxComparisonResult;
}

export function TaxComparisonBarChart({ result }: TaxComparisonBarChartProps) {
  // 手取り運用益を計算（万円単位に変換）
  const nisaNetProfit = result.profitBeforeTax / 10000;
  const tokuteiNetProfit = (result.profitBeforeTax - result.tokutei.tax) / 10000;
  const principal = result.principal / 10000;

  const data = {
    labels: ["NISA（非課税）", "特定口座（課税）"],
    datasets: [
      {
        label: "元本",
        data: [principal, principal],
        backgroundColor: "rgb(59, 130, 246)", // blue
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
      {
        label: "運用益（手取り）",
        data: [nisaNetProfit, tokuteiNetProfit],
        backgroundColor: "rgb(34, 197, 94)", // green
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 1,
      },
      {
        label: "税金",
        data: [0, result.tokutei.tax / 10000],
        backgroundColor: "rgb(239, 68, 68)", // red
        borderColor: "rgb(239, 68, 68)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: "資産内訳の比較（積み上げ棒グラフ）",
        font: {
          size: 16,
          weight: "bold" as const,
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toLocaleString("ja-JP", { maximumFractionDigits: 1 }) + "万円";
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return value.toLocaleString("ja-JP", { maximumFractionDigits: 1 }) + "万円";
          },
        },
      },
    },
  };

  return (
    <div className={styles.container}>
      <div className={styles.chartWrapper}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
