// src/components/Hero.tsx
"use client";
import Carousel from "./Carousel"; // <- correct path

export default function Hero() {
  return (
    <section className="relative">
      {/* carousel as hero banner */}
      <Carousel />
    </section>
  );
}
