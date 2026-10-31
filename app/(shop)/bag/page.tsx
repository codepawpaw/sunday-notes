"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/format";

const FREE_SHIPPING_MIN = 75;

export default function BagPage() {
  const { items, subtotal, setQty, remove } = useCart();
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_MIN ? 0 : 8;

  return (
    <div className="bag">
      <h1 className="display">Your Bag</h1>
      <div>
        {items.length === 0 ? (
          <div className="empty" style={{ textAlign: "left", padding: "24px 0" }}>
            Your bag is empty. <Link href="/c/new" style={{ textDecoration: "underline" }}>Shop what&apos;s new</Link>
          </div>
        ) : (
          items.map((i) => (
            <div key={i.key} className="bag-item">
              <Link href={`/p/${i.slug}`}><img src={i.image} alt={i.name} /></Link>
              <div>
                <Link href={`/p/${i.slug}`} style={{ fontWeight: 500 }}>{i.name}</Link>
                <div className="meta">{i.colour}{i.colour && " · "}Size {i.size}</div>
                <div className="qty">
                  <button aria-label="Decrease quantity" onClick={() => setQty(i.key, i.qty - 1)}>−</button>
                  <span>{i.qty}</span>
                  <button aria-label="Increase quantity" onClick={() => setQty(i.key, i.qty + 1)}>+</button>
                </div>
                <div><button className="link-btn" onClick={() => remove(i.key)}>Remove</button></div>
              </div>
              <div>{formatPrice(i.price * i.qty)}</div>
            </div>
          ))
        )}
      </div>
      <aside className="summary">
        <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 12 }}>Order Summary</div>
        <div className="summary-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
        <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span></div>
        <div className="summary-row total"><span>Estimated Total</span><span>{formatPrice(subtotal + shipping)}</span></div>
        <button className="btn-block pill-black" style={{ marginTop: 18 }} disabled={items.length === 0}
          onClick={() => alert("Checkout is not connected in this demo.")}>Checkout</button>
      </aside>
    </div>
  );
}
