"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import { ArrowIcon } from "./Icons";
import type { Product } from "@/lib/types";

type Props = {
  title: string;
  ctaLabel: string;
  ctaHref: string;
  products: Product[];
};

export default function ProductCarousel({ title, ctaLabel, ctaHref, products }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  };

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [products.length]);

  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="wn-section">
      <div className="wn-head" style={{ paddingLeft: 6 }}>
        <h2 className="display">{title}</h2>
        <Link href={ctaHref} className="pill pill-black" style={{ height: 42 }}>{ctaLabel}</Link>
      </div>
      <div className="carousel" ref={ref} onScroll={update}>
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      <div className="carousel-foot">
        <div className="arrows arrows-outline">
          <button aria-label="Scroll left" disabled={atStart} onClick={() => scrollBy(-1)}><ArrowIcon dir="left" /></button>
          <button aria-label="Scroll right" disabled={atEnd} onClick={() => scrollBy(1)}><ArrowIcon dir="right" /></button>
        </div>
      </div>
    </section>
  );
}
