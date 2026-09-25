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

  if (authLoading || loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your products</h1>
        <Link
          href="/seller/products/new"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          + New product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500">You haven&apos;t listed anything yet.</p>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-4 border border-gray-200 rounded p-4 bg-white">
              <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center shrink-0">
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover rounded" />
                ) : (
                  <span className="text-xs text-gray-400">—</span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{p.title}</p>
                <p className="text-sm text-gray-500">
                  ₹{p.price.toLocaleString("en-IN")} · {p.variants.length} variant{p.variants.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex gap-3 text-sm">
                <Link href={`/seller/products/${p.id}/edit`} className="text-blue-600 hover:underline">
                  Edit
                </Link>
                <button onClick={() => deleteProduct(p.id)} className="text-red-600 hover:underline">
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