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
      className="block bg-white rounded-lg border border-gray-200 hover:shadow-md transition"
    >
      <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-sm">No image</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold truncate">{product.title}</h3>
        <p className="text-sm text-gray-500 truncate">{product.seller.storeName}</p>
        <p className="mt-2 font-bold">₹{product.price.toLocaleString("en-IN")}</p>
      </div>
    </Link>
  );
}