"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/auth";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string | null;
};

export default function EditProductPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return router.push("/login");
    if (user.role !== "SELLER") return router.push("/");
    if (!params?.id) return;

    api<Product>(`/api/products/${params.id}`)
      .then((p) => {
        setTitle(p.title);
        setDescription(p.description);
        setPrice(String(p.price));
        setImageUrl(p.imageUrl ?? "");
      })
      .catch(() => setError("Failed to load product"))
      .finally(() => setLoading(false));
  }, [authLoading, user, params?.id, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await api(`/api/products/${params.id}`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({
          title,
          description,
          price: parseInt(price),
          imageUrl: imageUrl || null,
        }),
      });
      router.push("/seller");
    } catch (err: any) {
      setError(err.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return <p className="text-zinc-500 dark:text-zinc-400">Loading...</p>;

  const inputCls =
    "w-full border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition";

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">Edit product</h1>
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
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Price (₹)</label>
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
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Image URL</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className={inputCls}
          />
        </div>

        {error && (
          <div className="text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-brand-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving && (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {saving ? "Saving..." : "Save changes"}
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