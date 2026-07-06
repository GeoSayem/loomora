"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Heart, User, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Currency } from "@/types";

const CATEGORIES = [
  { name: "Hand Tufted Carpets", slug: "hand-tufted-carpets" },
  { name: "Handmade Rugs", slug: "handmade-rugs" },
  { name: "Modern Rugs", slug: "modern-rugs" },
  { name: "Persian Style Rugs", slug: "persian-style-rugs" },
  { name: "Custom Rugs", slug: "custom-rugs" },
  { name: "Luxury Carpets", slug: "luxury-carpets" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const { itemCount } = useCart();
  const { currency, setCurrency } = useCurrency();

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur border-b border-line">
      <div className="container-luxe flex items-center justify-between h-20">
        <button
          className="md:hidden text-ink"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <Link href="/" className="flex flex-col items-center md:items-start">
          <span className="font-display text-2xl md:text-3xl tracking-wide text-ink">
            Loomora <span className="text-gold">&amp;</span> Co.
          </span>
          <span className="hidden md:block text-[10px] tracking-widest2 uppercase text-espresso">
            Handloomed Rugs &amp; Carpets
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-body text-sm">
          <div
            className="relative"
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <button className="uppercase tracking-wide hover:text-gold-dark transition-colors">
              Shop
            </button>
            {shopOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4">
                <div className="w-64 bg-cream border border-line shadow-xl p-4 grid gap-1">
                  {CATEGORIES.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/products?category=${c.slug}`}
                      className="px-3 py-2 text-sm hover:bg-sand hover:text-gold-dark transition-colors"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link href="/custom-order" className="uppercase tracking-wide hover:text-gold-dark transition-colors">
            Custom Rugs
          </Link>
          <Link href="/products?tag=best-seller" className="uppercase tracking-wide hover:text-gold-dark transition-colors">
            Best Sellers
          </Link>
          <Link href="/contact" className="uppercase tracking-wide hover:text-gold-dark transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4 md:gap-5">
          <select
            aria-label="Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="hidden md:block bg-transparent text-xs tracking-wide border border-line px-2 py-1.5"
          >
            {(["INR", "USD", "EUR", "GBP"] as Currency[]).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <Link href="/products" aria-label="Search products">
            <Search className="h-5 w-5" />
          </Link>
          <Link href="/account/wishlist" aria-label="Wishlist">
            <Heart className="h-5 w-5" />
          </Link>
          <Link href="/account" aria-label="Account">
            <User className="h-5 w-5" />
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative">
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-cream text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-line bg-cream px-6 py-4 flex flex-col gap-3 text-sm uppercase tracking-wide">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/products?category=${c.slug}`} onClick={() => setMenuOpen(false)}>
              {c.name}
            </Link>
          ))}
          <Link href="/custom-order" onClick={() => setMenuOpen(false)}>Custom Rugs</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        </div>
      )}
    </header>
  );
}
