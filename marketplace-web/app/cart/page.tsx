"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

type CartItem = {
  id: string;
  quantity: number;
  product: { id: string; title: string; price: number; imageUrl: string | null };
  variant: { id: string; name: string; priceDelta: number } | null;
};

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return router.push("/login");
    load();
  }, [authLoading, user, router]);

  async function load() {
    try {
      setItems(await api<CartItem[]>("/api/cart", { auth: true }));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateQuantity(id: string, quantity: number) {
    if (quantity < 1) return removeItem(id);
    await api(`/api/cart/${id}`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify({ quantity }),
    });
    load();
  }

  async function removeItem(id: string) {
    await api(`/api/cart/${id}`, { method: "DELETE", auth: true });
    load();
  }

  async function checkout() {
    setCheckingOut(true);
    setError(null);
    try {
      const order = await api<{ id: string }>("/api/orders/checkout", {
        method: "POST",
        auth: true,
      });
      router.push(`/orders/${order.id}`);
    } catch (e: any) {
      setError(e.message);
      setCheckingOut(false);
    }
  }

  const total = items.reduce((sum, item) => {
    const price = item.product.price + (item.variant?.priceDelta ?? 0);
    return sum + price * item.quantity;
  }, 0);

  if (authLoading || loading)
    return <p className="text-zinc-500 dark:text-zinc-400">Loading cart...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">Your cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl bg-white dark:bg-zinc-900">
          <div className="text-4xl mb-3">🛒</div>
          <p className="text-zinc-500 dark:text-zinc-400 mb-3">Your cart is empty.</p>
          <Link href="/" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
            Browse products →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => {
              const price = item.product.price + (item.variant?.priceDelta ?? 0);
              return (
                <div
                  key={item.id}
                  className="flex gap-4 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                >
                  <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                    {item.product.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.product.imageUrl} alt={item.product.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-zinc-400">No image</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <Link
                      href={`/products/${item.product.id}`}
                      className="font-semibold text-zinc-900 dark:text-zinc-100 hover:underline"
                    >
                      {item.product.title}
                    </Link>
                    {item.variant && (
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Variant: {item.variant.name}
                      </p>
                    )}
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                      ₹{price.toLocaleString("en-IN")}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="w-16 border border-zinc-300 dark:border-zinc-700 rounded-lg px-2 py-1 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-red-600 dark:text-red-400 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-right font-semibold text-zinc-900 dark:text-zinc-100">
                    ₹{(price * item.quantity).toLocaleString("en-IN")}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 h-fit bg-white dark:bg-zinc-900">
            <h2 className="font-semibold mb-4 text-zinc-900 dark:text-zinc-100">Order summary</h2>
            <div className="flex justify-between text-sm mb-2 text-zinc-700 dark:text-zinc-300">
              <span>Subtotal</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100">
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
            {error && (
              <div className="text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2 mt-3">
                {error}
              </div>
            )}
            <button
              onClick={checkout}
              disabled={checkingOut}
              className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-medium mt-4 hover:bg-brand-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {checkingOut && (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              {checkingOut ? "Placing order..." : "Checkout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}