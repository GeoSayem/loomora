import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="container-luxe py-12">
      <h1 className="font-display text-3xl md:text-4xl mb-10">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
