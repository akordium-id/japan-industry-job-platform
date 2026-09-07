import { AuthProvider } from "@/contexts/AuthContext";
import type { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: ProvidersProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
