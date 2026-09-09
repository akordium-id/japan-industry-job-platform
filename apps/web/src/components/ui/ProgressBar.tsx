import styles from "./ProgressBar.module.css";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  label?: string;
  showValue?: boolean;
  variant?: "default" | "success" | "warning" | "accent";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export function ProgressBar({
  value,
  label,
  showValue = true,
  variant = "default",
  size = "md",
  animated = true,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={styles["wrapper"]}>
      {(label || showValue) && (
        <div className={styles["meta"]}>
          {label && <span className={styles["label"]}>{label}</span>}
          {showValue && <span className={styles["value"]}>{clamped}%</span>}
        </div>
      )}
      <div className={cn(styles["track"], styles[size])}>
        <div
          className={cn(
            styles["fill"],
            styles[variant],
            animated && styles["animated"],
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
