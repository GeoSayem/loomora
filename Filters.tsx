"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";

const CATEGORIES = [
  { name: "Hand Tufted Carpets", slug: "hand-tufted-carpets" },
  { name: "Handmade Rugs", slug: "handmade-rugs" },
  { name: "Modern Rugs", slug: "modern-rugs" },
  { name: "Persian Style Rugs", slug: "persian-style-rugs" },
  { name: "Custom Rugs", slug: "custom-rugs" },
  { name: "Luxury Carpets", slug: "luxury-carpets" },
];

export function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page"); // reset pagination on filter change
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <aside className="w-full md:w-64 shrink-0 space-y-10">
      <div>
        <h3 className="eyebrow mb-4">Category</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <button
              onClick={() => updateParams({ category: null })}
              className={`hover:text-gold-dark ${!activeCategory ? "text-gold-dark font-medium" : ""}`}
            >
              All Rugs &amp; Carpets
            </button>
          </li>
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <button
                onClick={() => updateParams({ category: c.slug })}
                className={`hover:text-gold-dark ${activeCategory === c.slug ? "text-gold-dark font-medium" : ""}`}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="eyebrow mb-4">Price (₹)</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full border border-line px-3 py-2 text-sm bg-transparent"
          />
          <span className="text-espresso">–</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border border-line px-3 py-2 text-sm bg-transparent"
          />
        </div>
        <button
          onClick={() => updateParams({ minPrice: minPrice || null, maxPrice: maxPrice || null })}
          className="mt-3 text-xs uppercase tracking-wide border-b border-ink"
        >
          Apply
        </button>
      </div>
    </aside>
  );
}
