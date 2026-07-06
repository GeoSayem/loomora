"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";

interface Customer {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((res) => res.json())
      .then((data) => setCustomers(data.customers ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Customers</h1>

      {loading ? (
        <p className="text-espresso">Loading customers…</p>
      ) : (
        <div className="card-surface overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-left text-xs uppercase text-espresso border-b border-line">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Lifetime Spend</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id} className="border-b border-line/50">
                  <td className="py-3 px-4">{c.name}</td>
                  <td className="py-3 px-4">{c.email}</td>
                  <td className="py-3 px-4">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">{c.orderCount}</td>
                  <td className="py-3 px-4">{formatPrice(c.totalSpent)}</td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-espresso">No customers yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
