import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const progressTrackVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-[var(--color-surface-3)]",
  {
    variants: {
      size: {
        sm: "h-1.5",
        md: "h-2.5",
        lg: "h-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const progressFillVariants = cva(
  "h-full w-full flex-1 transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-primary)]",
        success: "bg-[var(--color-success)]",
        warning: "bg-[var(--color-warning)]",
        accent: "bg-[var(--color-accent)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface ProgressBarProps
  extends
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressTrackVariants>,
    VariantProps<typeof progressFillVariants> {
  value?: number;
  label?: string;
  showValue?: boolean;
  animated?: boolean;
}

const ProgressBar = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressBarProps
>(
  (
    {
      className,
      value = 0,
      label,
      showValue = true,
      variant = "default",
      size = "md",
      animated = true,
      ...props
    },
    ref,
  ) => {
    const clamped = Math.min(100, Math.max(0, value || 0));

    return (
      <div className="w-full space-y-1.5">
        {(label || showValue) && (
          <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)] font-medium">
            {label && (
              <span className="text-[var(--color-text-primary)]">{label}</span>
            )}
            {showValue && <span>{clamped}%</span>}
          </div>
        )}
        <ProgressPrimitive.Root
          ref={ref}
          className={cn(progressTrackVariants({ size }), className)}
          value={clamped}
          {...props}
        >
          <ProgressPrimitive.Indicator
            className={cn(
              progressFillVariants({ variant }),
              animated && "transition-all duration-500",
            )}
            style={{ transform: `translateX(-${100 - clamped}%)` }}
          />
        </ProgressPrimitive.Root>
      </div>
    );
  },
);

ProgressBar.displayName = "ProgressBar";

export { ProgressBar };
