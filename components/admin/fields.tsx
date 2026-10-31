"use client";

import { useRef, useState } from "react";

export function Field({ label, hint, full, children }: { label: string; hint?: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={`fld${full ? " full" : ""}`}>
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

export function Text({ label, value, onChange, hint, full }: { label: string; value: string; onChange: (v: string) => void; hint?: string; full?: boolean }) {
  return (
    <Field label={label} hint={hint} full={full}>
      <input value={value} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

export async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Upload failed");
  return data.url as string;
}

// Image URL input with an upload button that fills in the URL of the uploaded file.
export function ImageInput({ label, value, onChange, full, onError }: {
  label: string; value: string; onChange: (v: string) => void; full?: boolean; onError: (msg: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  return (
    <div className={`fld${full ? " full" : ""}`}>
      <span>{label}</span>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://… or upload" />
        <button type="button" className="abtn" disabled={busy} onClick={() => ref.current?.click()}>{busy ? "…" : "Upload"}</button>
        <input ref={ref} type="file" accept="image/*" hidden onChange={async (e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (!f) return;
          setBusy(true);
          try { onChange(await uploadImage(f)); } catch (err) { onError((err as Error).message); }
          setBusy(false);
        }} />
      </div>
      {value && <div className="adm-thumbs"><img src={value} alt="" /></div>}
    </div>
  );
}
