"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

type Variant = { id: string; name: string; stock: number; priceDelta: number };
type Product = { id: string; price: number; variants: Variant[] };

export default function AddToCartButton({ product }: { product: Product }) {
  const { user } = useAuth();
  const router = useRouter();
  const [variantId, setVariantId] = useState<string | undefined>(product.variants[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<"idle" | "adding" | "added" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const selectedVariant = product.variants.find((v) => v.id === variantId);
  const unitPrice = product.price + (selectedVariant?.priceDelta ?? 0);
  const outOfStock = selectedVariant ? selectedVariant.stock === 0 : false;

  async function handleAdd() {
    if (!user) return router.push("/login");
    setStatus("adding");
    setError(null);
    try {
      await api("/api/cart", {
        method: "POST",
        auth: true,
        body: JSON.stringify({ productId: product.id, variantId, quantity }),
      });
      setStatus("added");
      setTimeout(() => setStatus("idle"), 1500);
    } catch (e: any) {
      setError(e.message ?? "Failed");
      setStatus("error");
    }
  }

  return (
    <div className="space-y-5">
      {product.variants.length > 0 && (
        <div>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Variant</p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setVariantId(v.id)}
                disabled={v.stock === 0}
                className={`px-3.5 py-2 text-sm border rounded-lg transition-all ${
                  variantId === v.id
                    ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                    : "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-500"
                } ${v.stock === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                {v.name} {v.stock === 0 && "(out)"}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-end gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Quantity</p>
          <input
            type="number"
            min={1}
            max={selectedVariant?.stock ?? 99}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-24 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <p className="pb-2 text-sm text-zinc-500 dark:text-zinc-400">
          Total{" "}
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            ₹{(unitPrice * quantity).toLocaleString("en-IN")}
          </span>
        </p>
      </div>

      <button
        onClick={handleAdd}
        disabled={outOfStock || status === "adding"}
        className="w-full bg-brand-600 text-white py-3 rounded-lg font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {status === "adding" && (
          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        )}
        {status === "adding"
          ? "Adding..."
          : status === "added"
          ? "Added ✓"
          : outOfStock
          ? "Out of stock"
          : "Add to cart"}
      </button>

      {error && (
        <div className="text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
          {error}
        </div>
      )}
      {!user && <p className="text-xs text-zinc-500 dark:text-zinc-400">You&apos;ll be asked to log in.</p>}
    </div>
  );
}