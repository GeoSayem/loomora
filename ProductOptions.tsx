"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { formatPrice } from "@/lib/utils";

export function ProductOptions({ product }: { product: Product }) {
  const [sizeIndex, setSizeIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { currency } = useCurrency();
  const router = useRouter();

  const size = product.sizes[sizeIndex];
  const color = product.colors[colorIndex];
  const unitPrice = product.basePrice + (size?.priceModifier ?? 0);
  const inStock = (size?.stock ?? 0) > 0;

  function buildCartLine() {
    return {
      productId: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images[color?.imageIndex ?? 0] ?? product.images[0],
      size: size?.label ?? "",
      color: color?.name ?? "",
      unitPrice,
      quantity,
    };
  }

  function handleAddToCart() {
    addItem(buildCartLine());
  }

  function handleBuyNow() {
    addItem(buildCartLine());
    router.push("/checkout");
  }

  return (
    <div>
      <p className="eyebrow">{product.category.replace(/-/g, " ")}</p>
      <h1 className="font-display text-3xl md:text-4xl mt-2">{product.name}</h1>

      <div className="flex items-center gap-3 mt-4">
        <span className="text-2xl text-ink">{formatPrice(unitPrice, currency)}</span>
        {product.compareAtPrice && (
          <span className="text-base text-espresso/60 line-through">
            {formatPrice(product.compareAtPrice, currency)}
          </span>
        )}
      </div>

      <p className="mt-6 text-sm text-espresso leading-relaxed">{product.description}</p>

      <div className="mt-8">
        <h3 className="text-xs uppercase tracking-widest2 mb-3">Size</h3>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setSizeIndex(i)}
              disabled={s.stock === 0}
              className={`px-4 py-2 text-sm border ${
                i === sizeIndex ? "border-ink bg-ink text-cream" : "border-line"
              } ${s.stock === 0 ? "opacity-30 cursor-not-allowed line-through" : "hover:border-gold"}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xs uppercase tracking-widest2 mb-3">Color: {color?.name}</h3>
        <div className="flex gap-2">
          {product.colors.map((c, i) => (
            <button
              key={c.name}
              onClick={() => setColorIndex(i)}
              aria-label={c.name}
              className={`h-8 w-8 rounded-full border-2 ${i === colorIndex ? "border-gold" : "border-transparent"}`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <div className="flex items-center border border-line">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-11 flex items-center justify-center hover:bg-sand"
          >
            −
          </button>
          <span className="w-10 text-center text-sm">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(size?.stock ?? 1, q + 1))}
            className="w-10 h-11 flex items-center justify-center hover:bg-sand"
          >
            +
          </button>
        </div>
        <p className="text-xs text-espresso">
          {inStock ? `${size.stock} in stock` : "Out of stock"}
        </p>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button onClick={handleAddToCart} disabled={!inStock} className="btn-secondary flex-1 disabled:opacity-40">
          Add to Cart
        </button>
        <button onClick={handleBuyNow} disabled={!inStock} className="btn-primary flex-1 disabled:opacity-40">
          Buy Now
        </button>
      </div>

      <details className="mt-10 border-t border-line pt-6">
        <summary className="cursor-pointer text-sm uppercase tracking-wide">Material &amp; Care</summary>
        <p className="mt-3 text-sm text-espresso leading-relaxed">{product.materialDetails}</p>
        {product.careInstructions && (
          <p className="mt-2 text-sm text-espresso leading-relaxed">{product.careInstructions}</p>
        )}
      </details>
    </div>
  );
}
