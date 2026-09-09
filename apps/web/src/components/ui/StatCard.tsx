import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const statCardVariants = cva(
  "rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm transition-all duration-150 border-l-4",
  {
    variants: {
      accent: {
        red: "border-l-[var(--color-accent)]",
        blue: "border-l-[#3498db]",
        green: "border-l-[var(--color-success)]",
        gold: "border-l-[#d4ac0d]",
        purple: "border-l-[#8e44ad]",
      },
    },
    defaultVariants: {
      accent: "red",
    },
  },
);

export interface StatCardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statCardVariants> {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: { value: string; positive: boolean };
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
  className,
  ...props
}: StatCardProps) {
  return (
    <div className={cn(statCardVariants({ accent }), className)} {...props}>
      <div className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
        <span>{label}</span>
        {icon && (
          <span className="text-base text-[var(--color-text-secondary)]">
            {icon}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-1 font-bold text-2xl tracking-tight text-[var(--color-text-primary)]">
        <span>{value}</span>
        {unit && (
          <span className="text-sm font-semibold text-[var(--color-text-secondary)]">
            {unit}
          </span>
        )}
      </div>

      {sublabel && (
        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
          {sublabel}
        </p>
      )}

      {trend && (
        <div
          className={cn(
            "mt-2 inline-flex items-center gap-1 text-xs font-medium",
            trend.positive
              ? "text-[var(--color-success)]"
              : "text-[var(--color-error)]",
          )}
        >
          <span>{trend.positive ? "↑" : "↓"}</span>
          <span>{trend.value}</span>
        </div>
      )}
    </div>
  );
}
