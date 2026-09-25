"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useEffect } from "react";

type VariantInput = { name: string; stock: number; priceDelta: number };

export default function NewProductPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [variants, setVariants] = useState<VariantInput[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return router.push("/login");
    if (user.role !== "SELLER") return router.push("/");
  }, [authLoading, user, router]);

  function addVariant() {
    setVariants([...variants, { name: "", stock: 0, priceDelta: 0 }]);
  }

  function updateVariant(idx: number, patch: Partial<VariantInput>) {
    setVariants(variants.map((v, i) => (i === idx ? { ...v, ...patch } : v)));
  }

  function removeVariant(idx: number) {
    setVariants(variants.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api("/api/products", {
        method: "POST",
        auth: true,
        body: JSON.stringify({
          title,
          description,
          price: parseInt(price),
          imageUrl: imageUrl || undefined,
          variants: variants.length > 0 ? variants : undefined,
        }),
      });
      router.push("/seller");
    } catch (err: any) {
      setError(err.message ?? "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">New product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Price (in ₹, e.g. 7999)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          min={0}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="url"
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="font-medium">Variants (optional)</p>
            <button type="button" onClick={addVariant} className="text-sm text-blue-600 hover:underline">
              + Add variant
            </button>
          </div>
          {variants.map((v, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                placeholder="Name (e.g. Black)"
                value={v.name}
                onChange={(e) => updateVariant(i, { name: e.target.value })}
                className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
              />
              <input
                type="number"
                placeholder="Stock"
                value={v.stock}
                onChange={(e) => updateVariant(i, { stock: parseInt(e.target.value) || 0 })}
                className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
              />
              <input
                type="number"
                placeholder="Δ Price"
                value={v.priceDelta}
                onChange={(e) => updateVariant(i, { priceDelta: parseInt(e.target.value) || 0 })}
                className="w-24 border border-gray-300 rounded px-2 py-1 text-sm"
              />
              <button
                type="button"
                onClick={() => removeVariant(i)}
                className="text-red-600 text-sm px-2"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create product"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/seller")}
            className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}