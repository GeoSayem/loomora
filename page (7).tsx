"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Package, Heart, MapPin, LogOut } from "lucide-react";

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  if (loading) return <div className="container-luxe py-20 text-center text-espresso">Loading…</div>;

  if (!user) {
    return (
      <div className="container-luxe py-20 text-center">
        <h1 className="font-display text-3xl mb-4">You're not signed in</h1>
        <Link href="/account/login" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <div className="container-luxe py-16 max-w-3xl">
      <h1 className="font-display text-3xl mb-2">Hello, {user.name}</h1>
      <p className="text-espresso mb-10">{user.email}</p>

      <div className="grid sm:grid-cols-3 gap-4">
        <Link href="/account/orders" className="card-surface p-6 hover:border-gold transition-colors">
          <Package className="h-6 w-6 mb-3 text-gold" />
          <p className="font-medium">Order History</p>
          <p className="text-xs text-espresso mt-1">Track and review past orders</p>
        </Link>
        <Link href="/account/wishlist" className="card-surface p-6 hover:border-gold transition-colors">
          <Heart className="h-6 w-6 mb-3 text-gold" />
          <p className="font-medium">Wishlist</p>
          <p className="text-xs text-espresso mt-1">Pieces you're considering</p>
        </Link>
        <div className="card-surface p-6">
          <MapPin className="h-6 w-6 mb-3 text-gold" />
          <p className="font-medium">Saved Addresses</p>
          <p className="text-xs text-espresso mt-1">Managed automatically at checkout</p>
        </div>
      </div>

      <button onClick={handleLogout} className="mt-10 flex items-center gap-2 text-sm text-espresso hover:text-ink">
        <LogOut className="h-4 w-4" /> Sign Out
      </button>
    </div>
  );
}
