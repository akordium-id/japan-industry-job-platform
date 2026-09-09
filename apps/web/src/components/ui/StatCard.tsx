import type { ReactNode } from "react";

import styles from "./StatCard.module.css";

import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  trend?: { value: string; positive: boolean };
  accent?: "red" | "blue" | "green" | "gold" | "purple";
  sublabel?: string;
}

export function StatCard({
  label,
  value,
  unit,
  icon,
  trend,
  accent = "red",
  sublabel,
}: StatCardProps) {
  return (
    <div className={cn(styles["card"], styles[accent])}>
      <div className={styles["top"]}>
        <span className={styles["label"]}>{label}</span>
        {icon && <span className={styles["icon"]}>{icon}</span>}
      </div>
      <div className={styles["valueRow"]}>
        <span className={styles["value"]}>{value}</span>
        {unit && <span className={styles["unit"]}>{unit}</span>}
      </div>
      {sublabel && <span className={styles["sublabel"]}>{sublabel}</span>}
      {trend && (
        <div
          className={cn(
            styles["trend"],
            trend.positive ? styles["positive"] : styles["negative"],
          )}
        >
          <span>{trend.positive ? "↑" : "↓"}</span>
          <span>{trend.value}</span>
        </div>
      )}
    </div>
  );
}
