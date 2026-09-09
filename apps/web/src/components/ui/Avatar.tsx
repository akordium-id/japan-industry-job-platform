import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full font-semibold items-center justify-center select-none border border-[var(--color-border)]",
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-[10px]",
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
        xl: "h-16 w-16 text-lg",
      },
      role: {
        student: "bg-[#ebf5fb] text-[#2980b9] border-[#3498db]/40",
        corporate: "bg-[#f4ecf7] text-[#8e44ad] border-[#8e44ad]/40",
        educator: "bg-[#e8f8f5] text-[#16a085] border-[#16a085]/40",
        silver: "bg-[#fef9e7] text-[#b7950b] border-[#d4ac0d]/40",
        alumni: "bg-[#f1f5f9] text-[#475569] border-[#94a3b8]/40",
        admin:
          "bg-red-50 text-[var(--color-accent)] border-[var(--color-accent)]/40",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase();
}

type AppRoleVariant =
  "student" | "corporate" | "educator" | "silver" | "alumni" | "admin";

export interface AvatarProps extends Omit<
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
  "role"
> {
  name?: string;
  src?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  role?: AppRoleVariant | null;
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, name, src, size = "md", role, children, ...props }, ref) => {
  const roleVariant = role ?? undefined;

  if (name) {
    return (
      <AvatarPrimitive.Root
        ref={ref}
        className={cn(
          avatarVariants({ size, role: roleVariant }),
          !roleVariant &&
            "bg-[var(--color-surface-2)] text-[var(--color-text-secondary)]",
          className,
        )}
        {...props}
      >
        {src && (
          <AvatarPrimitive.Image
            src={src}
            alt={name}
            className="aspect-square h-full w-full object-cover"
          />
        )}
        <AvatarPrimitive.Fallback className="flex h-full w-full items-center justify-center">
          {getInitials(name)}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
    );
  }

  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        avatarVariants({ size, role: roleVariant }),
        !roleVariant &&
          "bg-[var(--color-surface-2)] text-[var(--color-text-secondary)]",
        className,
      )}
      {...props}
    >
      {children}
    </AvatarPrimitive.Root>
  );
});
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-[var(--color-surface-2)] text-[var(--color-text-secondary)]",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
