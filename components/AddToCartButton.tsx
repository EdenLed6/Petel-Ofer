"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

type ProductLike = {
  id: number;
  slug: string;
  name: string;
  price: number;
  unit: string;
  emoji: string;
  stock: number;
};

export default function AddToCartButton({
  product,
  withQty = false,
}: {
  product: ProductLike;
  withQty?: boolean;
}) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (product.stock <= 0) {
    return (
      <span className="inline-block bg-sand text-ink/60 font-medium px-4 py-2 rounded-xl text-sm">
        אזל מהמלאי
      </span>
    );
  }

  const add = () => {
    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        unit: product.unit,
        emoji: product.emoji,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="flex items-center gap-2">
      {withQty && (
        <div className="flex items-center border border-sand rounded-xl overflow-hidden">
          <button
            type="button"
            aria-label="הפחתת כמות"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-2 hover:bg-cream-dark"
          >
            −
          </button>
          <span className="px-3 font-medium min-w-8 text-center" aria-live="polite">{qty}</span>
          <button
            type="button"
            aria-label="הוספת כמות"
            onClick={() => setQty((q) => q + 1)}
            className="px-3 py-2 hover:bg-cream-dark"
          >
            +
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={add}
        className={`font-medium px-4 py-2 rounded-xl text-sm transition-colors ${
          added ? "bg-leaf text-white" : "bg-berry hover:bg-berry-dark text-white"
        }`}
      >
        {added ? "✓ נוסף לסל" : "הוספה לסל"}
      </button>
    </div>
  );
}
