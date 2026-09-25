"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          🛒 Marketplace
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/cart" className="hover:underline">
            Cart
          </Link>

          {user ? (
            <>
              {user.role === "SELLER" && (
                <Link href="/seller" className="hover:underline">
                  Seller Dashboard
                </Link>
              )}
              <span className="text-gray-500">Hi, {user.name}</span>
              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="text-red-600 hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}