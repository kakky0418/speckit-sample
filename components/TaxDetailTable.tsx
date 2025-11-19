import type { TaxComparisonResult } from "@/lib/types";
import styles from "./TaxDetailTable.module.css";

interface TaxDetailTableProps {
  result: TaxComparisonResult;
}

export function TaxDetailTable({ result }: TaxDetailTableProps) {
  // 手取り運用益を計算
  const nisaNetProfit = result.profitBeforeTax;
  const tokuteiNetProfit = result.profitBeforeTax - result.tokutei.tax;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>詳細内訳</h2>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.headerCell}>項目</th>
              <th className={styles.headerCell}>NISA（非課税）</th>
              <th className={styles.headerCell}>特定口座（課税）</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.labelCell}>元本合計</td>
              <td className={styles.valueCell}>
                {(result.principal / 10000).toLocaleString('ja-JP', { maximumFractionDigits: 1 })}万円
              </td>
              <td className={styles.valueCell}>
                {(result.principal / 10000).toLocaleString('ja-JP', { maximumFractionDigits: 1 })}万円
              </td>
            </tr>

            <tr>
              <td className={styles.labelCell}>運用益（税引前）</td>
              <td className={styles.valueCell}>
                {(result.profitBeforeTax / 10000).toLocaleString('ja-JP', { maximumFractionDigits: 1 })}万円
              </td>
              <td className={styles.valueCell}>
                {(result.profitBeforeTax / 10000).toLocaleString('ja-JP', { maximumFractionDigits: 1 })}万円
              </td>
            </tr>

            <tr className={styles.highlightRow}>
              <td className={styles.labelCell}>税金（20.315%）</td>
              <td className={styles.valueCellGreen}>
                <span className={styles.taxZero}>0万円</span>
              </td>
              <td className={styles.valueCellRed}>
                <span className={styles.taxAmount}>
                  {(result.tokutei.tax / 10000).toLocaleString('ja-JP', { maximumFractionDigits: 1 })}万円
                </span>
              </td>
            </tr>

            <tr>
              <td className={styles.labelCell}>手取り運用益</td>
              <td className={styles.valueCell}>
                {(nisaNetProfit / 10000).toLocaleString('ja-JP', { maximumFractionDigits: 1 })}万円
              </td>
              <td className={styles.valueCell}>
                {(tokuteiNetProfit / 10000).toLocaleString('ja-JP', { maximumFractionDigits: 1 })}万円
              </td>
            </tr>

            <tr className={styles.totalRow}>
              <td className={styles.labelCellBold}>総資産（手取り）</td>
              <td className={styles.valueCellBold}>
                {(result.nisa.netAssets / 10000).toLocaleString('ja-JP', { maximumFractionDigits: 1 })}万円
              </td>
              <td className={styles.valueCellBold}>
                {(result.tokutei.netAssets / 10000).toLocaleString('ja-JP', { maximumFractionDigits: 1 })}万円
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
