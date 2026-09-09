import { createContext, useContext, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { authApi } from "@/api/auth";
import { userApi, type AppUser, type ProfilePayload } from "@/api/user";

export type { AppUser, ProfilePayload };

interface AuthContextValue {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (userData: AppUser | null) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (payload: ProfilePayload) => Promise<AppUser>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const authKeys = {
  me: ["user", "me"] as const,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: user = null, isLoading } = useQuery<AppUser | null>({
    queryKey: authKeys.me,
    queryFn: async () => {
      try {
        return await userApi.me();
      } catch {
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const refreshUser = async () => {
    await queryClient.invalidateQueries({ queryKey: authKeys.me });
  };

  const setUser = (userData: AppUser | null) => {
    queryClient.setQueryData(authKeys.me, userData);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error(e);
    }
    queryClient.setQueryData(authKeys.me, null);
    queryClient.clear();
  };

  const updateProfile = async (payload: ProfilePayload) => {
    const fresh = await userApi.update(payload);
    queryClient.setQueryData(authKeys.me, fresh);
    return fresh;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        setUser,
        logout,
        refreshUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
