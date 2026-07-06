import Order from "@/models/Order";
import Coupon from "@/models/Coupon";
import Product from "@/models/Product";
import { generateOrderNumber, calculateGst, calculateShipping } from "@/lib/utils";
import { z } from "zod";
import { checkoutSchema } from "@/lib/validators";

type CheckoutInput = z.infer<typeof checkoutSchema>;

/**
 * Validates stock, recalculates pricing server-side (never trust client
 * totals), applies a coupon if present, and inserts a "pending" order that
 * the payment gateway routes then attach a payment intent/order id to.
 */
export async function createPendingOrder(input: CheckoutInput, userId?: string) {
  // Re-price every line from the database so a tampered client total can't
  // be used to under-pay.
  let subtotal = 0;
  for (const line of input.items) {
    const product = await Product.findById(line.productId).lean();
    if (!product || !(product as any).isActive) {
      throw new Error(`Product ${line.name} is no longer available.`);
    }
    const size = (product as any).sizes.find((s: any) => s.label === line.size);
    if (!size || size.stock < line.quantity) {
      throw new Error(`${line.name} (${line.size}) is out of stock.`);
    }
    const unitPrice = (product as any).basePrice + (size?.priceModifier ?? 0);
    subtotal += unitPrice * line.quantity;
  }

  let discount = 0;
  if (input.couponCode) {
    const coupon = await Coupon.findOne({ code: input.couponCode.toUpperCase(), isActive: true });
    if (coupon && (!coupon.expiresAt || coupon.expiresAt > new Date())) {
      if (!coupon.minOrderValue || subtotal >= coupon.minOrderValue) {
        discount =
          coupon.type === "percentage" ? Math.round((subtotal * coupon.value) / 100) : coupon.value;
      }
    }
  }

  const shippingCost = calculateShipping(subtotal - discount, input.shippingAddress.country);
  const gstAmount = calculateGst(subtotal - discount, input.shippingAddress.country);
  const total = subtotal - discount + shippingCost + gstAmount;

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    user: userId,
    guestEmail: input.guestEmail,
    items: input.items.map((i) => ({
      product: i.productId,
      name: i.name,
      image: i.image,
      size: i.size,
      color: i.color,
      unitPrice: i.unitPrice,
      quantity: i.quantity,
    })),
    shippingAddress: input.shippingAddress,
    billingAddress: input.billingAddress ?? input.shippingAddress,
    subtotal,
    discount,
    shippingCost,
    gstAmount,
    total,
    currency: input.currency,
    couponCode: input.couponCode,
    paymentGateway: input.paymentGateway,
    paymentStatus: "pending",
    status: "pending",
  });

  return order;
}

export async function markOrderPaid(orderId: string, paymentReference: string) {
  await Order.findByIdAndUpdate(orderId, {
    paymentStatus: "paid",
    status: "paid",
    paymentReference,
  });

  // Decrement stock for each line item now that payment is confirmed.
  const order = await Order.findById(orderId);
  if (!order) return;
  for (const item of order.items) {
    await Product.updateOne(
      { _id: item.product, "sizes.label": item.size },
      { $inc: { "sizes.$.stock": -item.quantity, totalStock: -item.quantity } }
    );
  }
}
