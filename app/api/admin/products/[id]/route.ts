import { NextResponse } from "next/server";
import { readStore, writeStore } from "@/lib/store";
import { normaliseProduct } from "@/lib/validate";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params;
  const store = await readStore();
  const idx = store.products.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const product = normaliseProduct(await req.json().catch(() => ({})), id);
  if (typeof product === "string") return NextResponse.json({ error: product }, { status: 400 });
  if (store.products.some((p) => p.slug === product.slug && p.id !== id)) {
    return NextResponse.json({ error: `Slug "${product.slug}" is already used` }, { status: 409 });
  }
  store.products[idx] = product;
  await writeStore(store);
  return NextResponse.json(product);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const store = await readStore();
  const before = store.products.length;
  store.products = store.products.filter((p) => p.id !== id);
  if (store.products.length === before) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  await writeStore(store);
  return NextResponse.json({ ok: true });
}
