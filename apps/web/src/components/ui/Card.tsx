import type { ReactNode } from "react";

import styles from "./Card.module.css";

import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  headerAction?: ReactNode;
  padding?: "sm" | "md" | "lg" | "none";
  hover?: boolean;
  accent?: boolean;
}

export function Card({
  children,
  className,
  title,
  subtitle,
  headerAction,
  padding = "md",
  hover = false,
  accent = false,
}: CardProps) {
  const padClass = padding === "none" ? "pad-none" : `pad-${padding}`;
  return (
    <div
      className={cn(
        styles["card"],
        styles[padClass],
        hover && styles["hover"],
        accent && styles["accent"],
        className,
      )}
    >
      {(title || headerAction) && (
        <div className={styles["header"]}>
          <div>
            {title && <h3 className={styles["title"]}>{title}</h3>}
            {subtitle && <p className={styles["subtitle"]}>{subtitle}</p>}
          </div>
          {headerAction && (
            <div className={styles["headerAction"]}>{headerAction}</div>
          )}
        </div>
      )}
      <div className={styles["body"]}>{children}</div>
    </div>
  );
}
