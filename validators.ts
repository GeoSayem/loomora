import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const addressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(6),
  line1: z.string().min(3),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(3),
  country: z.string().min(2),
  gstNumber: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export const cartLineSchema = z.object({
  productId: z.string().min(1),
  name: z.string(),
  slug: z.string(),
  image: z.string(),
  size: z.string(),
  color: z.string(),
  unitPrice: z.number().positive(),
  quantity: z.number().int().positive().max(20),
});

export const checkoutSchema = z.object({
  items: z.array(cartLineSchema).min(1),
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  guestEmail: z.string().email().optional(),
  couponCode: z.string().optional(),
  currency: z.enum(["INR", "USD", "EUR", "GBP"]),
  paymentGateway: z.enum(["stripe", "razorpay"]),
});

export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(120).optional(),
  comment: z.string().min(5).max(2000),
});

export const customOrderSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  widthFt: z.number().positive().max(50),
  heightFt: z.number().positive().max(50),
  material: z.string().min(2),
  referenceImage: z.string().optional(),
  notes: z.string().max(2000).optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10).max(3000),
});

export const productSchema = z.object({
  name: z.string().min(2),
  category: z.string().min(1),
  description: z.string().min(10),
  materialDetails: z.string().min(2),
  careInstructions: z.string().optional(),
  images: z.array(z.string()).min(1),
  basePrice: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  sizes: z
    .array(
      z.object({
        label: z.string(),
        widthFt: z.number().positive(),
        heightFt: z.number().positive(),
        priceModifier: z.number(),
        stock: z.number().int().min(0),
      })
    )
    .min(1),
  colors: z
    .array(z.object({ name: z.string(), hex: z.string(), imageIndex: z.number().optional() }))
    .min(1),
  tags: z.array(z.string()).default([]),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const couponSchema = z.object({
  code: z.string().min(3),
  type: z.enum(["percentage", "fixed"]),
  value: z.number().positive(),
  minOrderValue: z.number().optional(),
  expiresAt: z.string().optional(),
  usageLimit: z.number().int().positive().optional(),
});
