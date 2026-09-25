import { api } from "@/lib/api";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";

type Variant = { id: string; name: string; stock: number; priceDelta: number };

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string | null;
  variants: Variant[];
  seller: { storeName: string; bio: string | null };
  reviews: { id: string; rating: number; comment: string | null; user: { name: string } }[];
};

async function getProduct(id: string): Promise<Product | null> {
  try {
    return await api<Product>(`/api/products/${id}`, { cache: "no-store" });
  } catch {
    return null;
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="text-center py-24">
        <p className="text-zinc-500 dark:text-zinc-400 mb-4">Product not found.</p>
        <Link href="/" className="text-brand-700 dark:text-brand-400 font-medium hover:underline">
          ← Back to products
        </Link>
      </div>
    );
  }

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : null;

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-6 transition-colors"
      >
        ← Back to products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full grid place-items-center text-zinc-400 dark:text-zinc-600">
              No image
            </div>
          )}
        </div>

        <div>
          <span className="inline-block text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">
            {product.seller.storeName}
          </span>
          <h1 className="text-3xl font-bold tracking-tight mt-3 text-zinc-900 dark:text-zinc-50">
            {product.title}
          </h1>
          {avgRating && (
            <p className="text-sm text-amber-600 mt-2">
              {"★".repeat(Math.round(avgRating))}
              {"☆".repeat(5 - Math.round(avgRating))}{" "}
              <span className="text-zinc-500 dark:text-zinc-400">
                ({product.reviews.length} review{product.reviews.length !== 1 ? "s" : ""})
              </span>
            </p>
          )}
          <p className="text-3xl font-bold text-brand-700 dark:text-brand-400 mt-4">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
          <p className="mt-4 text-zinc-700 dark:text-zinc-300 leading-relaxed">{product.description}</p>

          <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <AddToCartButton product={product} />
          </div>

          <div className="mt-10 pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <h2 className="font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
              Reviews {product.reviews.length > 0 && `(${product.reviews.length})`}
            </h2>
            {product.reviews.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">No reviews yet.</p>
            ) : (
              <ul className="space-y-4">
                {product.reviews.map((r) => (
                  <li key={r.id} className="border-t border-zinc-100 dark:border-zinc-800 pt-4 first:border-0 first:pt-0">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{r.user.name}</p>
                    <p className="text-sm text-amber-600">
                      {"★".repeat(r.rating)}
                      {"☆".repeat(5 - r.rating)}
                    </p>
                    {r.comment && (
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-1">{r.comment}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}