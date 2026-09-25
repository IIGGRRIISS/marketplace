"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

function passwordStrength(pw: string): { level: 0 | 1 | 2 | 3; label: string; color: string } {
  if (pw.length < 6) return { level: 0, label: "Too short", color: "bg-red-500" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: 1, label: "Weak", color: "bg-red-500" };
  if (score === 2) return { level: 2, label: "Medium", color: "bg-amber-500" };
  return { level: 3, label: "Strong", color: "bg-brand-500" };
}

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"BUYER" | "SELLER">("BUYER");
  const [storeName, setStoreName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const emailError = emailTouched && !emailValid ? "Please enter a valid email" : null;
  const strength = passwordStrength(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!emailValid) {
      setEmailTouched(true);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signup({
        email,
        password,
        name,
        role,
        storeName: role === "SELLER" ? storeName : undefined,
      });
      router.push("/");
    } catch (err: any) {
      setError(err.message ?? "Signup failed");
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
          Create your account
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Start shopping or selling in seconds
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="off"
            className={`${inputBase} border-zinc-300 dark:border-zinc-700 focus:ring-brand-500 focus:border-brand-500`}
          />
        </div>

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
            autoComplete="email"
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
            Password <span className="text-zinc-400 font-normal">(min 6 chars)</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className={`${inputBase} pr-10 border-zinc-300 dark:border-zinc-700 focus:ring-brand-500 focus:border-brand-500`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 grid place-items-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 rounded"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {password.length > 0 && (
            <div className="mt-2">
              <div className="h-1 w-full bg-zinc-200 dark:bg-zinc-800 rounded overflow-hidden">
                <div
                  className={`h-full ${strength.color} transition-all`}
                  style={{ width: `${(strength.level / 3) * 100}%` }}
                />
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{strength.label}</p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            I want to
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole("BUYER")}
              className={`py-2.5 rounded-lg border text-sm font-medium transition-all ${
                role === "BUYER"
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500"
              }`}
            >
              🛒 Buy products
            </button>
            <button
              type="button"
              onClick={() => setRole("SELLER")}
              className={`py-2.5 rounded-lg border text-sm font-medium transition-all ${
                role === "SELLER"
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500"
              }`}
            >
              🏪 Sell products
            </button>
          </div>
        </div>

        {role === "SELLER" && (
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Store name
            </label>
            <input
              type="text"
              placeholder="e.g. Tech Store"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              required
              autoComplete="off"
              className={`${inputBase} border-zinc-300 dark:border-zinc-700 focus:ring-brand-500 focus:border-brand-500`}
            />
          </div>
        )}

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
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-6 text-center">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-brand-700 dark:text-brand-400 font-medium hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}