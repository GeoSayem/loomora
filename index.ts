// Shared types used across the app. Mongoose documents are mapped to these
// plain-object shapes whenever they're sent to the client (see lib/serialize.ts).

export type Currency = "INR" | "USD" | "EUR" | "GBP";

export interface SizeOption {
  label: string; // e.g. "5x8 ft"
  widthFt: number;
  heightFt: number;
  priceModifier: number; // added to base price (in INR, base currency)
  stock: number;
}

export interface ColorOption {
  name: string;
  hex: string;
  imageIndex?: number; // which gallery image shows this color
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string; // Category slug
  description: string;
  materialDetails: string;
  careInstructions?: string;
  images: string[];
  basePrice: number; // in INR
  compareAtPrice?: number;
  sizes: SizeOption[];
  colors: ColorOption[];
  tags: string[]; // e.g. ["best-seller", "new-arrival", "featured"]
  ratingAverage: number;
  ratingCount: number;
  totalStock: number;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface Review {
  _id: string;
  product: string;
  user: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface Address {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  gstNumber?: string;
  isDefault?: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  addresses: Address[];
  wishlist: string[];
  createdAt: string;
}

export interface CartLine {
  productId: string;
  name: string;
  slug: string;
  image: string;
  size: string;
  color: string;
  unitPrice: number; // INR
  quantity: number;
}

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  size: string;
  color: string;
  unitPrice: number;
  quantity: number;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface Order {
  _id: string;
  orderNumber: string;
  user?: string;
  guestEmail?: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  subtotal: number;
  discount: number;
  shippingCost: number;
  gstAmount: number;
  total: number;
  currency: Currency;
  couponCode?: string;
  paymentGateway: "stripe" | "razorpay";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentReference?: string;
  status: OrderStatus;
  trackingNumber?: string;
  createdAt: string;
}

export interface Coupon {
  _id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrderValue?: number;
  expiresAt?: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}

export interface CustomOrderRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  widthFt: number;
  heightFt: number;
  material: string;
  referenceImage?: string;
  notes?: string;
  estimatedPrice: number;
  status: "new" | "reviewing" | "quoted" | "closed";
  createdAt: string;
}
