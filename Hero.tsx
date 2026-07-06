import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative h-[92vh] min-h-[600px] w-full overflow-hidden bg-ink">
      <Image
        src="https://images.unsplash.com/photo-1600166898405-da9535204843?q=80&w=2400"
        alt="Hand-knotted wool rug in a sunlit living room"
        fill
        priority
        className="object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />

      <div className="relative h-full container-luxe flex flex-col justify-end pb-24 text-cream">
        <p className="eyebrow text-gold-light animate-fadeUp">Hand-knotted since 1994</p>
        <h1 className="font-display text-5xl md:text-7xl leading-[1.05] max-w-2xl mt-4 animate-fadeUp [animation-delay:150ms] opacity-0 [animation-fill-mode:forwards]">
          Rugs woven thread by thread, for rooms meant to last generations
        </h1>
        <p className="mt-6 max-w-md text-cream/80 text-sm md:text-base animate-fadeUp [animation-delay:300ms] opacity-0 [animation-fill-mode:forwards]">
          Every Loomora piece is hand-tufted or hand-knotted by master weavers in our
          Bhadohi workshop — no two are ever quite the same.
        </p>
        <div className="mt-9 flex flex-wrap gap-4 animate-fadeUp [animation-delay:450ms] opacity-0 [animation-fill-mode:forwards]">
          <Link href="/products" className="btn-gold">
            Shop the Collection
          </Link>
          <Link href="/custom-order" className="btn-secondary !border-cream !text-cream hover:!bg-cream hover:!text-ink">
            Design a Custom Rug
          </Link>
        </div>
      </div>
    </section>
  );
}
