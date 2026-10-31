import { notFound } from "next/navigation";
import ProductCarousel from "@/components/ProductCarousel";
import ProductDetail from "@/components/ProductDetail";
import { categoryLabel, genderLabel } from "@/lib/catalog";
import { getProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await getProducts();
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const g = genderLabel(product.gender);
  const crumbs = [g];
  if (product.gender !== "unisex") {
    crumbs.push({ label: categoryLabel(product.category), href: `${g.href}?cat=${product.category}` });
  }
  const related = products.filter((p) => p.id !== product.id && p.gender === product.gender).slice(0, 8);

  return (
    <>
      <ProductDetail product={product} crumbs={crumbs} />
      {related.length > 0 && (
        <ProductCarousel title="You may also like" ctaLabel="Shop All" ctaHref={g.href} products={related} />
      )}
    </>
  );
}
