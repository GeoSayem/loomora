import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { reviewSchema } from "@/lib/validators";
import { getSessionUser } from "@/lib/getSessionUser";

// GET /api/reviews?productId=... — public list of reviews for a product
export async function GET(req: NextRequest) {
  const productId = new URL(req.url).searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId is required" }, { status: 400 });

  await connectDB();
  const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ reviews });
}

// POST /api/reviews — logged-in users only, verified against past orders
export async function POST(req: NextRequest) {
  const session = getSessionUser(req);
  if (!session) return NextResponse.json({ error: "Please log in to leave a review." }, { status: 401 });

  const body = await req.json();
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await connectDB();
  const verifiedPurchase = !!(await Order.findOne({
    user: session.userId,
    "items.product": parsed.data.productId,
    paymentStatus: "paid",
  }));

  const review = await Review.create({
    product: parsed.data.productId,
    user: session.userId,
    userName: session.email.split("@")[0],
    rating: parsed.data.rating,
    title: parsed.data.title,
    comment: parsed.data.comment,
    verifiedPurchase,
  });

  // Recompute the product's aggregate rating.
  const stats = await Review.aggregate([
    { $match: { product: review.product } },
    { $group: { _id: "$product", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  if (stats[0]) {
    await Product.findByIdAndUpdate(parsed.data.productId, {
      ratingAverage: Math.round(stats[0].avg * 10) / 10,
      ratingCount: stats[0].count,
    });
  }

  return NextResponse.json({ review }, { status: 201 });
}
