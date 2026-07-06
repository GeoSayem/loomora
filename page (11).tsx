import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { Hero } from "@/components/home/Hero";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { ProductRail } from "@/components/home/ProductRail";
import { Testimonials } from "@/components/home/Testimonials";
import { Newsletter } from "@/components/home/Newsletter";
import { WeaveDivider } from "@/components/shared/WeaveDivider";
import type { Product as ProductType } from "@/types";

async function getHomeProducts() {
  await connectDB();
  const [featured, bestSellers, newArrivals] = await Promise.all([
    Product.find({ isActive: true, tags: "featured" }).limit(4).lean(),
    Product.find({ isActive: true, tags: "best-seller" }).limit(4).lean(),
    Product.find({ isActive: true, tags: "new-arrival" }).sort({ createdAt: -1 }).limit(4).lean(),
  ]);
  return {
    featured: JSON.parse(JSON.stringify(featured)) as ProductType[],
    bestSellers: JSON.parse(JSON.stringify(bestSellers)) as ProductType[],
    newArrivals: JSON.parse(JSON.stringify(newArrivals)) as ProductType[],
  };
}

export default async function HomePage() {
  const { featured, bestSellers, newArrivals } = await getHomeProducts();

  return (
    <>
      <Hero />
      <CategoryShowcase />
      <WeaveDivider />
      <ProductRail
        eyebrow="Handpicked by our studio"
        title="Featured Collection"
        products={featured}
        viewAllHref="/products?tag=featured"
      />
      <ProductRail
        eyebrow="Loved again and again"
        title="Best Sellers"
        products={bestSellers}
        viewAllHref="/products?tag=best-seller"
      />
      <ProductRail
        eyebrow="Fresh off the loom"
        title="New Arrivals"
        products={newArrivals}
        viewAllHref="/products?tag=new-arrival"
        showDivider={false}
      />
      <Testimonials />
      <Newsletter />
    </>
  );
}
