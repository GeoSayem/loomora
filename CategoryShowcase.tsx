import Link from "next/link";
import Image from "next/image";

const SHOWCASE = [
  {
    name: "Persian Style Rugs",
    slug: "persian-style-rugs",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?q=80&w=1200",
  },
  {
    name: "Hand Tufted Carpets",
    slug: "hand-tufted-carpets",
    image: "https://images.unsplash.com/photo-1616627981052-6a3bf6a5f5a1?q=80&w=1200",
  },
  {
    name: "Modern Rugs",
    slug: "modern-rugs",
    image: "https://images.unsplash.com/photo-1615529162924-f8605388461d?q=80&w=1200",
  },
];

export function CategoryShowcase() {
  return (
    <section className="py-16 md:py-20">
      <div className="container-luxe">
        <div className="text-center max-w-lg mx-auto mb-12">
          <p className="eyebrow">Featured Collections</p>
          <h2 className="text-3xl md:text-4xl mt-2">Shop by craft</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {SHOWCASE.map((c) => (
            <Link key={c.slug} href={`/products?category=${c.slug}`} className="group relative block aspect-[3/4] overflow-hidden">
              <Image
                src={c.image}
                alt={c.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
              <div className="absolute bottom-6 left-6 text-cream">
                <h3 className="font-display text-2xl">{c.name}</h3>
                <span className="text-xs uppercase tracking-wide border-b border-cream/60">
                  Explore
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
