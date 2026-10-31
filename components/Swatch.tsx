import type { Colour } from "@/lib/types";

export function swatchBackground(c: Colour): string {
  return c.hex2 ? `linear-gradient(180deg, ${c.hex} 50%, ${c.hex2} 50%)` : c.hex;
}

export default function Swatch({ colour, large }: { colour: Colour; large?: boolean }) {
  return <span className={`swatch${large ? " lg" : ""}`} style={{ background: swatchBackground(colour) }} title={colour.name} />;
}
