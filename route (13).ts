import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { stripe } from "@/lib/stripe";
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
  if (parsed.data.paymentGateway !== "stripe") {
    return NextResponse.json({ error: "Wrong endpoint for this payment gateway." }, { status: 400 });
  }

  await connectDB();
  const session = getSessionUser(req);

  try {
    const order = await createPendingOrder(parsed.data, session?.userId);

    // Stripe expects the smallest currency unit (cents/paise).
    const amountInCurrency = Math.round(order.total * FX_RATES[order.currency] * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCurrency,
      currency: order.currency.toLowerCase(),
      metadata: { orderId: order._id.toString(), orderNumber: order.orderNumber },
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order._id,
      orderNumber: order.orderNumber,
      total: order.total,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
