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
import type { ChartDataPoint } from '@/lib/types';
import styles from './InvestmentChart.module.css';

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

interface InvestmentChartProps {
  chartData: ChartDataPoint[];
}

export function InvestmentChart({ chartData }: InvestmentChartProps) {
  const labels = chartData.map((point) => `${point.year}年`);
  const principalData = chartData.map((point) => point.principal / 10000);
  const totalAssetsData = chartData.map((point) => point.totalAssets / 10000);

  const data = {
    labels,
    datasets: [
      {
        label: '元本',
        data: principalData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: false,
      },
      {
        label: '総資産額',
        data: totalAssetsData,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: false,
      },
    ],
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
        text: '資産推移グラフ',
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
              label += context.parsed.y.toLocaleString('ja-JP', { maximumFractionDigits: 1 }) + '万円';
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
            return value.toLocaleString('ja-JP', { maximumFractionDigits: 1 }) + '万円';
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
    <div className={styles.container}>
      <Line data={data} options={options} />
    </div>
  );
}
