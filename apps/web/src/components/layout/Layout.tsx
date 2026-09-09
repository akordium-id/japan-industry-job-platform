import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";


import { Header } from "./Header";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Public/guest routes where top navbar is preferred over sidebar
  const isGuestRoute =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  const showAppShell = isAuthenticated && !isGuestRoute;

  if (showAppShell) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex">
        {/* Fixed Left Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 md:pl-64">
          <Header />
          <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 max-w-[var(--content-max-width)] mx-auto">
            {children}
          </main>
        </div>

        <Toaster richColors position="top-right" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text-primary)] font-sans antialiased">
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      <Toaster richColors position="top-right" />
    </div>
  );
}
