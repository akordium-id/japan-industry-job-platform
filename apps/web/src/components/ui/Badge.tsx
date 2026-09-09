import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-semibold rounded-full border transition-colors leading-none select-none",
  {
    variants: {
      variant: {
        default: "bg-slate-100 text-slate-700 border-slate-200",
        success: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
        warning: "bg-amber-50 text-amber-700 border-amber-200/80",
        danger: "bg-rose-50 text-rose-700 border-rose-200/80",
        info: "bg-sky-50 text-sky-700 border-sky-200/80",
        accent: "bg-red-50 text-red-700 border-red-200/80",
        student: "bg-blue-50 text-blue-700 border-blue-200/80",
        corporate: "bg-purple-50 text-purple-700 border-purple-200/80",
        educator: "bg-teal-50 text-teal-700 border-teal-200/80",
        silver: "bg-amber-50 text-amber-800 border-amber-200/80",
        alumni: "bg-slate-100 text-slate-700 border-slate-200/80",
        admin: "bg-rose-50 text-rose-700 border-rose-200/80",
        "jlpt-n1":
          "bg-amber-100 text-amber-900 border-amber-300 font-bold tracking-wide",
        "jlpt-n2":
          "bg-sky-100 text-sky-900 border-sky-300 font-bold tracking-wide",
        "jlpt-n3":
          "bg-emerald-100 text-emerald-900 border-emerald-300 font-bold tracking-wide",
        "jlpt-n4": "bg-slate-100 text-slate-700 border-slate-300 font-medium",
        "jlpt-n5": "bg-slate-50 text-slate-600 border-slate-200 font-medium",
      },
      size: {
        sm: "text-[11px] px-2 py-0.5",
        md: "text-xs px-2.5 py-1",
        lg: "text-sm px-3 py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
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
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
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
