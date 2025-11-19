"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import type { YearlyTaxData } from "@/lib/types";
import styles from "./TaxComparisonLineChart.module.css";

// Chart.js のコンポーネントを登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TaxComparisonLineChartProps {
  yearlyData: YearlyTaxData[];
}

export function TaxComparisonLineChart({ yearlyData }: TaxComparisonLineChartProps) {
  const data = {
    labels: yearlyData.map((d) => `${d.year}年`),
    datasets: [
      {
        label: "NISA（非課税）",
        data: yearlyData.map((d) => d.nisaNetAssets),
        borderColor: "rgb(59, 130, 246)", // blue
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        fill: false,
        tension: 0.2,
      },
      {
        label: "特定口座（課税）",
        data: yearlyData.map((d) => d.tokuteiNetAssets),
        borderColor: "rgb(239, 68, 68)", // red
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderWidth: 2,
        fill: false,
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
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
        text: "手取り総資産の年次推移",
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
              label += context.parsed.y.toLocaleString("ja-JP") + "円";
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return value.toLocaleString("ja-JP") + "円";
          },
        },
      },
    },
  };

  return (
    <div className={styles.container}>
      <div className={styles.chartWrapper}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
