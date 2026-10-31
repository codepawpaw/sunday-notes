import { NextResponse } from "next/server";
import { readStore, writeStore } from "@/lib/store";
import type { SiteContent } from "@/lib/types";

export async function GET() {
  return NextResponse.json((await readStore()).site);
}

export async function PUT(req: Request) {
  const site = (await req.json().catch(() => null)) as SiteContent | null;
  if (!site || typeof site.brandName !== "string" || !Array.isArray(site.hero)) {
    return NextResponse.json({ error: "Invalid site content" }, { status: 400 });
  }
  const store = await readStore();
  store.site = site;
  await writeStore(store);
  return NextResponse.json(site);
}
