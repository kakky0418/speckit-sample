// lib/formatters.ts

/**
 * 数値を日本円の通貨フォーマットに変換
 * @param value 数値
 * @returns フォーマットされた文字列（例: "1,234,567円"）
 */
export function formatCurrency(value: number): string {
  return `${value.toLocaleString('ja-JP')}円`;
}

/**
 * パーセンテージをフォーマット
 * @param value 数値（0.5 = 50%）
 * @param decimalPlaces 小数点以下の桁数（デフォルト: 1）
 * @returns フォーマットされた文字列（例: "50.0%"）
 */
export function formatPercentage(value: number, decimalPlaces: number = 1): string {
  return `${(value * 100).toFixed(decimalPlaces)}%`;
}

/**
 * 数値を万円単位でフォーマット
 * @param value 数値
 * @returns フォーマットされた文字列（例: "123.5万円"）
 */
export function formatManYen(value: number): string {
  const manYen = value / 10000;
  if (manYen >= 10000) {
    // 億円単位
    const okuYen = manYen / 10000;
    return `${okuYen.toFixed(1)}億円`;
  }
  return `${manYen.toFixed(1)}万円`;
}
