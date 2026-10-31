"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowIcon } from "./Icons";
import type { HeroSlide } from "@/lib/types";

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [i, setI] = useState(0);
  const touchX = useRef<number | null>(null);
  const n = slides.length;

  useEffect(() => {
    if (n < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % n), 7000);
    return () => clearInterval(t);
  }, [n, i]);

  if (n === 0) return null;
  const s = slides[i];

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null || n < 2) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 40) setI((v) => (v + (dx < 0 ? 1 : -1) + n) % n);
      }}
    >
      {slides.map((sl, idx) => (
        <div key={sl.id} className={`hero-slide${idx === i ? " on" : ""}`} aria-hidden={idx !== i}>
          <img src={sl.image} alt="" />
        </div>
      ))}
      <div className="hero-copy">
        <h1 className="display">{s.title}</h1>
        <p>{s.subtitle}</p>
        {s.ctaLabel && <Link href={s.ctaHref || "/"} className="pill pill-white" style={{ height: 46, padding: "0 22px" }}>{s.ctaLabel}</Link>}
      </div>
      {n > 1 && (
        <div className="hero-dots" aria-hidden>
          {slides.map((sl, idx) => <span key={sl.id} className={idx === i ? "on" : ""} />)}
        </div>
      )}
      {n > 1 && (
        <div className="hero-arrows arrows arrows-dark">
          <button aria-label="Previous slide" onClick={() => setI((i - 1 + n) % n)}><ArrowIcon dir="left" /></button>
          <button aria-label="Next slide" onClick={() => setI((i + 1) % n)}><ArrowIcon dir="right" /></button>
        </div>
      )}
    </section>
  );
}
