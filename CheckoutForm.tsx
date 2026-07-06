"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useCurrency } from "@/context/CurrencyContext";
import { formatPrice } from "@/lib/utils";
import { loadRazorpayScript } from "@/lib/loadRazorpay";
import { AddressForm } from "./AddressForm";
import { StripePaymentForm } from "./StripePaymentForm";
import { Address } from "@/types";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

const emptyAddress: Address = {
  fullName: "",
  phone: "",
  line1: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

export function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { currency } = useCurrency();
  const router = useRouter();

  const [guestEmail, setGuestEmail] = useState("");
  const [address, setAddress] = useState<Address>(emptyAddress);
  const [gateway, setGateway] = useState<"stripe" | "razorpay">("razorpay");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleReview(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!user && !guestEmail) {
      setError("Please enter an email address for order updates, or log in.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        items,
        shippingAddress: address,
        guestEmail: user ? undefined : guestEmail,
        currency,
        paymentGateway: gateway,
      };

      if (gateway === "stripe") {
        const res = await fetch("/api/checkout/stripe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setClientSecret(data.clientSecret);
        setPendingOrderId(data.orderId);
      } else {
        const ok = await loadRazorpayScript();
        if (!ok) throw new Error("Could not load Razorpay checkout. Check your connection.");

        const res = await fetch("/api/checkout/razorpay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        const rzp = new (window as any).Razorpay({
          key: data.keyId,
          amount: data.amount,
          currency: data.currency,
          name: "Loomora & Co.",
          description: `Order ${data.orderNumber}`,
          order_id: data.razorpayOrderId,
          prefill: { name: address.fullName, email: guestEmail || user?.email, contact: address.phone },
          theme: { color: "#AD8347" },
          handler: async (response: any) => {
            const verifyRes = await fetch("/api/checkout/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...response, orderId: data.orderId }),
            });
            if (verifyRes.ok) {
              clearCart();
              router.push(`/checkout/success?order=${data.orderNumber}`);
            } else {
              setError("Payment verification failed. Please contact support.");
            }
          },
        });
        rzp.open();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
    } finally {
      setLoading(false);
    }
  }

  function handleStripeSuccess() {
    clearCart();
    router.push("/checkout/success");
  }

  if (clientSecret) {
    return (
      <div className="max-w-md mx-auto card-surface p-8">
        <h2 className="font-display text-xl mb-6">Secure Payment</h2>
        <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe" } }}>
          <StripePaymentForm onSuccess={handleStripeSuccess} />
        </Elements>
      </div>
    );
  }

  return (
    <form onSubmit={handleReview} className="grid lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-10">
        {!user && (
          <div>
            <h2 className="font-display text-xl mb-4">Contact</h2>
            <input
              type="email"
              required
              placeholder="Email address"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              className="w-full border border-line px-3 py-3 text-sm bg-transparent"
            />
            <p className="text-xs text-espresso mt-2">
              Checking out as a guest.{" "}
              <a href="/account/login" className="underline">Log in</a> to save your details.
            </p>
          </div>
        )}

        <div>
          <h2 className="font-display text-xl mb-4">Shipping Address</h2>
          <AddressForm address={address} onChange={setAddress} />
        </div>

        <div>
          <h2 className="font-display text-xl mb-4">Payment Method</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setGateway("razorpay")}
              className={`border p-4 text-left ${gateway === "razorpay" ? "border-gold bg-sand" : "border-line"}`}
            >
              <p className="font-medium text-sm">Razorpay</p>
              <p className="text-xs text-espresso mt-1">UPI, Cards, Net Banking (best for India)</p>
            </button>
            <button
              type="button"
              onClick={() => setGateway("stripe")}
              className={`border p-4 text-left ${gateway === "stripe" ? "border-gold bg-sand" : "border-line"}`}
            >
              <p className="font-medium text-sm">Stripe</p>
              <p className="text-xs text-espresso mt-1">International cards (US, UK, EU)</p>
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <div className="card-surface p-8 h-fit">
        <h2 className="font-display text-xl mb-6">Order Review</h2>
        <div className="space-y-4 max-h-72 overflow-y-auto">
          {items.map((item) => (
            <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between text-sm">
              <span className="text-espresso">
                {item.name} × {item.quantity}
                <span className="block text-xs text-espresso/60">{item.size} · {item.color}</span>
              </span>
              <span>{formatPrice(item.unitPrice * item.quantity, currency)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-line mt-4 pt-4 flex justify-between font-medium">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal, currency)}</span>
        </div>
        <p className="text-xs text-espresso/70 mt-2">
          Final total including shipping and GST (if applicable) is confirmed on the next step.
        </p>
        <button type="submit" disabled={loading || items.length === 0} className="btn-primary w-full mt-6 disabled:opacity-50">
          {loading ? "Preparing payment…" : "Review & Pay"}
        </button>
      </div>
    </form>
  );
}
