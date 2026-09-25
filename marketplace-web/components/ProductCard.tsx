import Link from "next/link";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string | null;
  seller: { storeName: string };
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group block bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-brand-400 dark:hover:border-brand-600 hover:shadow-lg hover:shadow-brand-100/50 dark:hover:shadow-brand-900/30 hover:-translate-y-0.5 transition-all"
    >
      <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-zinc-400 dark:text-zinc-600 text-sm">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">{product.title}</h3>
        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
          {product.seller.storeName}
        </span>
        <p className="mt-3 text-lg font-bold text-brand-700 dark:text-brand-400">
          ₹{product.price.toLocaleString("en-IN")}
        </p>
      </div>
    </Link>
  );
}