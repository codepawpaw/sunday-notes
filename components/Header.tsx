"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { BagIcon, BrandMark, CloseIcon, GlobeIcon, MenuIcon, SearchIcon, UserIcon } from "./Icons";

export const NAV_LINKS = [
  { label: "New & Featured", href: "/c/new" },
  { label: "Women", href: "/c/women" },
  { label: "Men", href: "/c/men" },
  { label: "Accessories", href: "/c/accessories" },
  { label: "Outerwear", href: "/c/outerwear" },
  { label: "Activity", href: "/c/activity" },
  { label: "We Made Too Much", href: "/c/we-made-too-much" },
];

const SUGGESTIONS = ["Leggings", "Jacket", "Hoodie", "Short", "Bag", "Pant"];

export default function Header({ brandName }: { brandName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setSearchOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  const submit = (term: string) => {
    const t = term.trim();
    if (!t) return;
    router.push(`/search?q=${encodeURIComponent(t)}`);
    setSearchOpen(false);
  };

  return (
    <>
      <div className="header-wrap">
        <header className={`header${scrolled ? " scrolled" : ""}`}>
          <button className="menu-btn" aria-label="Open menu" onClick={() => setMenuOpen(true)}><MenuIcon /></button>
          <Link href="/" className="logo" aria-label={`${brandName} home`}>
            <BrandMark />
            <span>{brandName}</span>
          </Link>
          <nav className="nav" aria-label="Main">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={pathname === l.href ? "active" : undefined}>{l.label}</Link>
            ))}
          </nav>
          <div className="header-actions">
            <button className="act" onClick={() => setSearchOpen(true)}><SearchIcon /><span>Search</span></button>
            <button className="act" aria-label="Region"><GlobeIcon /><span>US (USD)</span></button>
            <Link className="act" href="/admin" aria-label="Account"><UserIcon /></Link>
            <Link className="bag-btn" href="/bag" aria-label={`Bag, ${count} items`}>
              <BagIcon />
              {count > 0 && <span className="bag-count">{count}</span>}
            </Link>
          </div>
        </header>
      </div>

      {searchOpen && (
        <div className="search-overlay" onClick={() => setSearchOpen(false)}>
          <div className="search-panel" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={(e) => { e.preventDefault(); submit(q); }}>
              <SearchIcon size={24} />
              <input autoFocus placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
              <button type="button" aria-label="Close search" onClick={() => setSearchOpen(false)}><CloseIcon size={20} /></button>
            </form>
            <div className="search-suggest">
              {SUGGESTIONS.map((s) => (
                <button key={s} className="chip" onClick={() => submit(s)}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="mobile-nav">
          <button aria-label="Close menu" onClick={() => setMenuOpen(false)} style={{ alignSelf: "flex-end" }}><CloseIcon size={22} /></button>
          {NAV_LINKS.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}
        </div>
      )}
    </>
  );
}
