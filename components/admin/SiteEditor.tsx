"use client";

import { useState } from "react";
import { ImageInput, Text } from "./fields";
import type { HeroSlide, SiteContent, Tile } from "@/lib/types";

const newId = (prefix: string) => `${prefix}${Date.now().toString(36)}`;

function TileList({ title, tiles, onChange, withBg, onError }: {
  title: string; tiles: Tile[]; onChange: (t: Tile[]) => void; withBg?: boolean; onError: (m: string) => void;
}) {
  const update = (i: number, patch: Partial<Tile>) => onChange(tiles.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= tiles.length) return;
    const next = [...tiles];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div style={{ marginBottom: 18 }}>
      <div className="adm-row" style={{ marginBottom: 10 }}>
        <b>{title}</b>
        <button type="button" className="abtn" onClick={() => onChange([...tiles, { id: newId("t"), title: "New tile", image: "", href: "/", ...(withBg ? { bg: "#eeeeee" } : {}) }])}>Add tile</button>
      </div>
      {tiles.map((t, i) => (
        <div key={t.id} className="adm-sub">
          <div className="adm-sub-head">
            <span>#{i + 1} {t.title}</span>
            <div className="adm-actions">
              <button type="button" className="abtn" onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
              <button type="button" className="abtn" onClick={() => move(i, 1)} disabled={i === tiles.length - 1}>↓</button>
              <button type="button" className="abtn danger" onClick={() => onChange(tiles.filter((_, idx) => idx !== i))}>Remove</button>
            </div>
          </div>
          <div className="adm-grid">
            <Text label="Title" value={t.title} onChange={(v) => update(i, { title: v })} />
            <Text label="Link" value={t.href} onChange={(v) => update(i, { href: v })} />
            {withBg && <Text label="Background colour" value={t.bg ?? ""} onChange={(v) => update(i, { bg: v })} />}
            <ImageInput label="Image" value={t.image} onChange={(v) => update(i, { image: v })} full onError={onError} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SiteEditor({ initial, onSave, saving, onError }: {
  initial: SiteContent; onSave: (s: SiteContent) => void; saving: boolean; onError: (m: string) => void;
}) {
  const [s, setS] = useState<SiteContent>(initial);
  const patch = <K extends keyof SiteContent>(k: K, v: SiteContent[K]) => setS((prev) => ({ ...prev, [k]: v }));
  const updateHero = (i: number, p: Partial<HeroSlide>) => patch("hero", s.hero.map((h, idx) => (idx === i ? { ...h, ...p } : h)));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(s); }}>
      <div className="adm-row">
        <h1 className="adm-h1">Homepage & site</h1>
        <button className="abtn primary" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
      </div>

      <div className="adm-card">
        <h3>Brand & announcement bar</h3>
        <div className="adm-grid">
          <Text label="Brand name" value={s.brandName} onChange={(v) => patch("brandName", v)} />
          <label className="check"><input type="checkbox" checked={s.announcement.enabled}
            onChange={(e) => patch("announcement", { ...s.announcement, enabled: e.target.checked })} /> Show announcement bar</label>
          <Text full label="Announcement text" value={s.announcement.text} onChange={(v) => patch("announcement", { ...s.announcement, text: v })} />
          <Text label="Link text" value={s.announcement.linkText} onChange={(v) => patch("announcement", { ...s.announcement, linkText: v })} />
          <Text label="Link URL" value={s.announcement.linkHref} onChange={(v) => patch("announcement", { ...s.announcement, linkHref: v })} />
        </div>
      </div>

      <div className="adm-card">
        <div className="adm-row" style={{ marginBottom: 10 }}>
          <h3 style={{ margin: 0 }}>Hero slides</h3>
          <button type="button" className="abtn" onClick={() => patch("hero", [...s.hero, { id: newId("h"), title: "New headline.", subtitle: "", ctaLabel: "Shop Now", ctaHref: "/c/new", image: "" }])}>Add slide</button>
        </div>
        {s.hero.map((h, i) => (
          <div key={h.id} className="adm-sub">
            <div className="adm-sub-head">
              <span>Slide {i + 1}</span>
              <button type="button" className="abtn danger" onClick={() => patch("hero", s.hero.filter((_, idx) => idx !== i))}>Remove</button>
            </div>
            <div className="adm-grid">
              <Text label="Headline" value={h.title} onChange={(v) => updateHero(i, { title: v })} />
              <Text label="Subtitle" value={h.subtitle} onChange={(v) => updateHero(i, { subtitle: v })} />
              <Text label="Button label" value={h.ctaLabel} onChange={(v) => updateHero(i, { ctaLabel: v })} />
              <Text label="Button link" value={h.ctaHref} onChange={(v) => updateHero(i, { ctaHref: v })} />
              <ImageInput full label="Image" value={h.image} onChange={(v) => updateHero(i, { image: v })} onError={onError} />
            </div>
          </div>
        ))}
      </div>

      <div className="adm-card">
        <h3>New and trending</h3>
        <TileList title="Women's" tiles={s.trending.women} onChange={(t) => patch("trending", { ...s.trending, women: t })} onError={onError} />
        <TileList title="Men's" tiles={s.trending.men} onChange={(t) => patch("trending", { ...s.trending, men: t })} onError={onError} />
      </div>

      <div className="adm-card">
        <h3>Shop by colour</h3>
        <TileList withBg title="Women's" tiles={s.colours.women} onChange={(t) => patch("colours", { ...s.colours, women: t })} onError={onError} />
        <TileList withBg title="Men's" tiles={s.colours.men} onChange={(t) => patch("colours", { ...s.colours, men: t })} onError={onError} />
      </div>

      <div className="adm-card">
        <h3>Feature banner</h3>
        <div className="adm-grid">
          <Text label="Eyebrow" value={s.banner.eyebrow} onChange={(v) => patch("banner", { ...s.banner, eyebrow: v })} />
          <Text label="Big word" value={s.banner.title} onChange={(v) => patch("banner", { ...s.banner, title: v })} />
          <Text full label="Text" value={s.banner.subtitle} onChange={(v) => patch("banner", { ...s.banner, subtitle: v })} />
          <Text label="Button label" value={s.banner.ctaLabel} onChange={(v) => patch("banner", { ...s.banner, ctaLabel: v })} />
          <Text label="Button link" value={s.banner.ctaHref} onChange={(v) => patch("banner", { ...s.banner, ctaHref: v })} />
          <ImageInput full label="Background image" value={s.banner.image} onChange={(v) => patch("banner", { ...s.banner, image: v })} onError={onError} />
        </div>
      </div>

      <div className="adm-card">
        <h3>What&apos;s new carousel</h3>
        <div className="adm-grid">
          <Text full label="Heading" value={s.whatsNew.title} onChange={(v) => patch("whatsNew", { ...s.whatsNew, title: v })} />
          <Text label="Women's button label" value={s.whatsNew.women.ctaLabel} onChange={(v) => patch("whatsNew", { ...s.whatsNew, women: { ...s.whatsNew.women, ctaLabel: v } })} />
          <Text label="Women's button link" value={s.whatsNew.women.ctaHref} onChange={(v) => patch("whatsNew", { ...s.whatsNew, women: { ...s.whatsNew.women, ctaHref: v } })} />
          <Text label="Men's button label" value={s.whatsNew.men.ctaLabel} onChange={(v) => patch("whatsNew", { ...s.whatsNew, men: { ...s.whatsNew.men, ctaLabel: v } })} />
          <Text label="Men's button link" value={s.whatsNew.men.ctaHref} onChange={(v) => patch("whatsNew", { ...s.whatsNew, men: { ...s.whatsNew.men, ctaHref: v } })} />
        </div>
      </div>

      <div className="adm-actions">
        <button className="abtn primary" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
      </div>
    </form>
  );
}
