import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-semibold rounded-full border transition-colors leading-none select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] border-[var(--color-border)]",
        success:
          "bg-[var(--color-success-soft)] text-[var(--color-success)] border-[var(--color-success)]/30",
        warning:
          "bg-[var(--color-warning-soft)] text-[var(--color-warning)] border-[var(--color-warning)]/30",
        danger:
          "bg-[var(--color-error-soft)] text-[var(--color-error)] border-[var(--color-error)]/30",
        info:
          "bg-[var(--color-info-soft)] text-[var(--color-info)] border-[var(--color-info)]/30",
        accent:
          "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/30",
        student:
          "bg-[#ebf5fb] text-[#2980b9] border-[#3498db]/30 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800",
        corporate:
          "bg-[#f4ecf7] text-[#8e44ad] border-[#8e44ad]/30 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800",
        educator:
          "bg-[#e8f8f5] text-[#16a085] border-[#16a085]/30 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-800",
        silver:
          "bg-[#fef9e7] text-[#b7950b] border-[#d4ac0d]/30 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
        alumni:
          "bg-[#f1f5f9] text-[#475569] border-[#94a3b8]/30 dark:bg-slate-900/40 dark:text-slate-400 dark:border-slate-800",
        admin:
          "bg-red-50 text-[var(--color-accent)] border-[var(--color-accent)]/30 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800",
      },
      size: {
        sm: "text-[11px] px-2 py-0.5",
        md: "text-xs px-2.5 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({
  children,
  variant = "default",
  dot = false,
  size = "md",
  className,
  ...props
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span
          className="inline-block h-1.5 w-1.5 rounded-full bg-current"
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

export { badgeVariants };
