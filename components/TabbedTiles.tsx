"use client";

import Link from "next/link";
import { useState } from "react";
import type { Tile } from "@/lib/types";

type Props = {
  title: string;
  women: Tile[];
  men: Tile[];
  variant: "trending" | "colour";
};

export default function TabbedTiles({ title, women, men, variant }: Props) {
  const [tab, setTab] = useState<"women" | "men">("women");
  const tiles = tab === "women" ? women : men;
  const isColour = variant === "colour";

  return (
    <section className="section" style={isColour ? { paddingTop: 120 } : undefined}>
      <div className="section-head">
        <h2 className="display">{title}</h2>
        <div className="tabs" role="tablist">
          <button role="tab" aria-selected={tab === "women"} className={tab === "women" ? "on" : ""} onClick={() => setTab("women")}>Women&apos;s</button>
          <button role="tab" aria-selected={tab === "men"} className={tab === "men" ? "on" : ""} onClick={() => setTab("men")}>Men&apos;s</button>
        </div>
      </div>
      <div className={isColour ? "grid-6" : "grid-4"}>
        {tiles.map((t) => (
          <Link key={t.id} href={t.href} className="tile">
            <div className="tile-img" style={t.bg ? { background: t.bg } : undefined}>
              <img src={t.image} alt={t.title} loading="lazy" />
            </div>
            <div className={`tile-label ${isColour ? "center" : "lg"}`}>{t.title}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
