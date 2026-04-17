"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiClient } from "@/app/lib/api-client";
import { endpoints } from "@/app/lib/endpoints";

type User = {
  id: string;
  email: string;
  fullName?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await apiClient.get(endpoints.auth.me);
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const refreshSession = async () => {
    setIsLoading(true);
    await fetchUser();
  };

  const logout = async () => {
    try {
      await apiClient.post(endpoints.auth.logout);
    } catch {
      // ignore API logout failure and still clear local auth state
    } finally {
      setUser(null);

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isLoggedIn: !!user,
      refreshSession,
      logout,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
