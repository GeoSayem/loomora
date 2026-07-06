import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getSessionUser } from "@/lib/getSessionUser";

// GET /api/orders — logged-in customer's own orders, or all orders for admins
// (admins can pass ?all=true, otherwise they also just see their own).
export async function GET(req: NextRequest) {
  const session = getSessionUser(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(50, Number(searchParams.get("limit") ?? 20));
  const status = searchParams.get("status");

  const query: Record<string, unknown> =
    session.role === "admin" && searchParams.get("all") === "true" ? {} : { user: session.userId };
  if (status) query.status = status;

  const [items, total] = await Promise.all([
    Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Order.countDocuments(query),
  ]);

  return NextResponse.json({ items, pagination: { page, limit, total } });
}
