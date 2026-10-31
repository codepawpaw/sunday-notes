export type Gender = "women" | "men" | "unisex";

export type Colour = {
  name: string;
  hex: string;
  hex2?: string;
  isNew?: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  fabric?: string;
  price: number;
  gender: Gender;
  category: string;
  tags: string[];
  images: string[];
  bestsellerColours: Colour[];
  colours: Colour[];
  sizes: string[];
  description: string;
  isNew?: boolean;
};

export type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
};

export type Tile = {
  id: string;
  title: string;
  image: string;
  href: string;
  bg?: string;
};

export type SiteContent = {
  brandName: string;
  announcement: { enabled: boolean; text: string; linkText: string; linkHref: string };
  hero: HeroSlide[];
  trending: { women: Tile[]; men: Tile[] };
  colours: { women: Tile[]; men: Tile[] };
  banner: { eyebrow: string; title: string; subtitle: string; ctaLabel: string; ctaHref: string; image: string };
  whatsNew: { title: string; women: { ctaLabel: string; ctaHref: string }; men: { ctaLabel: string; ctaHref: string } };
};

export type Store = {
  site: SiteContent;
  products: Product[];
};
