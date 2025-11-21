"use client";

import React from "react";
import type { Milestone } from "@/lib/types";
import styles from "./Milestone.module.css";

interface MilestoneProps {
  milestones: Milestone[];
}

export function Milestone({ milestones }: MilestoneProps) {
  if (milestones.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <p className={styles.title}>節目の年齢マイルストーン</p>
      {milestones.map((milestone) => (
        <div key={milestone.age} className={styles.item}>
          <span className={styles.age}>{milestone.age} 歳</span>
          <span className={styles.assets}>
            {(milestone.assets / 10000).toLocaleString('ja-JP', { maximumFractionDigits: 1 })}万円
          </span>
        </div>
      ))}
    </div>
  );
}
