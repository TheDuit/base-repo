"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import type { ReactNode } from "react";

import { appConfig } from "../../config/app-config";
import type { AuthSession } from "./session";

type AuthSessionContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  session: AuthSession | null;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSession = useCallback(async () => {
    const response = await fetch(`${appConfig.apiUrl}/auth/session`, {
      credentials: "include"
    });

    if (!response.ok) {
      setSession(null);
      return;
    }

    setSession((await response.json()) as AuthSession);
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() =>
      loadSession().finally(() => setIsLoading(false))
    );
  }, [loadSession]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch(`${appConfig.apiUrl}/auth/login`, {
      body: JSON.stringify({ email, password }),
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      method: "POST"
    });

    if (!response.ok) {
      throw new Error("Email ou senha invalidos.");
    }

    setSession((await response.json()) as AuthSession);
  }, []);

  const logout = useCallback(async () => {
    await fetch(`${appConfig.apiUrl}/auth/logout`, {
      credentials: "include",
      method: "POST"
    });
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(session),
      isLoading,
      login,
      logout,
      session
    }),
    [isLoading, login, logout, session]
  );

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext);
  if (!context) {
    throw new Error("useAuthSession must be used inside AuthSessionProvider");
  }
  return context;
}
