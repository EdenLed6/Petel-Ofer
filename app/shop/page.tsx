import type { Metadata } from "next";
import Link from "next/link";
import { getDb, type Product } from "@/lib/db";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "חנות המשק",
  description: "מוצרי הבוטיק של פטל של עופר: פירות יער טריים, ריבות ביתיות, סירופים, מארזי שי ועוד – עם משלוח עד הבית או איסוף מהמשק.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const db = getDb();
  const categories = (
    db.prepare("SELECT DISTINCT category FROM products WHERE active = 1 ORDER BY category").all() as {
      category: string;
    }[]
  ).map((r) => r.category);

  const products = (
    category
      ? db.prepare("SELECT * FROM products WHERE active = 1 AND category = ? ORDER BY sort, name").all(category)
      : db.prepare("SELECT * FROM products WHERE active = 1 ORDER BY sort, name").all()
  ) as Product[];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black text-berry-deep">חנות המשק 🧺</h1>
      <p className="mt-2 text-ink/70 max-w-2xl">
        כל המוצרים מיוצרים ונארזים אצלנו במשק מפירות היער שאנחנו מגדלים. הזמינו אונליין –
        ונתאם משלוח עד הבית או איסוף מהמשק.
      </p>

      <nav aria-label="סינון לפי קטגוריה" className="flex flex-wrap gap-2 mt-6">
        <Link
          href="/shop"
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
            !category ? "bg-berry text-white border-berry" : "border-sand bg-white hover:bg-cream-dark"
          }`}
        >
          הכל
        </Link>
        {categories.map((c) => (
          <Link
            key={c}
            href={`/shop?category=${encodeURIComponent(c)}`}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              category === c ? "bg-berry text-white border-berry" : "border-sand bg-white hover:bg-cream-dark"
            }`}
          >
            {c}
          </Link>
        ))}
      </nav>

      {products.length === 0 ? (
        <p className="mt-12 text-center text-ink/60">לא נמצאו מוצרים בקטגוריה זו.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
