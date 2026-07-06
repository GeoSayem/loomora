"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Order, OrderStatus } from "@/types";

const STATUSES: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    setLoading(true);
    const res = await fetch("/api/orders?all=true&limit=50");
    const data = await res.json();
    setOrders(data.items ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateOrder(id: string, update: Partial<{ status: OrderStatus; trackingNumber: string }>) {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });
    loadOrders();
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Orders</h1>

      {loading ? (
        <p className="text-espresso">Loading orders…</p>
      ) : (
        <div className="card-surface overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left text-xs uppercase text-espresso border-b border-line">
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Tracking #</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-line/50">
                  <td className="py-3 px-4">{order.orderNumber}</td>
                  <td className="py-3 px-4">{order.guestEmail ?? order.shippingAddress.fullName}</td>
                  <td className="py-3 px-4">{formatPrice(order.total, order.currency)}</td>
                  <td className="py-3 px-4 capitalize">
                    {order.paymentGateway} · {order.paymentStatus}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrder(order._id, { status: e.target.value as OrderStatus })}
                      className="border border-line bg-cream px-2 py-1.5 text-xs capitalize"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <input
                      defaultValue={order.trackingNumber ?? ""}
                      placeholder="Add tracking #"
                      onBlur={(e) => updateOrder(order._id, { trackingNumber: e.target.value })}
                      className="border border-line bg-transparent px-2 py-1.5 text-xs w-32"
                    />
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-espresso">No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
