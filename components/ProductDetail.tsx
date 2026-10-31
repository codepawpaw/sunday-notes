"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { ArrowIcon, HangerIcon, HeartIcon } from "./Icons";
import Swatch from "./Swatch";
import { formatPrice } from "@/lib/format";
import type { Colour, Product } from "@/lib/types";

type Props = {
  product: Product;
  crumbs: { label: string; href: string }[];
};

export default function ProductDetail({ product, crumbs }: Props) {
  const { add } = useCart();
  const trackRef = useRef<HTMLDivElement>(null);
  const initial = product.bestsellerColours[0] ?? product.colours[0];
  const [colour, setColour] = useState<Colour | undefined>(initial);
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [msg, setMsg] = useState<{ text: string; err?: boolean } | null>(null);
  const [liked, setLiked] = useState(false);
  const [slide, setSlide] = useState(0);

  const onTrackScroll = () => {
    const el = trackRef.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    setSlide(Math.min(product.images.length - 1, Math.round(el.scrollLeft / (first.offsetWidth + 3))));
  };

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.6, behavior: "smooth" });
  };

  const addToBag = () => {
    if (!size) {
      setMsg({ text: "Please select a size.", err: true });
      return;
    }
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price,
      colour: colour?.name ?? "",
      size,
    });
    setMsg({ text: "Added to your bag." });
  };

  const swatchButton = (c: Colour, key: string) => (
    <button
      key={key}
      type="button"
      className={`swatch-ring${colour?.name === c.name ? " on" : ""}`}
      style={{ position: "relative" }}
      aria-label={c.name}
      aria-pressed={colour?.name === c.name}
      onClick={() => setColour(c)}
    >
      {c.isNew && <span className="swatch-new">New</span>}
      <Swatch colour={c} large />
    </button>
  );

  return (
    <div className="pdp">
      <div className="pdp-gallery">
        <div className="pdp-track" ref={trackRef} onScroll={onTrackScroll}>
          {product.images.map((src, i) => <img key={src + i} src={src} alt={`${product.name} view ${i + 1}`} />)}
        </div>
        <div className="pdp-counter" aria-hidden>{slide + 1} / {product.images.length}</div>
        <div className="pdp-gallery-ctrl">
          <span className="circle-btn" aria-hidden><HangerIcon /></span>
          <div className="arrows arrows-white">
            <button aria-label="Previous image" onClick={() => scroll(-1)}><ArrowIcon dir="left" /></button>
            <button aria-label="Next image" onClick={() => scroll(1)}><ArrowIcon dir="right" /></button>
          </div>
        </div>
      </div>

      <div className="pdp-info">
        <nav className="crumbs" aria-label="Breadcrumb">
          {crumbs.map((c, i) => (
            <span key={c.href} style={{ display: "contents" }}>
              {i > 0 && <span aria-hidden>/</span>}
              <Link href={c.href}>{c.label}</Link>
            </span>
          ))}
        </nav>

        <div className="pdp-title-row">
          <h1 className="pdp-title">
            {product.name}
            {product.fabric && <> <span className="fabric">{product.fabric}</span></>}
          </h1>
          <button aria-label="Add to wish list" aria-pressed={liked} onClick={() => setLiked(!liked)} style={{ color: liked ? "#d22030" : undefined }}>
            <HeartIcon />
          </button>
        </div>
        <div className="pdp-price">{formatPrice(product.price)}</div>

        {colour && (
          <div className="pdp-label"><b>Colour</b>{colour.name}</div>
        )}
        {product.bestsellerColours.length > 0 && (
          <>
            <div className="pdp-sub">Bestsellers</div>
            <div className="swatch-grid">{product.bestsellerColours.map((c) => swatchButton(c, "b-" + c.name))}</div>
          </>
        )}
        {product.colours.length > 0 && (
          <>
            <div className="pdp-sub" style={{ marginTop: 34 }}>Colours</div>
            <div className="swatch-grid">{product.colours.map((c) => swatchButton(c, "c-" + c.name))}</div>
          </>
        )}

        <div className="pdp-label" style={{ marginTop: 56 }}><b>Select Size</b></div>
        <div className="size-grid">
          {product.sizes.map((s) => (
            <button key={s} type="button" className={`size-btn${size === s ? " on" : ""}`} onClick={() => { setSize(s); setMsg(null); }}>{s}</button>
          ))}
        </div>

        <button className="btn-block pill-black" style={{ marginTop: 28 }} onClick={addToBag}>Add to Bag</button>
        {msg && (
          <div className={`pdp-msg${msg.err ? " err" : ""}`}>
            {msg.text} {!msg.err && <Link href="/bag" style={{ textDecoration: "underline" }}>View bag</Link>}
          </div>
        )}

        <div className="pdp-desc">{product.description}</div>
      </div>

      <div className="pdp-sticky">
        <div>
          <div className="pdp-sticky-name">{product.name}</div>
          <div>{formatPrice(product.price)}{size ? ` · Size ${size}` : ""}</div>
        </div>
        <button className="pill pill-black" onClick={addToBag}>Add to Bag</button>
      </div>
    </div>
  );
}
