"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailTouched, setEmailTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const emailError = emailTouched && !emailValid ? "Please enter a valid email" : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!emailValid) {
      setEmailTouched(true);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      router.push("/");
    } catch (err: any) {
      setError(err.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  const inputBase =
    "w-full border rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 transition";

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="text-center mb-8">
        <div className="inline-grid place-items-center w-12 h-12 rounded-xl bg-brand-600 text-white text-xl font-bold mb-4">
          M
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Welcome back
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Log in to your account</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailTouched(true)}
            required
            className={`${inputBase} ${
              emailError
                ? "border-red-400 focus:ring-red-500 focus:border-red-500"
                : "border-zinc-300 dark:border-zinc-700 focus:ring-brand-500 focus:border-brand-500"
            }`}
          />
          {emailError && <p className="text-xs text-red-600 mt-1">{emailError}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`${inputBase} pr-10 border-zinc-300 dark:border-zinc-700 focus:ring-brand-500 focus:border-brand-500`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 grid place-items-center text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 rounded"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          )}
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-6 text-center">
        No account?{" "}
        <Link href="/signup" className="text-brand-700 dark:text-brand-400 font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}