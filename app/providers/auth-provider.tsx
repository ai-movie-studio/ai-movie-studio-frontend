"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiClient } from "@/app/lib/api-client";
import { endpoints } from "@/app/lib/endpoints";

type User = {
  id: string;
  email: string;
  fullName?: string;
  role?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  refreshSession: () => Promise<void>;
  login: (values: { email: string; password: string }) => Promise<void>;
  register: (values: any) => Promise<void>;
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

  // 1. ADD THE LOGIN FUNCTION HERE
  const login = async (values: { email: string; password: string }) => {
    const res = await apiClient.post(endpoints.auth.login, values);
    setUser(res.data);
  };

  const register = async (values: any) => {
    const res = await apiClient.post(endpoints.auth.register, values);
    setUser(res.data);
  };

  const logout = async () => {
    try {
      await apiClient.post(endpoints.auth.logout);
    } catch {
      // ignore API logout failure
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
      login,
      register,
      logout,
    }),
    [user, isLoading], // Note: You don't need to add login here unless it changes (it's stable)
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
