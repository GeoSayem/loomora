"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.push("/admin/login");
  }

  return (
    <aside className="w-64 shrink-0 bg-ink text-cream min-h-screen flex flex-col">
      <div className="px-6 py-8 border-b border-cream/10">
        <span className="font-display text-xl">Loomora Admin</span>
      </div>
      <nav className="flex-1 px-3 py-6 space-y-1">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded transition-colors ${
                active ? "bg-gold-dark text-cream" : "text-cream/70 hover:bg-cream/10 hover:text-cream"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-6 py-5 text-sm text-cream/60 hover:text-cream border-t border-cream/10"
      >
        <LogOut className="h-4 w-4" /> Sign Out
      </button>
    </aside>
  );
}
