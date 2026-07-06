"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart, lineKey } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const { currency } = useCurrency();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [applying, setApplying] = useState(false);

  async function applyCoupon() {
    setApplying(true);
    setCouponMessage("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDiscount(data.discount);
      setCouponMessage(`Coupon "${data.code}" applied.`);
    } catch (err) {
      setDiscount(0);
      setCouponMessage(err instanceof Error ? err.message : "Invalid coupon.");
    } finally {
      setApplying(false);
    }
  }

  // Rough estimate shown pre-checkout; the authoritative shipping/GST
  // calculation happens server-side in lib/orders.ts at checkout time.
  const estimatedShipping = subtotal - discount >= 25000 ? 0 : 499;
  const estimatedTotal = subtotal - discount + estimatedShipping;

  if (items.length === 0) {
    return (
      <div className="container-luxe py-24 text-center">
        <h1 className="font-display text-3xl mb-4">Your cart is empty</h1>
        <p className="text-espresso mb-8">Discover a piece worth building a room around.</p>
        <Link href="/products" className="btn-primary">Shop the Collection</Link>
      </div>
    );
  }

  return (
    <div className="container-luxe py-12">
      <h1 className="font-display text-3xl md:text-4xl mb-10">Your Cart</h1>
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 divide-y divide-line">
          {items.map((item) => {
            const key = lineKey(item);
            return (
              <div key={key} className="py-6 flex gap-5">
                <div className="relative h-28 w-28 shrink-0 bg-sand">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="112px" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <Link href={`/products/${item.slug}`} className="font-display text-lg hover:text-gold-dark">
                        {item.name}
                      </Link>
                      <p className="text-xs text-espresso mt-1">
                        {item.size} · {item.color}
                      </p>
                    </div>
                    <button onClick={() => removeItem(key)} className="text-xs text-espresso underline">
                      Remove
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-line">
                      <button
                        onClick={() => updateQuantity(key, item.quantity - 1)}
                        className="w-8 h-9 flex items-center justify-center hover:bg-sand"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(key, item.quantity + 1)}
                        className="w-8 h-9 flex items-center justify-center hover:bg-sand"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm">{formatPrice(item.unitPrice * item.quantity, currency)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="card-surface p-8 h-fit">
          <h2 className="font-display text-xl mb-6">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-espresso">Subtotal</span>
              <span>{formatPrice(subtotal, currency)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-gold-dark">
                <span>Discount</span>
                <span>−{formatPrice(discount, currency)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-espresso">Estimated Shipping</span>
              <span>{estimatedShipping === 0 ? "Free" : formatPrice(estimatedShipping, currency)}</span>
            </div>
            <p className="text-xs text-espresso/70">GST (if applicable) calculated at checkout.</p>
            <div className="flex justify-between border-t border-line pt-3 font-medium text-base">
              <span>Estimated Total</span>
              <span>{formatPrice(estimatedTotal, currency)}</span>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex gap-2">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Coupon code"
                className="flex-1 border border-line px-3 py-2 text-sm bg-transparent"
              />
              <button onClick={applyCoupon} disabled={applying || !couponCode} className="btn-secondary text-xs px-4">
                Apply
              </button>
            </div>
            {couponMessage && <p className="text-xs mt-2 text-espresso">{couponMessage}</p>}
          </div>

          <Link href="/checkout" className="btn-primary w-full mt-8">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
