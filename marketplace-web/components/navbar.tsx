"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      setCartCount(0);
      return;
    }
    api<{ quantity: number }[]>("/api/cart", { auth: true })
      .then((items) => setCartCount(items.reduce((s, i) => s + i.quantity, 0)))
      .catch(() => {});
  }, [user, pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const initial = user?.name?.[0]?.toUpperCase() ?? "?";

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 hover:opacity-80 transition-opacity"
        >
          <span className="w-8 h-8 rounded-lg bg-brand-600 text-white grid place-items-center text-sm">
            M
          </span>
          <span>Marketplace</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/faq"
            className="px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Help
          </Link>

          <Link
            href="/cart"
            className="relative px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 grid place-items-center rounded-full bg-brand-600 text-white text-xs font-semibold">
                {cartCount}
              </span>
            )}
          </Link>

          {user && user.role === "SELLER" && (
            <Link
              href="/seller"
              className="px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Dashboard
            </Link>
          )}

          <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-800 mx-1" />

          <ThemeToggle />

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 grid place-items-center font-semibold text-sm hover:ring-2 hover:ring-brand-400 transition"
                aria-label="Account menu"
              >
                {initial}
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-11 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg py-2 text-sm">
                  <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                      {user.email}
                    </p>
                  </div>
                  {user.role === "SELLER" && (
                    <Link
                      href="/seller"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    >
                      Seller dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                      router.push("/");
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-red-600 dark:text-red-400"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}