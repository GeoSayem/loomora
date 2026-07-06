"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCurrency } from "@/context/CurrencyContext";
import { formatPrice } from "@/lib/utils";
import { Order } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  pending: "text-espresso",
  paid: "text-gold-dark",
  processing: "text-gold-dark",
  shipped: "text-ink",
  delivered: "text-green-700",
  cancelled: "text-red-600",
  refunded: "text-red-600",
};

export default function OrderHistoryPage() {
  const { user, loading } = useAuth();
  const { currency } = useCurrency();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data.items ?? []))
      .finally(() => setFetching(false));
  }, [user]);

  if (loading || fetching) {
    return <div className="container-luxe py-20 text-center text-espresso">Loading your orders…</div>;
  }

  if (!user) {
    return (
      <div className="container-luxe py-20 text-center">
        <h1 className="font-display text-3xl mb-4">Sign in to view your orders</h1>
        <Link href="/account/login" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="container-luxe py-16 max-w-4xl">
      <h1 className="font-display text-3xl mb-10">Order History</h1>

      {orders.length === 0 ? (
        <div className="card-surface p-10 text-center">
          <p className="text-espresso mb-4">You haven't placed an order yet.</p>
          <Link href="/products" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card-surface p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-medium">{order.orderNumber}</p>
                <p className="text-xs text-espresso mt-1">
                  {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item(s)
                </p>
                {order.trackingNumber && (
                  <p className="text-xs text-espresso mt-1">Tracking: {order.trackingNumber}</p>
                )}
              </div>
              <div className="flex items-center gap-6">
                <span className={`text-xs uppercase tracking-wide font-medium ${STATUS_COLORS[order.status]}`}>
                  {order.status}
                </span>
                <span className="font-medium">{formatPrice(order.total, currency)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
