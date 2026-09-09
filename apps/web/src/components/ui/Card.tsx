import * as React from "react";

import { cn } from "@/lib/utils";

interface LegacyCardProps {
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  padding?: "sm" | "md" | "lg" | "none";
  hover?: boolean;
  accent?: boolean;
}

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    LegacyCardProps {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      title,
      subtitle,
      headerAction,
      padding = "md",
      hover = false,
      accent = false,
      children,
      ...props
    },
    ref,
  ) => {
    const paddingStyles = {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    }[padding];

    const isLegacyUsage = Boolean(title || subtitle || headerAction);

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-sm transition-all duration-150",
          hover && "hover:-translate-y-0.5 hover:shadow-md",
          accent && "border-t-4 border-t-[var(--color-accent)]",
          !isLegacyUsage && paddingStyles,
          className,
        )}
        {...props}
      >
        {isLegacyUsage ? (
          <>
            <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] p-5 pb-4">
              <div>
                {title && (
                  <h3 className="text-base font-semibold text-[var(--color-text-primary)] leading-tight">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                    {subtitle}
                  </p>
                )}
              </div>
              {headerAction && (
                <div className="flex items-center gap-2">{headerAction}</div>
              )}
            </div>
            <div className={paddingStyles}>{children}</div>
          </>
        ) : (
          children
        )}
      </div>
    );
  },
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-[var(--color-text-primary)]",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-[var(--color-text-secondary)]", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
