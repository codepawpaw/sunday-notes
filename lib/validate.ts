import { slugify } from "./store";
import type { Product } from "./types";

// Normalises an admin-submitted product; returns an error string when required fields are missing.
export function normaliseProduct(input: Partial<Product>, id: string): Product | string {
  const name = (input.name ?? "").trim();
  if (!name) return "Name is required";
  const price = Number(input.price);
  if (!Number.isFinite(price) || price < 0) return "Price must be a positive number";
  const images = (input.images ?? []).map((s) => s.trim()).filter(Boolean);
  if (images.length === 0) return "At least one image is required";
  const sizes = (input.sizes ?? []).map((s) => s.trim()).filter(Boolean);
  if (sizes.length === 0) return "At least one size is required";

  const fabric = (input.fabric ?? "").trim();
  return {
    id,
    slug: slugify(input.slug?.trim() || `${name} ${fabric}`),
    name,
    fabric,
    price,
    gender: input.gender === "men" || input.gender === "unisex" ? input.gender : "women",
    category: (input.category ?? "tops").trim() || "tops",
    tags: (input.tags ?? []).map((t) => t.trim()).filter(Boolean),
    images,
    bestsellerColours: input.bestsellerColours ?? [],
    colours: input.colours ?? [],
    sizes,
    description: (input.description ?? "").trim(),
    isNew: !!input.isNew,
  };
}
