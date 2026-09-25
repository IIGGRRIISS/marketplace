"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

type Variant = {
  id: string;
  name: string;
  stock: number;
  priceDelta: number;
};

type Product = {
  id: string;
  price: number;
  variants: Variant[];
};

export default function AddToCartButton({ product }: { product: Product }) {
  const { user } = useAuth();
  const router = useRouter();
  const [variantId, setVariantId] = useState<string | undefined>(product.variants[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<"idle" | "adding" | "added" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const selectedVariant = product.variants.find((v) => v.id === variantId);
  const unitPrice = product.price + (selectedVariant?.priceDelta ?? 0);

  async function handleAdd() {
    if (!user) {
      router.push("/login");
      return;
    }
    setStatus("adding");
    setError(null);
    try {
      await api("/api/cart", {
        method: "POST",
        auth: true,
        body: JSON.stringify({
          productId: product.id,
          variantId,
          quantity,
        }),
      });
      setStatus("added");
      setTimeout(() => setStatus("idle"), 1500);
    } catch (e: any) {
      setError(e.message ?? "Failed");
      setStatus("error");
    }
  }

  const outOfStock = selectedVariant ? selectedVariant.stock === 0 : false;

  return (
    <div className="space-y-4">
      {product.variants.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">Variant</p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setVariantId(v.id)}
                disabled={v.stock === 0}
                className={`px-3 py-1.5 text-sm border rounded ${
                  variantId === v.id
                    ? "bg-black text-white border-black"
                    : "bg-white border-gray-300 hover:border-gray-500"
                } ${v.stock === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                {v.name} {v.stock === 0 && "(out)"}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-sm font-medium mb-2">Quantity</p>
        <input
          type="number"
          min={1}
          max={selectedVariant?.stock ?? 99}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-20 border border-gray-300 rounded px-2 py-1"
        />
      </div>

      <p className="text-lg font-semibold">
        Total: ₹{(unitPrice * quantity).toLocaleString("en-IN")}
      </p>

      <button
        onClick={handleAdd}
        disabled={outOfStock || status === "adding"}
        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "adding" ? "Adding..." : status === "added" ? "Added ✓" : outOfStock ? "Out of stock" : "Add to cart"}
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {!user && <p className="text-xs text-gray-500">You&apos;ll be asked to log in.</p>}
    </div>
  );
}