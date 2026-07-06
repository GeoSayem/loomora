import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/getSessionUser";

export async function GET(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const customers = await User.find({ role: "customer" })
    .select("name email createdAt")
    .sort({ createdAt: -1 })
    .lean();

  // Attach lifetime order count + spend per customer.
  const withStats = await Promise.all(
    customers.map(async (c: any) => {
      const orders = await Order.find({ user: c._id, paymentStatus: "paid" }).lean();
      const totalSpent = orders.reduce((sum, o: any) => sum + o.total, 0);
      return { ...c, orderCount: orders.length, totalSpent };
    })
  );

  return NextResponse.json({ customers: withStats });
}
