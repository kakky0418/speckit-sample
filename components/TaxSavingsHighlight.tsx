import type { TaxComparisonResult } from "@/lib/types";
import styles from "./TaxSavingsHighlight.module.css";

interface TaxSavingsHighlightProps {
  result: TaxComparisonResult;
}

export function TaxSavingsHighlight({ result }: TaxSavingsHighlightProps) {
  return (
    <div className={styles.container}>
      {/* 節税額の強調表示 */}
      <div className={styles.savingsCard}>
        <div className={styles.iconWrapper}>
          <span className={styles.icon}>💰</span>
        </div>
        <h2 className={styles.title}>NISA の節税効果</h2>
        <p className={styles.savingsAmount}>
          {(result.taxSavings / 10000).toLocaleString('ja-JP', { maximumFractionDigits: 1 })}万円
        </p>
        <p className={styles.savingsLabel}>お得！</p>
      </div>

      {/* NISA vs 特定口座の手取り比較 */}
      <div className={styles.comparisonGrid}>
        <div className={styles.comparisonCard}>
          <h3 className={styles.cardTitle}>NISA（非課税）</h3>
          <p className={styles.netAmount}>
            {(result.nisa.netAssets / 10000).toLocaleString('ja-JP', { maximumFractionDigits: 1 })}万円
          </p>
          <p className={styles.cardLabel}>手取り総資産</p>
          <div className={styles.detail}>
            <span>税金</span>
            <span className={styles.taxZero}>0万円</span>
          </div>
        </div>

        <div className={styles.comparisonCard}>
          <h3 className={styles.cardTitle}>特定口座（課税）</h3>
          <p className={styles.netAmount}>
            {(result.tokutei.netAssets / 10000).toLocaleString('ja-JP', { maximumFractionDigits: 1 })}万円
          </p>
          <p className={styles.cardLabel}>手取り総資産</p>
          <div className={styles.detail}>
            <span>税金</span>
            <span className={styles.taxAmount}>
              {(result.tokutei.tax / 10000).toLocaleString('ja-JP', { maximumFractionDigits: 1 })}万円
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
