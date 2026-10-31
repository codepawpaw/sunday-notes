"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BrandMark } from "../Icons";
import ProductForm, { EMPTY_PRODUCT, type ProductDraft } from "./ProductForm";
import SiteEditor from "./SiteEditor";
import { formatPrice } from "@/lib/format";
import type { Product, SiteContent, Store } from "@/lib/types";

type Toast = { text: string; err?: boolean } | null;

export default function AdminDashboard({ initial }: { initial: Store }) {
  const [tab, setTab] = useState<"products" | "site">("products");
  const [products, setProducts] = useState<Product[]>(initial.products);
  const [site, setSite] = useState<SiteContent>(initial.site);
  const [editing, setEditing] = useState<ProductDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState<Toast>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const notifyError = (text: string) => setToast({ text, err: true });

  const api = async <T,>(url: string, method: string, body?: unknown): Promise<T> => {
    const res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 401) {
      window.location.href = "/admin/login";
      throw new Error("Session expired");
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error ?? "Request failed");
    return data as T;
  };

  const saveProduct = async (draft: ProductDraft) => {
    setSaving(true);
    try {
      if (draft.id) {
        const saved = await api<Product>(`/api/admin/products/${draft.id}`, "PUT", draft);
        setProducts((list) => list.map((p) => (p.id === saved.id ? saved : p)));
      } else {
        const saved = await api<Product>("/api/admin/products", "POST", draft);
        setProducts((list) => [saved, ...list]);
      }
      setEditing(null);
      setToast({ text: "Product saved" });
    } catch (e) {
      notifyError((e as Error).message);
    }
    setSaving(false);
  };

  const deleteProduct = async (p: Product) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try {
      await api(`/api/admin/products/${p.id}`, "DELETE");
      setProducts((list) => list.filter((x) => x.id !== p.id));
      setToast({ text: "Product deleted" });
    } catch (e) {
      notifyError((e as Error).message);
    }
  };

  const saveSite = async (next: SiteContent) => {
    setSaving(true);
    try {
      setSite(await api<SiteContent>("/api/admin/site", "PUT", next));
      setToast({ text: "Homepage saved" });
    } catch (e) {
      notifyError((e as Error).message);
    }
    setSaving(false);
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => `${p.name} ${p.fabric} ${p.category} ${p.gender} ${p.id}`.toLowerCase().includes(q));
  }, [products, query]);

  return (
    <>
      <div className="adm-top">
        <span className="logo"><BrandMark /> {site.brandName} admin</span>
        <nav>
          <button className={tab === "products" ? "on" : ""} onClick={() => setTab("products")}>Products</button>
          <button className={tab === "site" ? "on" : ""} onClick={() => setTab("site")}>Homepage</button>
        </nav>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/" target="_blank" style={{ color: "#ccc" }}>View store ↗</Link>
          <button style={{ color: "#fff" }} onClick={logout}>Log out</button>
        </div>
      </div>

      <div className="adm-body">
        {tab === "products" && (
          editing ? (
            <ProductForm key={editing.id ?? "new"} initial={editing} saving={saving} onError={notifyError}
              onSave={saveProduct} onCancel={() => setEditing(null)} />
          ) : (
            <>
              <div className="adm-row">
                <h1 className="adm-h1">Products ({products.length})</h1>
                <div style={{ display: "flex", gap: 8 }}>
                  <label className="fld"><input placeholder="Search products" value={query} onChange={(e) => setQuery(e.target.value)} /></label>
                  <button className="abtn primary" onClick={() => setEditing({ ...EMPTY_PRODUCT })}>Add product</button>
                </div>
              </div>
              <table className="adm-table">
                <thead>
                  <tr><th></th><th>Name</th><th className="hide-sm">Gender</th><th className="hide-sm">Category</th><th>Price</th><th className="hide-sm">New</th><th></th></tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id}>
                      <td><img src={p.images[0]} alt="" /></td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{p.name}</div>
                        <div style={{ color: "#888", fontSize: 12 }}>{p.id} · /p/{p.slug}</div>
                      </td>
                      <td className="hide-sm">{p.gender}</td>
                      <td className="hide-sm">{p.category}</td>
                      <td>{formatPrice(p.price)}</td>
                      <td className="hide-sm">{p.isNew ? "Yes" : ""}</td>
                      <td>
                        <div className="adm-actions">
                          <Link className="abtn" style={{ display: "inline-flex", alignItems: "center" }} href={`/p/${p.slug}`} target="_blank">View</Link>
                          <button className="abtn" onClick={() => setEditing(p)}>Edit</button>
                          <button className="abtn danger" onClick={() => deleteProduct(p)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", color: "#888", padding: 32 }}>No products found.</td></tr>}
                </tbody>
              </table>
            </>
          )
        )}
        {tab === "site" && <SiteEditor initial={site} saving={saving} onSave={saveSite} onError={notifyError} />}
      </div>

      {toast && <div className={`adm-toast${toast.err ? " err" : ""}`} role="status">{toast.text}</div>}
    </>
  );
}
