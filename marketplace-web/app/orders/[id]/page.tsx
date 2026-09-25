"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";
import Link from "next/link";

type Order = {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: { id: string; quantity: number; price: number; product: { title: string } }[];
};

export default function OrderPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;
    api<Order>(`/api/orders/${params.id}`, { auth: true })
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [params?.id]);

  if (loading)
    return <p className="text-zinc-500 dark:text-zinc-400">Loading order...</p>;
  if (!order)
    return (
      <p className="text-zinc-500 dark:text-zinc-400">
        Order not found or you&apos;re not authorized.
      </p>
    );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-zinc-900 border border-brand-200 dark:border-brand-800 rounded-2xl p-8 text-center">
        <div className="inline-grid place-items-center w-14 h-14 rounded-full bg-brand-100 dark:bg-brand-950/60 text-2xl mb-3">
          ✅
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Order placed
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Order ID: <span className="font-mono">{order.id}</span>
        </p>
      </div>

      <div className="mt-8">
        <h2 className="font-semibold mb-3 text-zinc-900 dark:text-zinc-100">Items</h2>
        <ul className="space-y-2">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex justify-between border-b border-zinc-200 dark:border-zinc-800 py-2 text-zinc-900 dark:text-zinc-100"
            >
              <span>
                {item.product.title} × {item.quantity}
              </span>
              <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between font-bold text-lg mt-4 text-zinc-900 dark:text-zinc-100">
          <span>Total</span>
          <span>₹{order.total.toLocaleString("en-IN")}</span>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
          Status: {order.status}
        </p>

        <Link
          href="/"
          className="inline-block mt-6 text-brand-600 dark:text-brand-400 font-medium hover:underline"
        >
          ← Continue shopping
        </Link>
      </div>
    </div>
  );
}