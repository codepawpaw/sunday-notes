import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCarousel from "@/components/ProductCarousel";
import TabbedTiles from "@/components/TabbedTiles";
import { readStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { site, products } = await readStore();
  const newWomen = products.filter((p) => p.isNew && p.gender === "women");
  const newMen = products.filter((p) => p.isNew && p.gender === "men");

  return (
    <>
      <HeroCarousel slides={site.hero} />
      <TabbedTiles title="New and trending" women={site.trending.women} men={site.trending.men} variant="trending" />
      <TabbedTiles title="Shop by colour" women={site.colours.women} men={site.colours.men} variant="colour" />

      <section className="banner">
        <img src={site.banner.image} alt="" />
        <div className="banner-word" aria-hidden>{site.banner.title}</div>
        <div className="banner-copy">
          <div className="eyebrow">{site.banner.eyebrow}</div>
          <p>{site.banner.subtitle}</p>
          <Link href={site.banner.ctaHref} className="pill pill-white">{site.banner.ctaLabel}</Link>
        </div>
      </section>

      <ProductCarousel title={site.whatsNew.title} ctaLabel={site.whatsNew.women.ctaLabel} ctaHref={site.whatsNew.women.ctaHref} products={newWomen} />
      {newMen.length > 0 && (
        <ProductCarousel title="New for him." ctaLabel={site.whatsNew.men.ctaLabel} ctaHref={site.whatsNew.men.ctaHref} products={newMen} />
      )}
    </>
  );
}
