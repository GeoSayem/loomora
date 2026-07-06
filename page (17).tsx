import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductOptions } from "@/components/products/ProductOptions";
import { ProductCard } from "@/components/products/ProductCard";
import { Reviews } from "@/components/products/Reviews";
import type { Product as ProductType } from "@/types";

async function getProduct(slug: string) {
  await connectDB();
  const product = await Product.findOne({ slug, isActive: true }).lean();
  if (!product) return null;
  const related = await Product.find({
    category: (product as any).category,
    slug: { $ne: slug },
    isActive: true,
  })
    .limit(4)
    .lean();
  return {
    product: JSON.parse(JSON.stringify(product)) as ProductType,
    related: JSON.parse(JSON.stringify(related)) as ProductType[],
  };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getProduct(params.slug);
  if (!data) return { title: "Product Not Found" };
  const { product } = data;
  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.description.slice(0, 155),
    openGraph: { images: [product.images[0]] },
    alternates: { canonical: `/products/${product.slug}` },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const data = await getProduct(params.slug);
  if (!data) notFound();
  const { product, related } = data;

  return (
    <div className="container-luxe py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            image: product.images,
            description: product.description,
            sku: product._id,
            brand: { "@type": "Brand", name: "Loomora & Co." },
            aggregateRating: product.ratingCount
              ? {
                  "@type": "AggregateRating",
                  ratingValue: product.ratingAverage,
                  reviewCount: product.ratingCount,
                }
              : undefined,
            offers: {
              "@type": "Offer",
              priceCurrency: "INR",
              price: product.basePrice,
              availability:
                product.totalStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            },
          }),
        }}
      />

      <div className="grid md:grid-cols-2 gap-12">
        <ProductGallery images={product.images} name={product.name} />
        <ProductOptions product={product} />
      </div>

      <Reviews productId={product._id} />

      {related.length > 0 && (
        <section className="mt-20 border-t border-line pt-12">
          <h2 className="font-display text-2xl mb-8">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
