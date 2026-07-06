import Link from "next/link";
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-ink text-cream/80">
      <div className="container-luxe py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <span className="font-display text-2xl text-cream">Loomora &amp; Co.</span>
          <p className="mt-4 text-sm leading-relaxed text-cream/60">
            Hand-knotted and hand-tufted rugs made by master weavers, shipped from our looms
            to homes across the US, UK, Europe and the Middle East.
          </p>
          <div className="flex gap-4 mt-6">
            <a href="#" aria-label="Instagram" className="hover:text-gold-light"><Instagram className="h-5 w-5" /></a>
            <a href="#" aria-label="Facebook" className="hover:text-gold-light"><Facebook className="h-5 w-5" /></a>
            <a href="#" aria-label="YouTube" className="hover:text-gold-light"><Youtube className="h-5 w-5" /></a>
          </div>
        </div>

        <div>
          <h4 className="text-cream text-sm uppercase tracking-widest2 mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-cream/60">
            <li><Link href="/products?category=hand-tufted-carpets" className="hover:text-gold-light">Hand Tufted Carpets</Link></li>
            <li><Link href="/products?category=handmade-rugs" className="hover:text-gold-light">Handmade Rugs</Link></li>
            <li><Link href="/products?category=persian-style-rugs" className="hover:text-gold-light">Persian Style Rugs</Link></li>
            <li><Link href="/custom-order" className="hover:text-gold-light">Custom Rugs</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-cream text-sm uppercase tracking-widest2 mb-4">Customer Care</h4>
          <ul className="space-y-2 text-sm text-cream/60">
            <li><Link href="/account/orders" className="hover:text-gold-light">Track Order</Link></li>
            <li><Link href="/contact" className="hover:text-gold-light">Contact Us</Link></li>
            <li><Link href="/contact" className="hover:text-gold-light">Shipping &amp; Returns</Link></li>
            <li><Link href="/contact" className="hover:text-gold-light">Care Guide</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-cream text-sm uppercase tracking-widest2 mb-4">Get in Touch</h4>
          <ul className="space-y-3 text-sm text-cream/60">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@loomoraco.com</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91 12345 67890</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Bhadohi, Uttar Pradesh, India</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 py-6">
        <div className="container-luxe flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-cream/50">
          <p>© {new Date().getFullYear()} Loomora &amp; Co. All rights reserved.</p>
          <p>Secure checkout via Stripe &amp; Razorpay · UPI · Cards · Net Banking</p>
        </div>
      </div>
    </footer>
  );
}
