import type { ButtonHTMLAttributes, ReactNode } from "react";

import styles from "./Button.module.css";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "success";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  children,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        styles["btn"],
        styles[variant],
        styles[size],
        fullWidth && styles["fullWidth"],
        loading && styles["loading"],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className={styles["spinner"]} />}
      {!loading && icon && iconPosition === "left" && (
        <span className={styles["icon"]}>{icon}</span>
      )}
      {children && <span>{children}</span>}
      {!loading && icon && iconPosition === "right" && (
        <span className={styles["icon"]}>{icon}</span>
      )}
    </button>
  );
}
