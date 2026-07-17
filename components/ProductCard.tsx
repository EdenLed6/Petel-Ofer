import Link from "next/link";
import type { Product } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import AddToCartButton from "./AddToCartButton";

const CATEGORY_GRADIENTS: Record<string, string> = {
  "פירות טריים": "from-rose-100 to-pink-200",
  "ריבות וממרחים": "from-amber-100 to-orange-200",
  "משקאות": "from-purple-100 to-fuchsia-200",
  "קפואים": "from-sky-100 to-blue-200",
  "מארזים ומתנות": "from-emerald-100 to-teal-200",
  "חטיפים": "from-yellow-100 to-amber-200",
};

export default function ProductCard({ product }: { product: Product }) {
  const gradient = CATEGORY_GRADIENTS[product.category] ?? "from-rose-100 to-pink-200";
  return (
    <article className="bg-white rounded-2xl shadow-sm border border-sand overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <Link href={`/shop/${product.slug}`} className="block">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="h-40 w-full object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className={`h-40 bg-gradient-to-br ${gradient} flex items-center justify-center text-6xl`}
          >
            {product.emoji}
          </div>
        )}
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-leaf font-medium">{product.category}</span>
        <Link href={`/shop/${product.slug}`} className="font-bold text-lg text-ink hover:text-berry-dark">
          {product.name}
        </Link>
        <p className="text-sm text-ink/70 mt-1 line-clamp-2 flex-1">{product.description}</p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <div>
            <span className="font-bold text-berry-deep text-lg">{formatPrice(product.price)}</span>
            <span className="block text-xs text-ink/60">{product.unit}</span>
          </div>
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}
