import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

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
    <div>
      <h1 className="text-2xl font-bold mb-6">All products</h1>
      {products.length === 0 ? (
        <p className="text-gray-500">No products yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}