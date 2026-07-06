"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";

export function CatalogToolbar({ total }: { total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-line">
      <p className="text-sm text-espresso">{total} pieces</p>
      <div className="flex items-center gap-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateParams({ search: search || null });
          }}
          className="relative"
        >
          <input
            type="text"
            placeholder="Search rugs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-line pl-9 pr-3 py-2 text-sm bg-transparent w-48"
          />
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-espresso" />
        </form>
        <select
          value={searchParams.get("sort") ?? "newest"}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="border border-line px-3 py-2 text-sm bg-transparent"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Top Rated</option>
          <option value="name-asc">Name: A–Z</option>
        </select>
      </div>
    </div>
  );
}
