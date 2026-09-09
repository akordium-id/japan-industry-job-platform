import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./dialog";

import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  titleJp?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  footer?: ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  titleJp,
  children,
  size = "md",
  footer,
}: ModalProps) {
  const sizeClasses = {
    sm: "sm:max-w-[420px]",
    md: "sm:max-w-[560px]",
    lg: "sm:max-w-[760px]",
  }[size];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(sizeClasses, "max-h-[90vh] overflow-y-auto")}
      >
        <DialogHeader>
          <DialogTitle className="flex items-baseline gap-2">
            <span>{title}</span>
            {titleJp && (
              <span className="text-xs font-normal text-[var(--color-text-tertiary)]">
                {titleJp}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="py-2 text-[var(--color-text-secondary)]">
          {children}
        </div>

        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
