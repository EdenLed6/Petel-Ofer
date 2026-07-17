"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, setQty, removeItem, subtotal, count } = useCart();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black text-berry-deep">עגלת הקניות 🧺</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4" aria-hidden="true">🫙</p>
          <p className="text-xl text-ink/70">העגלה שלכם ריקה בינתיים...</p>
          <Link
            href="/shop"
            className="inline-block mt-6 bg-berry hover:bg-berry-dark text-white font-bold px-8 py-3 rounded-xl transition-colors"
          >
            לחנות המשק
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-8 divide-y divide-sand bg-white rounded-2xl border border-sand overflow-hidden">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 p-4">
                <span aria-hidden="true" className="text-4xl">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <Link href={`/shop/${item.slug}`} className="font-bold hover:text-berry-dark">
                    {item.name}
                  </Link>
                  <p className="text-sm text-ink/60">
                    {item.unit} · {formatPrice(item.price)}
                  </p>
                </div>
                <div className="flex items-center border border-sand rounded-xl overflow-hidden">
                  <button
                    type="button"
                    aria-label={`הפחתת כמות של ${item.name}`}
                    onClick={() => setQty(item.id, item.qty - 1)}
                    className="px-3 py-1.5 hover:bg-cream-dark"
                  >
                    −
                  </button>
                  <span className="px-3 min-w-8 text-center font-medium">{item.qty}</span>
                  <button
                    type="button"
                    aria-label={`הוספת כמות של ${item.name}`}
                    onClick={() => setQty(item.id, item.qty + 1)}
                    className="px-3 py-1.5 hover:bg-cream-dark"
                  >
                    +
                  </button>
                </div>
                <span className="font-bold text-berry-deep min-w-20 text-left">
                  {formatPrice(item.price * item.qty)}
                </span>
                <button
                  type="button"
                  aria-label={`הסרת ${item.name} מהעגלה`}
                  onClick={() => removeItem(item.id)}
                  className="text-ink/40 hover:text-berry p-1"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 bg-cream-dark rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-lg">
              סה״כ ביניים ({count} פריטים):{" "}
              <span className="font-black text-berry-deep text-2xl">{formatPrice(subtotal)}</span>
            </p>
            <div className="flex gap-3">
              <Link
                href="/shop"
                className="border border-sand bg-white hover:bg-cream px-6 py-3 rounded-xl font-medium transition-colors"
              >
                המשך קניות
              </Link>
              <Link
                href="/checkout"
                className="bg-berry hover:bg-berry-dark text-white font-bold px-8 py-3 rounded-xl transition-colors"
              >
                למילוי פרטים ותשלום ←
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
