import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { productSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/getSessionUser";
import { slugify } from "@/lib/utils";

// GET /api/products?category=persian-style-rugs&minPrice=5000&maxPrice=50000
//     &search=blue&sort=price-asc&page=1&limit=12&tag=best-seller
export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category");
  const tag = searchParams.get("tag");
  const search = searchParams.get("search");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sort = searchParams.get("sort") ?? "newest";
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(48, Number(searchParams.get("limit") ?? 12));

  const query: Record<string, unknown> = { isActive: true };
  if (category) query.category = category;
  if (tag) query.tags = tag;
  if (minPrice || maxPrice) {
    query.basePrice = {
      ...(minPrice ? { $gte: Number(minPrice) } : {}),
      ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
    };
  }
  if (search) {
    query.$text = { $search: search };
  }

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    "price-asc": { basePrice: 1 },
    "price-desc": { basePrice: -1 },
    "rating-desc": { ratingAverage: -1 },
    "name-asc": { name: 1 },
  };

  const [items, total] = await Promise.all([
    Product.find(query)
      .sort(sortMap[sort] ?? sortMap.newest)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(query),
  ]);

  return NextResponse.json({
    items,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

// POST /api/products — admin only, creates a new product.
export async function POST(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  await connectDB();
  const slug = slugify(parsed.data.name);
  const totalStock = parsed.data.sizes.reduce((sum, s) => sum + s.stock, 0);

  const product = await Product.create({ ...parsed.data, slug, totalStock });
  return NextResponse.json({ product }, { status: 201 });
}
