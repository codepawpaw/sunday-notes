import type { Product } from "./types";

export const COLLECTIONS: Record<string, { title: string; match: (p: Product) => boolean }> = {
  new: { title: "New & Featured", match: (p) => !!p.isNew || p.tags.includes("new") },
  women: { title: "Women's Clothes", match: (p) => p.gender === "women" },
  men: { title: "Men's Clothes", match: (p) => p.gender === "men" },
  accessories: { title: "Accessories", match: (p) => p.category === "accessories" },
  outerwear: { title: "Outerwear", match: (p) => p.category === "outerwear" },
  activity: { title: "Activity", match: (p) => p.tags.includes("activity") },
  "we-made-too-much": { title: "We Made Too Much", match: (p) => p.tags.includes("markdown") },
};

export const SORTS = {
  featured: "Featured",
  new: "New Arrivals",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
} as const;

export type SortKey = keyof typeof SORTS;

export function sortProducts(list: Product[], sort: string | undefined): Product[] {
  const out = [...list];
  if (sort === "price-asc") out.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") out.sort((a, b) => b.price - a.price);
  else if (sort === "new") out.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
  return out;
}

export function categoryLabel(category: string): string {
  const map: Record<string, string> = {
    tops: "Tops", leggings: "Leggings", outerwear: "Coats & Jackets", pants: "Pants", hoodies: "Hoodies & Sweatshirts",
    bras: "Sports Bras", shorts: "Shorts", accessories: "Bags & Accessories",
  };
  return map[category] ?? category.charAt(0).toUpperCase() + category.slice(1);
}

export function genderLabel(gender: Product["gender"]): { label: string; href: string } {
  if (gender === "women") return { label: "Women's Clothes", href: "/c/women" };
  if (gender === "men") return { label: "Men's Clothes", href: "/c/men" };
  return { label: "Accessories", href: "/c/accessories" };
}
