import Link from "next/link";

const COLS = [
  { title: "Help", links: [["Contact Us", "#"], ["Shipping Policy", "#"], ["Returns", "#"], ["Order Status", "/bag"], ["Size Guide", "#"]] },
  { title: "Shop", links: [["Women", "/c/women"], ["Men", "/c/men"], ["Accessories", "/c/accessories"], ["Outerwear", "/c/outerwear"], ["We Made Too Much", "/c/we-made-too-much"]] },
  { title: "Account", links: [["Sign In", "/admin"], ["Wish List", "#"], ["Bag", "/bag"]] },
  { title: "About", links: [["Our Story", "#"], ["Sustainability", "#"], ["Careers", "#"], ["Stores", "#"]] },
];

export default function Footer({ brandName }: { brandName: string }) {
  return (
    <footer className="footer">
      <div className="footer-cols">
        {COLS.map((c) => (
          <div key={c.title}>
            <h4>{c.title}</h4>
            <ul>{c.links.map(([label, href]) => <li key={label}><Link href={href}>{label}</Link></li>)}</ul>
          </div>
        ))}
        <div className="footer-news">
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
