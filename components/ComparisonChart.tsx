"use client";

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
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { Scenario } from '@/lib/types';

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

interface ComparisonChartProps {
  scenarios: Scenario[];
}

export function ComparisonChart({ scenarios }: ComparisonChartProps) {
  // すべてのシナリオで共通のラベルを使用（最初のシナリオから取得）
  const labels = scenarios[0].result.chartData.map((point) => `${point.year}年`);

  // 各シナリオごとにデータセットを作成
  const datasets = scenarios.map((scenario) => ({
    label: `${scenario.name} (${scenario.annualRate}%)`,
    data: scenario.result.chartData.map((point) => point.totalAssets),
    borderColor: scenario.color,
    backgroundColor: scenario.color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
    tension: 0.4,
    fill: false,
    borderWidth: 2,
  }));

  const data = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
          },
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: 'シナリオ別資産推移比較',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('ja-JP', {
                style: 'currency',
                currency: 'JPY',
                maximumFractionDigits: 0,
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return new Intl.NumberFormat('ja-JP', {
              style: 'currency',
              currency: 'JPY',
              notation: 'compact',
              maximumFractionDigits: 0,
            }).format(value);
          },
        },
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  return (
    <div className="w-full h-[400px]">
      <Line data={data} options={options} />
    </div>
  );
}
