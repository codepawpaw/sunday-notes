"use client";

import Link from "next/link";
import { useState } from "react";
import { PlusIcon } from "./Icons";

const COLS = [
  { title: "Help", links: [["Contact Us", "#"], ["Shipping Policy", "#"], ["Returns", "#"], ["Order Status", "/bag"], ["Size Guide", "#"]] },
  { title: "Shop", links: [["Women", "/c/women"], ["Men", "/c/men"], ["Accessories", "/c/accessories"], ["Outerwear", "/c/outerwear"], ["We Made Too Much", "/c/we-made-too-much"]] },
  { title: "Account", links: [["Sign In", "/admin"], ["Wish List", "#"], ["Bag", "/bag"]] },
  { title: "About", links: [["Our Story", "#"], ["Sustainability", "#"], ["Careers", "#"], ["Stores", "#"]] },
];

// Columns are always expanded on desktop; on mobile they collapse into an accordion (see .footer-col in globals.css).
export default function Footer({ brandName }: { brandName: string }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <footer className="footer">
      <div className="footer-news footer-news-m">
        <h4>Stay in the loop</h4>
        <div>Get early access to new drops and events.</div>
        <input type="email" placeholder="Email address" aria-label="Email address" />
        <button className="pill pill-black" type="button">Sign Up</button>
      </div>
      <div className="footer-cols">
        {COLS.map((c) => {
          const isOpen = open === c.title;
          return (
            <div key={c.title} className={`footer-col${isOpen ? " open" : ""}`}>
              <button type="button" className="footer-col-head" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : c.title)}>
                <h4>{c.title}</h4>
                <span className="footer-plus"><PlusIcon /></span>
              </button>
              <ul>{c.links.map(([label, href]) => <li key={label}><Link href={href}>{label}</Link></li>)}</ul>
            </div>
          );
        })}
        <div className="footer-news footer-news-d">
          <h4>Stay in the loop</h4>
          <div>Get early access to new drops and events.</div>
          <input type="email" placeholder="Email address" aria-label="Email address" />
          <button className="pill pill-black" type="button">Sign Up</button>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {brandName}. All rights reserved.</span>
        <span>Privacy Policy · Terms of Use · Accessibility</span>
      </div>
    </footer>
  );
}
