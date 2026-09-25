import { api } from "@/lib/api";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";

type Variant = {
  id: string;
  name: string;
  stock: number;
  priceDelta: number;
};

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
      <div className="text-center py-16">
        <p className="text-gray-500">Product not found.</p>
        <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400">No image</span>
        )}
      </div>

      <div>
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <p className="text-sm text-gray-500 mt-1">by {product.seller.storeName}</p>
        <p className="text-2xl font-bold mt-4">₹{product.price.toLocaleString("en-IN")}</p>
        <p className="mt-4 text-gray-700">{product.description}</p>

        <div className="mt-6">
          <AddToCartButton product={product} />
        </div>

        <div className="mt-8">
          <h2 className="font-semibold mb-2">Reviews ({product.reviews.length})</h2>
          {product.reviews.length === 0 ? (
            <p className="text-sm text-gray-500">No reviews yet.</p>
          ) : (
            <ul className="space-y-3">
              {product.reviews.map((r) => (
                <li key={r.id} className="border-t border-gray-200 pt-3">
                  <p className="text-sm font-medium">{r.user.name}</p>
                  <p className="text-sm text-yellow-600">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
                  {r.comment && <p className="text-sm text-gray-700 mt-1">{r.comment}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}