import type { ReactNode } from "react";

import styles from "./Badge.module.css";

import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "accent"
  | "student"
  | "corporate"
  | "educator"
  | "silver";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  size?: "sm" | "md";
}

export function Badge({
  children,
  variant = "default",
  dot = false,
  size = "md",
}: BadgeProps) {
  return (
    <span className={cn(styles["badge"], styles[variant], styles[size])}>
      {dot && <span className={styles["dot"]} />}
      {children}
    </span>
  );
}
