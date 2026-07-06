import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Coupon from "@/models/Coupon";

// POST /api/coupons/validate — used by the cart page to show discount
// preview before checkout. Real recalculation happens server-side again at
// checkout time (see lib/orders.ts) so this is a UX convenience, not a trust
// boundary.
export async function POST(req: NextRequest) {
  const { code, subtotal } = await req.json();
  if (!code) return NextResponse.json({ error: "Enter a coupon code." }, { status: 400 });

  await connectDB();
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) return NextResponse.json({ error: "Invalid coupon code." }, { status: 404 });
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return NextResponse.json({ error: "This coupon has expired." }, { status: 400 });
  }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return NextResponse.json({ error: "This coupon has reached its usage limit." }, { status: 400 });
  }
  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    return NextResponse.json(
      { error: `Minimum order value for this coupon is ₹${coupon.minOrderValue}.` },
      { status: 400 }
    );
  }

  const discount =
    coupon.type === "percentage" ? Math.round((subtotal * coupon.value) / 100) : coupon.value;

  return NextResponse.json({ valid: true, discount, code: coupon.code });
}
