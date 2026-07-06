import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { productSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/getSessionUser";

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  await connectDB();
  const product = await Product.findOne({ slug: params.slug, isActive: true }).lean();
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const related = await Product.find({
    category: (product as any).category,
    slug: { $ne: params.slug },
    isActive: true,
  })
    .limit(4)
    .lean();

  return NextResponse.json({ product, related });
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = productSchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await connectDB();
  const totalStock = parsed.data.sizes?.reduce((sum, s) => sum + s.stock, 0);

  const product = await Product.findOneAndUpdate(
    { slug: params.slug },
    { ...parsed.data, ...(totalStock !== undefined ? { totalStock } : {}) },
    { new: true }
  );
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  return NextResponse.json({ product });
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  // Soft delete so historical orders still resolve product references.
  const product = await Product.findOneAndUpdate(
    { slug: params.slug },
    { isActive: false },
    { new: true }
  );
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  return NextResponse.json({ success: true });
}
