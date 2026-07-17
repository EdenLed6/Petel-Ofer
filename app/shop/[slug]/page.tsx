import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb, type Product } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getDb().prepare("SELECT * FROM products WHERE slug = ?").get(slug) as Product | undefined;
  if (!product) return { title: "מוצר לא נמצא" };
  return { title: product.name, description: product.description };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = getDb();
  const product = db.prepare("SELECT * FROM products WHERE slug = ? AND active = 1").get(slug) as
    | Product
    | undefined;
  if (!product) notFound();

  const related = db
    .prepare("SELECT * FROM products WHERE active = 1 AND category = ? AND id != ? ORDER BY sort LIMIT 3")
    .all(product.category, product.id) as Product[];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <nav aria-label="ניווט משני" className="text-sm text-ink/60 mb-6">
        <Link href="/shop" className="hover:text-berry">חנות המשק</Link>
        <span className="mx-2">/</span>
        <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-berry">
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image_url} alt={product.name} className="rounded-3xl w-full object-cover aspect-square" />
        ) : (
          <div
            aria-hidden="true"
            className="rounded-3xl bg-gradient-to-br from-rose-100 to-pink-200 aspect-square flex items-center justify-center text-[120px]"
          >
            {product.emoji}
          </div>
        )}

        <div>
          <span className="text-leaf font-medium text-sm">{product.category}</span>
          <h1 className="text-3xl md:text-4xl font-black text-berry-deep mt-1">{product.name}</h1>
          <p className="mt-4 leading-relaxed text-ink/85">{product.description}</p>
          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-3xl font-black text-berry-deep">{formatPrice(product.price)}</span>
            <span className="text-ink/60">/ {product.unit}</span>
          </div>
          <p className="mt-2 text-sm">
            {product.stock > 0 ? (
              <span className="text-leaf font-medium">✓ במלאי{product.stock <= 5 ? ` (נותרו ${product.stock} אחרונים!)` : ""}</span>
            ) : (
              <span className="text-berry font-medium">אזל מהמלאי</span>
            )}
          </p>
          <div className="mt-6">
            <AddToCartButton product={product} withQty />
          </div>
          <ul className="mt-8 space-y-2 text-sm text-ink/75 bg-cream-dark rounded-2xl p-5">
            <li>🚚 משלוחים לאזור הדרום והשפלה · איסוף עצמי חינם מהמשק</li>
            <li>✡️ מוצר כשר בהשגחה – תעודה בתוקף</li>
            <li>🌱 מיוצר במשק מפירות שגדלו אצלנו בנתיב העשרה</li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="mt-16">
          <h2 id="related-title" className="text-2xl font-black text-berry-deep mb-6">אולי יטעם לכם גם 😋</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
