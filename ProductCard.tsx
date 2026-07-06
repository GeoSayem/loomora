"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { Product } from "@/types";
import { useCurrency } from "@/context/CurrencyContext";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { currency } = useCurrency();

  async function toggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product._id }),
    });
  }

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-sand">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt=""
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}
        {product.compareAtPrice && (
          <span className="absolute top-3 left-3 bg-ink text-cream text-[10px] uppercase tracking-wide px-2 py-1">
            Sale
          </span>
        )}
        <button
          onClick={toggleWishlist}
          aria-label="Add to wishlist"
          className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center bg-cream/90 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3">
        <h3 className="font-display text-base text-ink">{product.name}</h3>
        <div className="flex items-center gap-1 mt-1">
          <Star className="h-3.5 w-3.5 fill-gold text-gold" />
          <span className="text-xs text-espresso">
            {product.ratingAverage.toFixed(1)} ({product.ratingCount})
          </span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm text-ink">{formatPrice(product.basePrice, currency)}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-espresso/60 line-through">
              {formatPrice(product.compareAtPrice, currency)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
