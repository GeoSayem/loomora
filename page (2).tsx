"use client";

import { useEffect, useState } from "react";
import { IndianRupee, ShoppingCart, Clock, Users, Package } from "lucide-react";
import { StatsCard } from "@/components/admin/StatsCard";
import { formatPrice } from "@/lib/utils";

interface Stats {
  totalRevenue: number;
  orderCount: number;
  pendingOrders: number;
  customerCount: number;
  productCount: number;
  recentOrders: any[];
  topProducts: any[];
  revenueLast30: { _id: string; total: number }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then(setStats);
  }, []);

  if (!stats) return <p className="text-espresso">Loading dashboard…</p>;

  const maxRevenue = Math.max(...stats.revenueLast30.map((d) => d.total), 1);

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatsCard label="Total Revenue" value={formatPrice(stats.totalRevenue)} icon={IndianRupee} />
        <StatsCard label="Paid Orders" value={String(stats.orderCount)} icon={ShoppingCart} />
        <StatsCard label="Pending Orders" value={String(stats.pendingOrders)} icon={Clock} />
        <StatsCard label="Customers" value={String(stats.customerCount)} icon={Users} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-surface p-6">
          <h2 className="font-display text-lg mb-6">Revenue — Last 30 Days</h2>
          <div className="flex items-end gap-1 h-40">
            {stats.revenueLast30.length === 0 && (
              <p className="text-sm text-espresso self-center">No paid orders yet in this window.</p>
            )}
            {stats.revenueLast30.map((d) => (
              <div key={d._id} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                <div
                  className="w-full bg-gold hover:bg-gold-dark transition-colors"
                  style={{ height: `${(d.total / maxRevenue) * 100}%` }}
                />
                <span className="absolute -top-6 text-[10px] opacity-0 group-hover:opacity-100 bg-ink text-cream px-1.5 py-0.5 rounded">
                  {formatPrice(d.total)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-surface p-6">
          <h2 className="font-display text-lg mb-4 flex items-center gap-2">
            <Package className="h-4 w-4 text-gold" /> Top Products
          </h2>
          <ul className="space-y-3">
            {stats.topProducts.map((p) => (
              <li key={p._id} className="flex justify-between text-sm">
                <span>{p.name}</span>
                <span className="text-espresso">{p.unitsSold} sold</span>
              </li>
            ))}
            {stats.topProducts.length === 0 && <p className="text-sm text-espresso">No sales yet.</p>}
          </ul>
        </div>
      </div>

      <div className="card-surface p-6 mt-6">
        <h2 className="font-display text-lg mb-4">Recent Orders</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-espresso border-b border-line">
              <th className="py-2">Order</th>
              <th className="py-2">Status</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentOrders.map((o) => (
              <tr key={o._id} className="border-b border-line/50">
                <td className="py-2.5">{o.orderNumber}</td>
                <td className="py-2.5 capitalize">{o.status}</td>
                <td className="py-2.5 text-right">{formatPrice(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
