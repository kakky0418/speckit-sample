import { expect, test } from '@playwright/test';

test.describe('年齢ベース資産予測 e2e', () => {
  test('年齢入力ありで結果とグラフが年齢表示になる', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('NISA積立シミュレーター')).toBeVisible();

    await page.getByLabel('現在の年齢').fill('35');
    await page.getByLabel('毎月の積立額（万円）').fill('3');
    await page.getByLabel('積立期間（年）').fill('20');
    await page.getByLabel('想定年利回り（%）').fill('5');
    const startResult = Date.now();
    await page.getByRole('button', { name: '計算する' }).click();

    await expect(page.getByText('55 歳時点での資産額')).toBeVisible();
    const resultTime = Date.now() - startResult;
    expect(resultTime).toBeLessThan(1200);

    const startChart = Date.now();
    await expect(page.getByText('資産推移グラフ')).toBeVisible();
    const chartTime = Date.now() - startChart;
    expect(chartTime).toBeLessThan(1200);
  });

  test('マイルストーンが 40/50/60 歳で表示される', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('NISA積立シミュレーター')).toBeVisible();
    await page.getByLabel('現在の年齢').fill('35');
    await page.getByLabel('毎月の積立額（万円）').fill('3');
    await page.getByLabel('積立期間（年）').fill('30');
    await page.getByLabel('想定年利回り（%）').fill('5');
    await page.getByRole('button', { name: '計算する' }).click();

    await expect(page.getByText('40 歳')).toBeVisible();
    await expect(page.getByText('50 歳')).toBeVisible();
    await expect(page.getByText('60 歳')).toBeVisible();
  });

  test('逆算モードで必要月額を算出し、適用できる', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('NISA積立シミュレーター')).toBeVisible();
    await page.getByRole('button', { name: '逆算モードを開く' }).click();

    await page.getByLabel('現在の年齢').fill('35');
    await page.getByLabel('目標年齢').fill('60');
    await page.getByLabel('目標資産額（円）').fill('20000000');
    await page.getByLabel('想定年利回り（%）').fill('5');
    await page.getByLabel('初回投資額（円）').fill('0');

    await page.getByRole('button', { name: '逆算する' }).click();
    await expect(page.getByText('必要な毎月の積立額')).toBeVisible();

    await page.getByRole('button', { name: 'この金額でシミュレーションする' }).click();
    // 入力フォーム側にも年齢を設定して結果が年齢ベースになることを確認
    await page.getByLabel('現在の年齢').fill('35');
    await page.getByRole('button', { name: '計算する' }).click();
    await expect(page.getByText('55 歳時点での資産額')).toBeVisible();
  });

  test('非現実的な目標では警告が表示される', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('NISA積立シミュレーター')).toBeVisible();
    await page.getByRole('button', { name: '逆算モードを開く' }).click();

    await page.getByLabel('現在の年齢').fill('30');
    await page.getByLabel('目標年齢').fill('40');
    await page.getByLabel('目標資産額（円）').fill('200000000');
    await page.getByLabel('想定年利回り（%）').fill('5');

    await page.getByRole('button', { name: '逆算する' }).click();
    await expect(page.getByText('目標達成には非現実的な積立額が必要です')).toBeVisible();
  });
});
