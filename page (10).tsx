"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ProductCard } from "@/components/products/ProductCard";
import { Product } from "@/types";

export default function WishlistPage() {
  const { user, loading } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch("/api/wishlist")
      .then((res) => res.json())
      .then((data) => setWishlist(data.wishlist ?? []))
      .finally(() => setFetching(false));
  }, [user]);

  if (loading || fetching) {
    return <div className="container-luxe py-20 text-center text-espresso">Loading your wishlist…</div>;
  }

  if (!user) {
    return (
      <div className="container-luxe py-20 text-center">
        <h1 className="font-display text-3xl mb-4">Sign in to view your wishlist</h1>
        <Link href="/account/login" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="container-luxe py-16">
      <h1 className="font-display text-3xl mb-10">Your Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="card-surface p-10 text-center max-w-lg mx-auto">
          <p className="text-espresso mb-4">Nothing saved yet. Tap the heart on any rug to add it here.</p>
          <Link href="/products" className="btn-primary">Browse Rugs</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
