import { Schema, models, model } from "mongoose";

const OrderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    image: String,
    size: String,
    color: String,
    unitPrice: Number,
    quantity: Number,
  },
  { _id: false }
);

const AddressSchema = new Schema(
  {
    fullName: String,
    phone: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    gstNumber: String,
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    guestEmail: String,
    items: { type: [OrderItemSchema], required: true },
    shippingAddress: { type: AddressSchema, required: true },
    billingAddress: AddressSchema,
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    gstAmount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, enum: ["INR", "USD", "EUR", "GBP"], default: "INR" },
    couponCode: String,
    paymentGateway: { type: String, enum: ["stripe", "razorpay"], required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentReference: String, // Stripe payment_intent id or Razorpay payment id
    status: {
      type: String,
      enum: ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"],
      default: "pending",
    },
    trackingNumber: String,
  },
  { timestamps: true }
);

export default models.Order || model("Order", OrderSchema);
