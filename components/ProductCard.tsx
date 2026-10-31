import Link from "next/link";
import Swatch from "./Swatch";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function ProductCard({ product, showSwatches = true }: { product: Product; showSwatches?: boolean }) {
  const swatches = product.colours.slice(0, 3);
  return (
    <Link href={`/p/${product.slug}`} className="card">
      <div className="card-img">
        {product.isNew && <span className="badge-new">New</span>}
        <img src={product.images[0]} alt={product.name} loading="lazy" />
        {product.images[1] && <img className="alt" src={product.images[1]} alt="" loading="lazy" />}
      </div>
      <div className="card-body">
        <div className="card-name">
          {product.name}
          {product.fabric && <> <span className="fabric">*{product.fabric}</span></>}
        </div>
        <div className="card-price">{formatPrice(product.price)}</div>
      </div>
      {showSwatches && swatches.length > 1 && (
        <div className="card-swatches">
          {swatches.map((c, i) => (
            <span key={c.name} className={`swatch-ring${i === 0 ? " on" : ""}`}><Swatch colour={c} /></span>
          ))}
        </div>
      )}
    </Link>
  );
}
