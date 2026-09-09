import type { ReactNode } from "react";

import { Navbar } from "./Navbar";

import { Toaster } from "@/components/ui/sonner";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text-primary)] font-sans antialiased">
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      <Toaster richColors position="top-right" />
    </div>
  );
}
