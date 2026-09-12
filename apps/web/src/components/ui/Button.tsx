import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 whitespace-nowrap no-underline leading-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-red-600 text-white hover:bg-red-700 active:translate-y-0 shadow-sm",
        secondary:
          "bg-slate-900 text-white hover:bg-slate-800 active:translate-y-0 shadow-sm",
        ghost:
          "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:translate-y-0",
        danger:
          "bg-rose-600 text-white hover:bg-rose-700 active:translate-y-0 shadow-sm",
        success:
          "bg-emerald-600 text-white hover:bg-emerald-700 active:translate-y-0 shadow-sm",
        outline:
          "bg-transparent border border-slate-200 text-slate-800 hover:bg-slate-100",
        link: "text-red-600 underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "text-xs px-3 py-2 rounded-md",
        md: "text-sm px-4 py-2.5 rounded-md",
        lg: "text-base px-5 py-3 rounded-lg",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth = false,
      asChild = false,
      loading = false,
      icon,
      iconPosition = "left",
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    if (asChild) {
      return (
        <Slot
          className={cn(
            buttonVariants({ variant, size, fullWidth }),
            className,
          )}
          ref={ref as React.Ref<never>}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span
            className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        )}
        {!loading && icon && iconPosition === "left" && (
          <span className="inline-flex items-center">{icon}</span>
        )}
        {children}
        {!loading && icon && iconPosition === "right" && (
          <span className="inline-flex items-center">{icon}</span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
