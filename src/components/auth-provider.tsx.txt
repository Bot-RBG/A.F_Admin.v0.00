"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/lib/types";
import { users } from "@/lib/mock-data";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  isLoading: true,
});

const STORAGE_KEY = "af-admin-session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        const found = users.find((u) => u.id === data.userId);
        if (found) setUser(found);
      }
    } catch {
      /* ignore */
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, remember: boolean) => {
    // Mock authentication — in production, this calls the backend /api/auth/login
    // For demo: any password works with valid email, or use demo/demo
    await new Promise((r) => setTimeout(r, 800));

    let found: User | undefined;
    if (email === "demo" && password === "demo") {
      found = users[0]; // Super Admin
    } else {
      found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
    }

    if (!found) {
      throw new Error("Invalid credentials. Please check your email and password.");
    }

    if (found.status !== "active") {
      throw new Error("Your account is currently inactive. Please contact the administrator.");
    }

    setUser(found);
    if (remember) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ userId: found.id }));
    } else {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ userId: found.id }));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
