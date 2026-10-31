import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import SortSelect from "@/components/SortSelect";
import { COLLECTIONS, categoryLabel, sortProducts } from "@/lib/catalog";
import { getProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ cat?: string; tag?: string; sort?: string }>;
};

export default async function CollectionPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { cat, tag, sort } = await searchParams;
  const collection = COLLECTIONS[slug];
  if (!collection) notFound();

  const inCollection = (await getProducts()).filter(collection.match);
  const categories = Array.from(new Set(inCollection.map((p) => p.category)));
  let list = inCollection;
  if (tag === "new") list = list.filter((p) => p.isNew || p.tags.includes("new"));
  else if (tag) list = list.filter((p) => p.tags.includes(tag));
  if (cat) list = list.filter((p) => p.category === cat);
  list = sortProducts(list, sort);

  const href = (c?: string) => {
    const q = new URLSearchParams();
    if (c) q.set("cat", c);
    if (tag) q.set("tag", tag);
    if (sort) q.set("sort", sort);
    const s = q.toString();
    return s ? `/c/${slug}?${s}` : `/c/${slug}`;
  };

  return (
    <div className="plp">
      <div className="plp-head">
        <div>
          <h1 className="display">{tag === "new" ? `What's New: ${collection.title}` : collection.title}</h1>
          <div className="plp-count" style={{ marginTop: 14 }}>{list.length} {list.length === 1 ? "item" : "items"}</div>
        </div>
        <Suspense><SortSelect /></Suspense>
      </div>
      {categories.length > 1 && (
        <div className="plp-filters">
          <Link href={href()} className={!cat ? "on" : ""}>All</Link>
          {categories.map((c) => <Link key={c} href={href(c)} className={cat === c ? "on" : ""}>{categoryLabel(c)}</Link>)}
        </div>
      )}
      {list.length === 0 ? (
        <div className="empty">No products here yet.</div>
      ) : (
        <div className="plp-grid">{list.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      )}
    </div>
  );
}
