import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>');
(globalThis as any).window = dom.window;
(globalThis as any).document = dom.window.document;
(globalThis as any).navigator = dom.window.navigator;

import React from 'react';
import { describe, expect, test } from 'bun:test';
import { ReverseCalculator } from '@/components/ReverseCalculator';
// @ts-ignore require を用いてグローバルセット後に読み込み
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { render, screen, fireEvent } = require('@testing-library/react');

describe('ReverseCalculator', () => {
  test('入力フィールドが表示される', () => {
    render(<ReverseCalculator onApply={() => {}} />);

    expect(screen.getByLabelText('現在の年齢')).toBeTruthy();
    expect(screen.getByLabelText('目標年齢')).toBeTruthy();
    expect(screen.getByLabelText('目標資産額（円）')).toBeTruthy();
    expect(screen.getByLabelText('想定年利回り（%）')).toBeTruthy();
    expect(screen.getByLabelText('初回投資額（円）')).toBeTruthy();
  });

  test('計算結果が表示される', () => {
    render(<ReverseCalculator onApply={() => {}} />);

    fireEvent.change(screen.getByLabelText('現在の年齢'), { target: { value: '35' } });
    fireEvent.change(screen.getByLabelText('目標年齢'), { target: { value: '60' } });
    fireEvent.change(screen.getByLabelText('目標資産額（円）'), { target: { value: '20000000' } });
    fireEvent.change(screen.getByLabelText('想定年利回り（%）'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('初回投資額（円）'), { target: { value: '0' } });

    fireEvent.click(screen.getByText('逆算する'));

    expect(screen.getByText('必要な毎月の積立額')).toBeTruthy();
    expect(screen.getByText(/25 年/)).toBeTruthy();
  });

  test('非現実的な目標には警告を表示する', () => {
    render(<ReverseCalculator onApply={() => {}} />);

    fireEvent.change(screen.getByLabelText('現在の年齢'), { target: { value: '30' } });
    fireEvent.change(screen.getByLabelText('目標年齢'), { target: { value: '40' } });
    fireEvent.change(screen.getByLabelText('目標資産額（円）'), { target: { value: '200000000' } });
    fireEvent.change(screen.getByLabelText('想定年利回り（%）'), { target: { value: '5' } });

    fireEvent.click(screen.getByText('逆算する'));

    expect(screen.getByText('目標達成には非現実的な積立額が必要です')).toBeTruthy();
  });

  test('「この金額でシミュレーションする」ボタンが計算結果を渡す', () => {
    const applied: { called: boolean; value?: number } = { called: false };

    render(<ReverseCalculator onApply={(amount) => { applied.called = true; applied.value = amount; }} />);

    fireEvent.change(screen.getByLabelText('現在の年齢'), { target: { value: '35' } });
    fireEvent.change(screen.getByLabelText('目標年齢'), { target: { value: '60' } });
    fireEvent.change(screen.getByLabelText('目標資産額（円）'), { target: { value: '20000000' } });
    fireEvent.change(screen.getByLabelText('想定年利回り（%）'), { target: { value: '5' } });

    fireEvent.click(screen.getByText('逆算する'));
    fireEvent.click(screen.getByText('この金額でシミュレーションする'));

    expect(applied.called).toBe(true);
    expect(applied.value).toBeGreaterThan(0);
  });
});
