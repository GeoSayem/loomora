"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<{ backgroundPosition: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({ backgroundPosition: `${x}% ${y}%` });
  }

  return (
    <div>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setZoomStyle(null)}
        className="relative aspect-square bg-sand overflow-hidden cursor-zoom-in"
      >
        <Image
          src={images[active]}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
        {zoomStyle && (
          <div
            className="absolute inset-0 pointer-events-none bg-no-repeat"
            style={{
              backgroundImage: `url(${images[active]})`,
              backgroundSize: "220%",
              ...zoomStyle,
            }}
          />
        )}
      </div>
      <div className="grid grid-cols-5 gap-3 mt-4">
        {images.map((img, i) => (
          <button
            key={img + i}
            onClick={() => setActive(i)}
            className={`relative aspect-square bg-sand overflow-hidden border ${
              active === i ? "border-gold" : "border-transparent"
            }`}
          >
            <Image src={img} alt={`${name} thumbnail ${i + 1}`} fill sizes="100px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
