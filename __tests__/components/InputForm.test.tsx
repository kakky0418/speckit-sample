import React from 'react';
import { describe, expect, test } from 'bun:test';
import { renderToString } from 'react-dom/server';
import type { InvestmentPlan } from '@/lib/types';
import { InputForm } from '@/components/InputForm';

const basePlan: InvestmentPlan = {
  monthlyAmount: 30000,
  years: 20,
  annualRate: 5,
};

describe('InputForm', () => {
  test('年齢入力フィールドが表示されること', () => {
    const html = renderToString(
      <InputForm
        plan={basePlan}
        errors={[]}
        onChange={() => {}}
        onSubmit={() => {}}
      />
    );

    expect(html).toContain('現在の年齢');
  });

  test('年齢バリデーションエラーが表示されること', () => {
    const html = renderToString(
      <InputForm
        plan={basePlan}
        errors={['1 歳以上 120 歳以下で入力してください']}
        onChange={() => {}}
        onSubmit={() => {}}
      />
    );

    expect(html).toContain('1 歳以上 120 歳以下で入力してください');
  });
});
