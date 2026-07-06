const TESTIMONIALS = [
  {
    quote:
      "The craftsmanship is extraordinary — you can feel the hours of hand-knotting in every knot. Our living room finally feels finished.",
    name: "Eleanor W.",
    location: "London, UK",
  },
  {
    quote:
      "I ordered a custom size for an awkward hallway and the estimate tool got it right on the first try. Arrived exactly as pictured.",
    name: "Marcus D.",
    location: "Austin, USA",
  },
  {
    quote:
      "Genuinely heirloom quality. The wool is thick, dense, and the Persian-style pattern looks even better in person.",
    name: "Fatima A.",
    location: "Dubai, UAE",
  },
];

export function Testimonials() {
  return (
    <section className="bg-sand py-20">
      <div className="container-luxe">
        <div className="text-center max-w-lg mx-auto mb-14">
          <p className="eyebrow">In their homes</p>
          <h2 className="text-3xl md:text-4xl mt-2">What collectors are saying</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="card-surface p-8">
              <blockquote className="font-display text-lg leading-relaxed text-ink">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 text-sm text-espresso">
                <span className="text-ink font-medium">{t.name}</span> · {t.location}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
