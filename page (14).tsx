import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata = { title: "Order Confirmed" };

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  return (
    <div className="container-luxe py-24 text-center max-w-lg mx-auto">
      <CheckCircle2 className="h-16 w-16 text-gold mx-auto mb-6" />
      <h1 className="font-display text-3xl mb-4">Thank you for your order</h1>
      <p className="text-espresso">
        {searchParams.order
          ? `Your order ${searchParams.order} has been confirmed. A confirmation email is on its way.`
          : "Your order has been confirmed. A confirmation email is on its way."}
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/account/orders" className="btn-secondary">Track Order</Link>
        <Link href="/products" className="btn-primary">Continue Shopping</Link>
      </div>
    </div>
  );
}
