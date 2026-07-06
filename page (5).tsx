"use client";

import { useEffect, useState, FormEvent } from "react";
import { Coupon } from "@/types";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    code: "",
    type: "percentage" as "percentage" | "fixed",
    value: 10,
    minOrderValue: "",
    expiresAt: "",
    usageLimit: "",
  });
  const [error, setError] = useState("");

  async function loadCoupons() {
    setLoading(true);
    const res = await fetch("/api/coupons");
    const data = await res.json();
    setCoupons(data.coupons ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadCoupons();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code,
        type: form.type,
        value: Number(form.value),
        minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : undefined,
        expiresAt: form.expiresAt || undefined,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Could not create coupon.");
      return;
    }
    setForm({ code: "", type: "percentage", value: 10, minOrderValue: "", expiresAt: "", usageLimit: "" });
    loadCoupons();
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Coupons</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="card-surface p-6 space-y-4 lg:col-span-1 h-fit">
          <h2 className="font-display text-lg">New Coupon</h2>
          <input
            required
            placeholder="CODE (e.g. LOOM10)"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            className="w-full border border-line bg-transparent px-3 py-2.5 text-sm focus:border-gold outline-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as "percentage" | "fixed" })}
              className="border border-line bg-cream px-3 py-2.5 text-sm"
            >
              <option value="percentage">% off</option>
              <option value="fixed">₹ off</option>
            </select>
            <input
              type="number"
              required
              placeholder="Value"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
              className="border border-line bg-transparent px-3 py-2.5 text-sm focus:border-gold outline-none"
            />
          </div>
          <input
            type="number"
            placeholder="Minimum order value (optional)"
            value={form.minOrderValue}
            onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
            className="w-full border border-line bg-transparent px-3 py-2.5 text-sm focus:border-gold outline-none"
          />
          <input
            type="date"
            value={form.expiresAt}
            onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
            className="w-full border border-line bg-transparent px-3 py-2.5 text-sm focus:border-gold outline-none"
          />
          <input
            type="number"
            placeholder="Usage limit (optional)"
            value={form.usageLimit}
            onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
            className="w-full border border-line bg-transparent px-3 py-2.5 text-sm focus:border-gold outline-none"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button type="submit" className="btn-primary w-full">Create Coupon</button>
        </form>

        <div className="lg:col-span-2 card-surface overflow-x-auto h-fit">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="text-left text-xs uppercase text-espresso border-b border-line">
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Used</th>
                <th className="py-3 px-4">Expires</th>
              </tr>
            </thead>
            <tbody>
              {!loading && coupons.map((c) => (
                <tr key={c._id} className="border-b border-line/50">
                  <td className="py-3 px-4 font-medium">{c.code}</td>
                  <td className="py-3 px-4">{c.type === "percentage" ? `${c.value}%` : `₹${c.value}`}</td>
                  <td className="py-3 px-4">{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ""}</td>
                  <td className="py-3 px-4">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
              {!loading && coupons.length === 0 && (
                <tr><td colSpan={4} className="py-8 text-center text-espresso">No coupons yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
