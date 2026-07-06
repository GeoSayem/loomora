import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { connectDB } from "@/lib/db";
import { markOrderPaid } from "@/lib/orders";
import Order from "@/models/Order";

// Stripe requires the raw request body to verify the webhook signature, so
// this route must NOT run through any body-parsing middleware.
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  await connectDB();

  switch (event.type) {
    case "payment_intent.succeeded": {
      const intent = event.data.object as any;
      const orderId = intent.metadata?.orderId;
      if (orderId) await markOrderPaid(orderId, intent.id);
      break;
    }
    case "payment_intent.payment_failed": {
      const intent = event.data.object as any;
      const orderId = intent.metadata?.orderId;
      if (orderId) await Order.findByIdAndUpdate(orderId, { paymentStatus: "failed" });
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
