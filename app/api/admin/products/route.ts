import { NextResponse } from "next/server";
import { readStore, writeStore } from "@/lib/store";
import { normaliseProduct } from "@/lib/validate";

export async function GET() {
  return NextResponse.json((await readStore()).products);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const store = await readStore();
  const nextNum = store.products.reduce((max, p) => Math.max(max, Number(p.id.replace(/\D/g, "")) || 0), 0) + 1;
  const product = normaliseProduct(body, `p${String(nextNum).padStart(3, "0")}`);
  if (typeof product === "string") return NextResponse.json({ error: product }, { status: 400 });
  if (store.products.some((p) => p.slug === product.slug)) {
    return NextResponse.json({ error: `Slug "${product.slug}" is already used` }, { status: 409 });
  }
  store.products.unshift(product);
  await writeStore(store);
  return NextResponse.json(product, { status: 201 });
}
