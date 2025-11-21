import React from 'react';
import { describe, expect, mock, test } from 'bun:test';
import { renderToString } from 'react-dom/server';
import type { ChartDataPoint } from '@/lib/types';

// Chart.js ラッパーをモックして、渡された labels を検証する
mock.module('react-chartjs-2', () => ({
  Line: ({ data }: { data: { labels: string[] } }) => (
    <div data-testid="mock-line" data-labels={JSON.stringify(data.labels)} />
  ),
}));

import { InvestmentChart } from '@/components/InvestmentChart';

const chartData: ChartDataPoint[] = [
  { year: 0, principal: 0, totalAssets: 0 },
  { year: 5, principal: 1000000, totalAssets: 1200000 },
];

describe('InvestmentChart', () => {
  test('currentAge がある場合、X 軸ラベルが年齢表示になること', () => {
    const html = renderToString(<InvestmentChart chartData={chartData} currentAge={35} />);

    const labelsAttr = html.match(/data-labels="([^"]*)"/)?.[1];
    const labels = labelsAttr ? JSON.parse(labelsAttr.replace(/&quot;/g, '"')) : [];

    expect(labels).toEqual(['35 歳', '40 歳']);
  });

  test('currentAge がない場合、X 軸ラベルが経過年数表示になること', () => {
    const html = renderToString(<InvestmentChart chartData={chartData} />);

    const labelsAttr = html.match(/data-labels="([^"]*)"/)?.[1];
    const labels = labelsAttr ? JSON.parse(labelsAttr.replace(/&quot;/g, '"')) : [];

    expect(labels).toEqual(['0 年', '5 年']);
  });
});
