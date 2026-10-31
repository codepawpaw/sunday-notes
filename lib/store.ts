import { promises as fs } from "fs";
import path from "path";
import type { Product, Store } from "./types";

const STORE_PATH = path.join(process.cwd(), "data", "store.json");

export async function readStore(): Promise<Store> {
  const raw = await fs.readFile(STORE_PATH, "utf8");
  return JSON.parse(raw) as Store;
}

// Write to a temp file then rename, so a crash mid-write never leaves a truncated store.json.
export async function writeStore(store: Store): Promise<void> {
  const tmp = `${STORE_PATH}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(store, null, 2) + "\n", "utf8");
  await fs.rename(tmp, STORE_PATH);
}

export async function getProducts(): Promise<Product[]> {
  return (await readStore()).products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return (await getProducts()).find((p) => p.slug === slug);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
