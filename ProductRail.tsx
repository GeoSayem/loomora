import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import { Product } from "@/types";
import { WeaveDivider } from "@/components/shared/WeaveDivider";

export function ProductRail({
  eyebrow,
  title,
  products,
  viewAllHref,
  showDivider = true,
}: {
  eyebrow: string;
  title: string;
  products: Product[];
  viewAllHref: string;
  showDivider?: boolean;
}) {
  if (products.length === 0) return null;

  return (
    <section className="py-16 md:py-20">
      <div className="container-luxe">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="text-3xl md:text-4xl mt-2">{title}</h2>
          </div>
          <Link href={viewAllHref} className="hidden md:block text-sm uppercase tracking-wide border-b border-ink hover:text-gold-dark hover:border-gold-dark">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
        <Link href={viewAllHref} className="md:hidden mt-8 inline-block text-sm uppercase tracking-wide border-b border-ink">
          View All
        </Link>
      </div>
      {showDivider && <WeaveDivider />}
    </section>
  );
}
