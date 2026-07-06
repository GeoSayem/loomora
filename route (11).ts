import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { razorpay } from "@/lib/razorpay";
import { checkoutSchema } from "@/lib/validators";
import { createPendingOrder } from "@/lib/orders";
import { getSessionUser } from "@/lib/getSessionUser";
import { allowRequest } from "@/lib/rateLimit";
import { FX_RATES } from "@/lib/utils";

export async function POST(req: NextRequest) {
  if (!(await allowRequest(req, "checkout"))) {
    return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 });
  }

  const body = await req.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  if (parsed.data.paymentGateway !== "razorpay") {
    return NextResponse.json({ error: "Wrong endpoint for this payment gateway." }, { status: 400 });
  }

  await connectDB();
  const session = getSessionUser(req);

  try {
    const order = await createPendingOrder(parsed.data, session?.userId);

    // Razorpay expects amount in the smallest currency unit (paise for INR).
    const amountInCurrency = Math.round(order.total * FX_RATES[order.currency] * 100);

    const rzpOrder = await razorpay.orders.create({
      amount: amountInCurrency,
      currency: order.currency,
      receipt: order.orderNumber,
      notes: { orderId: order._id.toString() },
    });

    return NextResponse.json({
      razorpayOrderId: rzpOrder.id,
      keyId: process.env.RAZORPAY_KEY_ID,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      orderId: order._id,
      orderNumber: order.orderNumber,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
