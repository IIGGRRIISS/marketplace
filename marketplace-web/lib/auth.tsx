"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api, getToken, setToken, clearToken } from "./api";

type User = {
  id: string;
  email: string;
  name: string;
  role: "BUYER" | "SELLER" | "ADMIN";
};

type AuthCtx = {
  user: User | null;
  loading: boolean;
  signup: (data: { email: string; password: string; name: string; role: "BUYER" | "SELLER"; storeName?: string }) => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    api<{ id: string; email: string; name: string; role: User["role"] }>("/api/auth/me", { auth: true })
      .then((u) => setUser({ id: u.id, email: u.email, name: u.name, role: u.role }))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  async function signup(data: Parameters<AuthCtx["signup"]>[0]) {
    const res = await api<{ token: string; user: User }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
    setToken(res.token);
    setUser(res.user);
  }

  async function login(data: Parameters<AuthCtx["login"]>[0]) {
    const res = await api<{ token: string; user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    setToken(res.token);
    setUser(res.user);
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  return <Ctx.Provider value={{ user, loading, signup, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}