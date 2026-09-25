"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";

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

  if (loading) return <p className="text-gray-500">Loading order...</p>;
  if (!order) return <p className="text-gray-500">Order not found or you&apos;re not authorized.</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <h1 className="text-2xl font-bold text-green-800">Order placed ✓</h1>
        <p className="text-sm text-green-700 mt-1">Order ID: {order.id}</p>
      </div>

      <div className="mt-8">
        <h2 className="font-semibold mb-3">Items</h2>
        <ul className="space-y-2">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between border-b border-gray-200 py-2">
              <span>
                {item.product.title} × {item.quantity}
              </span>
              <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between font-bold text-lg mt-4">
          <span>Total</span>
          <span>₹{order.total.toLocaleString("en-IN")}</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">Status: {order.status}</p>
      </div>
    </div>
  );
}