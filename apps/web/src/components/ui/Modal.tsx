import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

import styles from "./Modal.module.css";

import { cn } from "@/lib/utils";

interface ModalProps {
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
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={styles["overlay"]}
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className={cn(styles["modal"], styles[size])}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles["header"]}>
          <div>
            <h2 className={styles["title"]}>{title}</h2>
            {titleJp && <span className={styles["titleJp"]}>{titleJp}</span>}
          </div>
          <button
            className={styles["close"]}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className={styles["body"]}>{children}</div>
        {footer && <div className={styles["footer"]}>{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
