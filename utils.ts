import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Currency } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Static conversion rates from INR (base currency). In production, replace
// with a live FX API (e.g. exchangerate.host) refreshed on a cron/cache.
export const FX_RATES: Record<Currency, number> = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export function formatPrice(amountInInr: number, currency: Currency = "INR"): string {
  const converted = amountInInr * FX_RATES[currency];
  const symbol = CURRENCY_SYMBOLS[currency];
  const formatted = converted.toLocaleString(undefined, {
    minimumFractionDigits: currency === "INR" ? 0 : 2,
    maximumFractionDigits: currency === "INR" ? 0 : 2,
  });
  return `${symbol}${formatted}`;
}

export function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `LMR-${ts}-${rand}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Basic GST calculation for India shipments (18% on handmade textiles by
// default — confirm actual HSN/GST rate with your accountant before launch).
export const GST_RATE = 0.18;
export function calculateGst(amount: number, country: string): number {
  if (country !== "India") return 0;
  return Math.round(amount * GST_RATE);
}

// Flat-rate shipping logic, swap for a carrier API (Shiprocket, EasyPost) later.
export function calculateShipping(subtotal: number, country: string): number {
  if (subtotal >= 25000) return 0; // free shipping over ₹25,000
  return country === "India" ? 499 : 3999;
}
