"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

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

  const inputCls =
    "w-full border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition";

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">New product</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Price (₹)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min={0}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Image URL (optional)
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Variants (optional)
            </label>
            <button
              type="button"
              onClick={addVariant}
              className="text-sm text-brand-600 dark:text-brand-400 font-medium hover:underline"
            >
              + Add variant
            </button>
          </div>
          {variants.map((v, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                placeholder="Name"
                value={v.name}
                onChange={(e) => updateVariant(i, { name: e.target.value })}
                className="flex-1 border border-zinc-300 dark:border-zinc-700 rounded-lg px-2 py-1.5 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <input
                type="number"
                placeholder="Stock"
                value={v.stock}
                onChange={(e) => updateVariant(i, { stock: parseInt(e.target.value) || 0 })}
                className="w-20 border border-zinc-300 dark:border-zinc-700 rounded-lg px-2 py-1.5 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <input
                type="number"
                placeholder="Δ ₹"
                value={v.priceDelta}
                onChange={(e) => updateVariant(i, { priceDelta: parseInt(e.target.value) || 0 })}
                className="w-24 border border-zinc-300 dark:border-zinc-700 rounded-lg px-2 py-1.5 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="button"
                onClick={() => removeVariant(i)}
                className="text-red-600 dark:text-red-400 px-2 rounded hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {error && (
          <div className="text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {loading ? "Creating..." : "Create product"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/seller")}
            className="border border-zinc-300 dark:border-zinc-700 px-6 py-2.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}