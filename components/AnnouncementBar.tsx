"use client";

import Link from "next/link";
import { useState } from "react";
import { CloseIcon } from "./Icons";
import type { SiteContent } from "@/lib/types";

export default function AnnouncementBar({ data }: { data: SiteContent["announcement"] }) {
  const [open, setOpen] = useState(true);
  if (!data.enabled || !open) return null;
  return (
    <div className="announce" role="region" aria-label="Announcement">
      <span>
        {data.text}
        {data.linkText && <Link href={data.linkHref || "/"}>{data.linkText}</Link>}
      </span>
      <button className="announce-close" aria-label="Dismiss" onClick={() => setOpen(false)}><CloseIcon size={14} /></button>
    </div>
  );
}
