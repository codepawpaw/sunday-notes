import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const term = q.trim().toLowerCase();
  const results = term
    ? (await getProducts()).filter((p) =>
        [p.name, p.fabric ?? "", p.category, p.gender, ...p.tags].join(" ").toLowerCase().includes(term))
    : [];

  return (
    <div className="plp">
      <div className="plp-head">
        <div>
          <h1 className="display">{term ? `Results for “${q}”` : "Search"}</h1>
          <div className="plp-count" style={{ marginTop: 14 }}>{results.length} {results.length === 1 ? "item" : "items"}</div>
        </div>
      </div>
      {results.length === 0 ? (
        <div className="empty">{term ? "We couldn't find anything matching your search." : "Type something to search."}</div>
      ) : (
        <div className="plp-grid">{results.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      )}
    </div>
  );
}
