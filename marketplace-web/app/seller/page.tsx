"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Product = {
  id: string;
  title: string;
  price: number;
  imageUrl: string | null;
  variants: { id: string; name: string; stock: number }[];
};

export default function SellerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return router.push("/login");
    if (user.role !== "SELLER") return router.push("/");

    api<Product[]>("/api/products/mine", { auth: true })
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [authLoading, user, router]);

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    await api(`/api/products/${id}`, { method: "DELETE", auth: true });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  if (authLoading || loading)
    return <p className="text-zinc-500 dark:text-zinc-400">Loading...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Your products</h1>
        <Link
          href="/seller/products/new"
          className="bg-brand-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700 transition-colors"
        >
          + New product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl bg-white dark:bg-zinc-900">
          <div className="text-4xl mb-3">📦</div>
          <p className="text-zinc-500 dark:text-zinc-400 mb-3">You haven&apos;t listed anything yet.</p>
          <Link
            href="/seller/products/new"
            className="text-brand-600 dark:text-brand-400 font-medium hover:underline"
          >
            List your first product →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-zinc-400">—</span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">{p.title}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  ₹{p.price.toLocaleString("en-IN")} · {p.variants.length} variant
                  {p.variants.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex gap-2 text-sm">
                <Link
                  href={`/seller/products/${p.id}/edit`}
                  className="px-3 py-1.5 rounded-lg font-medium text-brand-700 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="px-3 py-1.5 rounded-lg font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}