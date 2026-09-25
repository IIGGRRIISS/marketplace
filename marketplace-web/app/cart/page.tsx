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
    if (!user) {
      router.push("/login");
      return;
    }
    load();
  }, [authLoading, user]);

  async function load() {
    try {
      const data = await api<CartItem[]>("/api/cart", { auth: true });
      setItems(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateQuantity(id: string, quantity: number) {
    if (quantity < 1) {
      await removeItem(id);
      return;
    }
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

  if (authLoading || loading) return <p className="text-gray-500">Loading cart...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your cart</h1>

      {items.length === 0 ? (
        <div>
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <Link href="/" className="text-blue-600 hover:underline">Browse products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => {
              const price = item.product.price + (item.variant?.priceDelta ?? 0);
              return (
                <div key={item.id} className="flex gap-4 border border-gray-200 rounded p-4">
                  <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center shrink-0">
                    {item.product.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.product.imageUrl} alt={item.product.title} className="w-full h-full object-cover rounded" />
                    ) : (
                      <span className="text-xs text-gray-400">No image</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <Link href={`/products/${item.product.id}`} className="font-semibold hover:underline">
                      {item.product.title}
                    </Link>
                    {item.variant && <p className="text-sm text-gray-500">Variant: {item.variant.name}</p>}
                    <p className="text-sm">₹{price.toLocaleString("en-IN")}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-right font-semibold">
                    ₹{(price * item.quantity).toLocaleString("en-IN")}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border border-gray-200 rounded p-4 h-fit">
            <h2 className="font-semibold mb-4">Order summary</h2>
            <div className="flex justify-between text-sm mb-2">
              <span>Subtotal</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-gray-200">
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
            {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
            <button
              onClick={checkout}
              disabled={checkingOut}
              className="w-full bg-black text-white py-2 rounded mt-4 hover:bg-gray-800 disabled:opacity-50"
            >
              {checkingOut ? "Placing order..." : "Checkout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}