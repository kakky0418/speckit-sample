import React from 'react';
import { describe, expect, test } from 'bun:test';
import { renderToString } from 'react-dom/server';
import type { InvestmentPlan, SimulationResult } from '@/lib/types';
import { ResultDisplay } from '@/components/ResultDisplay';

const planWithAge: InvestmentPlan = {
  monthlyAmount: 30000,
  years: 20,
  annualRate: 5,
  currentAge: 35,
};

const planWithoutAge: InvestmentPlan = {
  monthlyAmount: 30000,
  years: 20,
  annualRate: 5,
};

const mockResult: SimulationResult = {
  totalAssets: 1000000,
  totalPrincipal: 600000,
  totalProfit: 400000,
  annualInvestment: 360000,
  nisaUtilizationRate: 0.5,
  isOverNisaLimit: false,
  chartData: [
    { year: 0, principal: 0, totalAssets: 0 },
    { year: 1, principal: 360000, totalAssets: 380000 },
  ],
};

describe('ResultDisplay', () => {
  test('currentAge がある場合、「XX 歳時点での資産額」を表示すること', () => {
    const html = renderToString(<ResultDisplay plan={planWithAge} result={mockResult} />);

    expect(html).toContain('55 歳時点での資産額');
  });

  test('currentAge がない場合、「XX 年後の資産額」を表示すること', () => {
    const html = renderToString(<ResultDisplay plan={planWithoutAge} result={mockResult} />);

    expect(html).toContain('20 年後の資産額');
  });
});
