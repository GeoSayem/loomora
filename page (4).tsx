"use client";

import { useEffect, useState, FormEvent } from "react";
import { Trash2, Plus, X } from "lucide-react";
import { Product, SizeOption, ColorOption } from "@/types";

const CATEGORIES = [
  "hand-tufted-carpets",
  "handmade-rugs",
  "modern-rugs",
  "persian-style-rugs",
  "custom-rugs",
  "luxury-carpets",
];

const emptyForm = {
  name: "",
  category: CATEGORIES[0],
  description: "",
  materialDetails: "",
  images: "",
  basePrice: 0,
  compareAtPrice: "",
  tags: "",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [sizes, setSizes] = useState<SizeOption[]>([
    { label: "5x8 ft", widthFt: 5, heightFt: 8, priceModifier: 0, stock: 10 },
  ]);
  const [colors, setColors] = useState<ColorOption[]>([{ name: "Ivory", hex: "#F1E9D8" }]);
  const [error, setError] = useState("");

  async function loadProducts() {
    setLoading(true);
    const res = await fetch("/api/products?limit=48");
    const data = await res.json();
    setProducts(data.items ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const payload = {
      name: form.name,
      category: form.category,
      description: form.description,
      materialDetails: form.materialDetails,
      images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
      basePrice: Number(form.basePrice),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
      sizes,
      colors,
      tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
    };
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setError("Please check all required fields (name, category, description, material, at least one image, size and color).");
      return;
    }
    setForm(emptyForm);
    setSizes([{ label: "5x8 ft", widthFt: 5, heightFt: 8, priceModifier: 0, stock: 10 }]);
    setColors([{ name: "Ivory", hex: "#F1E9D8" }]);
    setShowForm(false);
    loadProducts();
  }

  async function deleteProduct(slug: string) {
    if (!confirm("Remove this product from the catalog?")) return;
    await fetch(`/api/products/${slug}`, { method: "DELETE" });
    loadProducts();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Products</h1>
        <button onClick={() => setShowForm((v) => !v)} className="btn-primary flex items-center gap-2">
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancel" : "Add Product"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card-surface p-6 mb-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <input required placeholder="Product name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border border-line bg-transparent px-3 py-2.5 text-sm focus:border-gold outline-none" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border border-line bg-cream px-3 py-2.5 text-sm">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <textarea required placeholder="Description" rows={3} value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-line bg-transparent px-3 py-2.5 text-sm focus:border-gold outline-none" />

          <input required placeholder="Material details (e.g. 100% New Zealand wool, hand-tufted)" value={form.materialDetails}
            onChange={(e) => setForm({ ...form, materialDetails: e.target.value })}
            className="w-full border border-line bg-transparent px-3 py-2.5 text-sm focus:border-gold outline-none" />

          <input required placeholder="Image URLs, comma-separated" value={form.images}
            onChange={(e) => setForm({ ...form, images: e.target.value })}
            className="w-full border border-line bg-transparent px-3 py-2.5 text-sm focus:border-gold outline-none" />

          <div className="grid sm:grid-cols-3 gap-4">
            <input required type="number" placeholder="Base price (INR)" value={form.basePrice}
              onChange={(e) => setForm({ ...form, basePrice: Number(e.target.value) })}
              className="border border-line bg-transparent px-3 py-2.5 text-sm focus:border-gold outline-none" />
            <input type="number" placeholder="Compare-at price (optional)" value={form.compareAtPrice}
              onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
              className="border border-line bg-transparent px-3 py-2.5 text-sm focus:border-gold outline-none" />
            <input placeholder="Tags: best-seller, new-arrival, featured" value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="border border-line bg-transparent px-3 py-2.5 text-sm focus:border-gold outline-none" />
          </div>

          {/* Sizes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-wide text-espresso">Sizes</p>
              <button type="button" onClick={() => setSizes([...sizes, { label: "", widthFt: 0, heightFt: 0, priceModifier: 0, stock: 0 }])}
                className="text-xs text-gold-dark flex items-center gap-1"><Plus className="h-3 w-3" /> Add size</button>
            </div>
            {sizes.map((s, i) => (
              <div key={i} className="grid grid-cols-5 gap-2 mb-2">
                <input placeholder="Label (5x8 ft)" value={s.label}
                  onChange={(e) => setSizes(sizes.map((x, j) => j === i ? { ...x, label: e.target.value } : x))}
                  className="border border-line bg-transparent px-2 py-2 text-xs col-span-2" />
                <input type="number" placeholder="+Price" value={s.priceModifier}
                  onChange={(e) => setSizes(sizes.map((x, j) => j === i ? { ...x, priceModifier: Number(e.target.value) } : x))}
                  className="border border-line bg-transparent px-2 py-2 text-xs" />
                <input type="number" placeholder="Stock" value={s.stock}
                  onChange={(e) => setSizes(sizes.map((x, j) => j === i ? { ...x, stock: Number(e.target.value) } : x))}
                  className="border border-line bg-transparent px-2 py-2 text-xs" />
                <button type="button" onClick={() => setSizes(sizes.filter((_, j) => j !== i))} className="text-espresso hover:text-red-600">
                  <Trash2 className="h-4 w-4 mx-auto" />
                </button>
              </div>
            ))}
          </div>

          {/* Colors */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-wide text-espresso">Colors</p>
              <button type="button" onClick={() => setColors([...colors, { name: "", hex: "#000000" }])}
                className="text-xs text-gold-dark flex items-center gap-1"><Plus className="h-3 w-3" /> Add color</button>
            </div>
            {colors.map((c, i) => (
              <div key={i} className="grid grid-cols-5 gap-2 mb-2">
                <input placeholder="Name" value={c.name}
                  onChange={(e) => setColors(colors.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                  className="border border-line bg-transparent px-2 py-2 text-xs col-span-3" />
                <input type="color" value={c.hex}
                  onChange={(e) => setColors(colors.map((x, j) => j === i ? { ...x, hex: e.target.value } : x))}
                  className="border border-line h-9" />
                <button type="button" onClick={() => setColors(colors.filter((_, j) => j !== i))} className="text-espresso hover:text-red-600">
                  <Trash2 className="h-4 w-4 mx-auto" />
                </button>
              </div>
            ))}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="btn-primary">Save Product</button>
        </form>
      )}

      {loading ? (
        <p className="text-espresso">Loading products…</p>
      ) : (
        <div className="card-surface overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-left text-xs uppercase text-espresso border-b border-line">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-line/50">
                  <td className="py-3 px-4">{p.name}</td>
                  <td className="py-3 px-4">{p.category}</td>
                  <td className="py-3 px-4">₹{p.basePrice.toLocaleString()}</td>
                  <td className="py-3 px-4">{p.totalStock}</td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => deleteProduct(p.slug)} className="text-espresso hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-espresso">No products yet — add your first one above.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
