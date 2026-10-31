import AnnouncementBar from "@/components/AnnouncementBar";
import { CartProvider } from "@/components/CartProvider";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { readStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const { site } = await readStore();
  return (
    <CartProvider>
      <AnnouncementBar data={site.announcement} />
      <Header brandName={site.brandName} />
      <main>{children}</main>
      <Footer brandName={site.brandName} />
      <button className="feedback-tab" type="button">Feedback</button>
    </CartProvider>
  );
}
