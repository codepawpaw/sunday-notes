"use client";

import { useRef, useState } from "react";
import { Field, Text, uploadImage } from "./fields";
import type { Colour, Product } from "@/lib/types";

export type ProductDraft = Omit<Product, "id"> & { id?: string };

export const EMPTY_PRODUCT: ProductDraft = {
  slug: "", name: "", fabric: "", price: 0, gender: "women", category: "tops", tags: [], images: [],
  bestsellerColours: [], colours: [], sizes: ["XS", "S", "M", "L", "XL"], description: "", isNew: true,
};

const CATEGORIES = ["tops", "bras", "leggings", "pants", "shorts", "hoodies", "outerwear", "accessories"];

// Colours are edited one per line as "Name|#hex" or "Name|#hex|#hex2", with an optional trailing "|new".
function coloursToText(list: Colour[]): string {
  return list.map((c) => [c.name, c.hex, c.hex2, c.isNew ? "new" : undefined].filter(Boolean).join("|")).join("\n");
}

function textToColours(text: string): Colour[] {
  return text.split("\n").map((l) => l.trim()).filter(Boolean).map((line) => {
    const parts = line.split("|").map((s) => s.trim());
    const isNew = parts[parts.length - 1]?.toLowerCase() === "new";
    if (isNew) parts.pop();
    const [name, hex = "#cccccc", hex2] = parts;
    return { name, hex, ...(hex2 ? { hex2 } : {}), ...(isNew ? { isNew: true } : {}) };
  });
}

const splitList = (s: string, sep: RegExp) => s.split(sep).map((x) => x.trim()).filter(Boolean);

export default function ProductForm({ initial, onSave, onCancel, onError, saving }: {
  initial: ProductDraft;
  onSave: (p: ProductDraft) => void;
  onCancel: () => void;
  onError: (msg: string) => void;
  saving: boolean;
}) {
  const [p, setP] = useState<ProductDraft>(initial);
  const [images, setImages] = useState(initial.images.join("\n"));
  const [best, setBest] = useState(coloursToText(initial.bestsellerColours));
  const [colours, setColours] = useState(coloursToText(initial.colours));
  const [sizes, setSizes] = useState(initial.sizes.join(", "));
  const [tags, setTags] = useState(initial.tags.join(", "));
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const set = <K extends keyof ProductDraft>(k: K, v: ProductDraft[K]) => setP((prev) => ({ ...prev, [k]: v }));
  const imageList = splitList(images, /\n/);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...p,
      images: imageList,
      bestsellerColours: textToColours(best),
      colours: textToColours(colours),
      sizes: splitList(sizes, /,/),
      tags: splitList(tags, /,/),
    });
  };

  return (
    <form className="adm-card" onSubmit={submit}>
      <h3>{initial.id ? `Edit product · ${initial.id}` : "New product"}</h3>
      <div className="adm-grid">
        <Text label="Name" value={p.name} onChange={(v) => set("name", v)} />
        <Text label="Fabric / subtitle" value={p.fabric ?? ""} onChange={(v) => set("fabric", v)} hint="Shown in grey after the name" />
        <Field label="Price (USD)">
          <input type="number" min={0} step="0.01" value={p.price} onChange={(e) => set("price", Number(e.target.value))} />
        </Field>
        <Text label="Slug" value={p.slug} onChange={(v) => set("slug", v)} hint="Leave empty to generate from the name" />
        <Field label="Gender">
          <select value={p.gender} onChange={(e) => set("gender", e.target.value as Product["gender"])}>
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="unisex">Unisex</option>
          </select>
        </Field>
        <Field label="Category">
          <select value={p.category} onChange={(e) => set("category", e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Text label="Tags" value={tags} onChange={setTags} hint="Comma separated: new, activity, outerwear, markdown, trending, bestseller" />
        <Text label="Sizes" value={sizes} onChange={setSizes} hint="Comma separated, e.g. 0, 2, 4, 6 or XS, S, M" />
        <label className="check full"><input type="checkbox" checked={!!p.isNew} onChange={(e) => set("isNew", e.target.checked)} /> Mark as New (shown in “What’s new” carousel)</label>

        <div className="fld full">
          <span>Images</span>
          <textarea value={images} onChange={(e) => setImages(e.target.value)} placeholder="One image URL per line" />
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button type="button" className="abtn" disabled={uploading} onClick={() => fileRef.current?.click()}>{uploading ? "Uploading…" : "Upload images"}</button>
            <small style={{ color: "#777" }}>The first image is the main photo, the second shows on hover.</small>
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={async (e) => {
              const files = Array.from(e.target.files ?? []);
              e.target.value = "";
              if (files.length === 0) return;
              setUploading(true);
              try {
                const urls: string[] = [];
                for (const f of files) urls.push(await uploadImage(f));
                setImages((prev) => [...splitList(prev, /\n/), ...urls].join("\n"));
              } catch (err) { onError((err as Error).message); }
              setUploading(false);
            }} />
          </div>
          {imageList.length > 0 && <div className="adm-thumbs">{imageList.map((src, i) => <img key={src + i} src={src} alt="" />)}</div>}
        </div>

        <Field label="Bestseller colours" hint="One per line: Name|#hex, Name|#hex|#hex2 for split swatches, append |new for a New badge">
          <textarea value={best} onChange={(e) => setBest(e.target.value)} />
        </Field>
        <Field label="All colours" hint="Same format as bestseller colours">
          <textarea value={colours} onChange={(e) => setColours(e.target.value)} />
        </Field>
        <Field label="Description" full>
          <textarea style={{ fontFamily: "inherit", fontSize: 14 }} value={p.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
      </div>
      <div className="adm-actions" style={{ marginTop: 18 }}>
        <button type="button" className="abtn" onClick={onCancel}>Cancel</button>
        <button className="abtn primary" disabled={saving}>{saving ? "Saving…" : "Save product"}</button>
      </div>
    </form>
  );
}
