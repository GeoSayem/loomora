import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { ProductCard } from "@/components/products/ProductCard";
import { Filters } from "@/components/products/Filters";
import { CatalogToolbar } from "@/components/products/CatalogToolbar";
import { Pagination } from "@/components/products/Pagination";
import type { Product as ProductType } from "@/types";

interface SearchParams {
  category?: string;
  tag?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
}

const LIMIT = 12;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const category = searchParams.category
    ? searchParams.category.replace(/-/g, " ")
    : null;
  const title = category ? `${titleCase(category)} | Shop Rugs` : "Shop All Rugs & Carpets";
  return {
    title,
    description: category
      ? `Explore Loomora & Co.'s hand-knotted ${category} — crafted by master weavers, shipped worldwide.`
      : "Browse the full Loomora & Co. collection of hand-tufted and hand-knotted rugs and carpets.",
  };
}

function titleCase(s: string) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

async function getProducts(params: SearchParams) {
  await connectDB();
  const page = Math.max(1, Number(params.page ?? 1));

  const query: Record<string, unknown> = { isActive: true };
  if (params.category) query.category = params.category;
  if (params.tag) query.tags = params.tag;
  if (params.minPrice || params.maxPrice) {
    query.basePrice = {
      ...(params.minPrice ? { $gte: Number(params.minPrice) } : {}),
      ...(params.maxPrice ? { $lte: Number(params.maxPrice) } : {}),
    };
  }
  if (params.search) query.$text = { $search: params.search };

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    "price-asc": { basePrice: 1 },
    "price-desc": { basePrice: -1 },
    "rating-desc": { ratingAverage: -1 },
    "name-asc": { name: 1 },
  };

  const [items, total] = await Promise.all([
    Product.find(query)
      .sort(sortMap[params.sort ?? "newest"] ?? sortMap.newest)
      .skip((page - 1) * LIMIT)
      .limit(LIMIT)
      .lean(),
    Product.countDocuments(query),
  ]);

  return {
    items: JSON.parse(JSON.stringify(items)) as ProductType[],
    total,
    page,
    totalPages: Math.ceil(total / LIMIT),
  };
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const { items, total, page, totalPages } = await getProducts(searchParams);

  function buildHref(targetPage: number) {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    params.set("page", String(targetPage));
    return `/products?${params.toString()}`;
  }

  return (
    <div className="container-luxe py-12">
      <div className="mb-10">
        <p className="eyebrow">The Collection</p>
        <h1 className="text-4xl md:text-5xl mt-2">Shop All Rugs &amp; Carpets</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <Filters />
        <div className="flex-1">
          <CatalogToolbar total={total} />
          {items.length === 0 ? (
            <p className="text-espresso py-20 text-center">
              No pieces match those filters yet — try widening your search.
            </p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {items.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
          <Pagination page={page} totalPages={totalPages} buildHref={buildHref} />
        </div>
      </div>
    </div>
  );
}
