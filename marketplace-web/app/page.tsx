import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import HeroBackground from "@/components/HeroBackground";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string | null;
  seller: { storeName: string };
};

async function getProducts(): Promise<Product[]> {
  try {
    return await api<Product[]>("/api/products", { cache: "no-store" });
  } catch {
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="relative min-h-screen">
      {/* Fixed full-page particle background */}
      <div className="fixed inset-0 pointer-events-none">
        <HeroBackground />
      </div>

      <div className="relative">
        {/* Hero */}
        <section className="relative overflow-hidden mb-12 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/40 backdrop-blur-sm px-8 py-20 text-center">
          <div className="relative z-10">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 bg-brand-100 dark:bg-brand-950/60 px-3 py-1 rounded-full">
              Multi-vendor marketplace
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Shop from independent sellers
            </h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
              Discover products from sellers around the world. Or open your own store in seconds.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="#products"
                className="px-6 py-3 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 hover:scale-105 active:scale-100 transition-all"
              >
                Browse products
              </a>
              <Link
                href="/signup"
                className="px-6 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 backdrop-blur font-medium text-zinc-900 dark:text-zinc-100 hover:bg-white dark:hover:bg-zinc-900 hover:scale-105 active:scale-100 transition-all"
              >
                Become a seller
              </Link>
            </div>
          </div>
        </section>

        {/* Products */}
        <section id="products" className="relative">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              All products
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {products.length === 0
                ? "Nothing listed yet"
                : `${products.length} product${products.length === 1 ? "" : "s"} available`}
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur">
              <p className="text-zinc-500 dark:text-zinc-400 mb-3">No products yet.</p>
              <Link
                href="/signup"
                className="text-brand-600 dark:text-brand-400 font-medium hover:underline"
              >
                Be the first to list one →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}