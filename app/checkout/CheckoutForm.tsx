"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { formatPrice, PAYMENT_METHODS } from "@/lib/format";
import { createOrder } from "@/app/actions";

export default function CheckoutForm({
  deliveryFee,
  freeShippingOver,
  minOrder,
  deliveryAreas,
  paymentInfo,
}: {
  deliveryFee: number;
  freeShippingOver: number;
  minOrder: number;
  deliveryAreas: string;
  paymentInfo: string;
}) {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const [delivery, setDelivery] = useState<"pickup" | "delivery">("pickup");
  const [payment, setPayment] = useState("phone");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fee = delivery === "delivery" && !(freeShippingOver > 0 && subtotal >= freeShippingOver) ? deliveryFee : 0;
  const total = subtotal + fee;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-4" aria-hidden="true">🫙</p>
        <p className="text-xl text-ink/70">אין פריטים בעגלה.</p>
        <Link
          href="/shop"
          className="inline-block mt-6 bg-berry hover:bg-berry-dark text-white font-bold px-8 py-3 rounded-xl"
        >
          לחנות המשק
        </Link>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (minOrder > 0 && subtotal < minOrder) {
      setError(`סכום הזמנה מינימלי הוא ₪${minOrder}`);
      return;
    }
    const fd = new FormData(e.currentTarget);
    setSubmitting(true);
    const result = await createOrder({
      customer_name: String(fd.get("customer_name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      delivery_method: delivery,
      address: String(fd.get("address") ?? ""),
      city: String(fd.get("city") ?? ""),
      payment_method: payment,
      notes: String(fd.get("notes") ?? ""),
      items: items.map((i) => ({ id: i.id, qty: i.qty })),
    });
    setSubmitting(false);
    if (result.ok) {
      clear();
      router.push(`/checkout/success/${result.orderId}`);
    } else {
      setError(result.error);
    }
  };

  const inputCls =
    "w-full border border-sand rounded-xl px-4 py-2.5 bg-white focus:border-berry outline-none";

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black text-berry-deep">השלמת הזמנה 📝</h1>
      <form onSubmit={onSubmit} className="grid lg:grid-cols-5 gap-8 mt-8">
        <div className="lg:col-span-3 space-y-6">
          <section aria-labelledby="details-title" className="bg-white rounded-2xl border border-sand p-6">
            <h2 id="details-title" className="font-bold text-xl mb-4">פרטים אישיים</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium">שם מלא *</span>
                <input name="customer_name" required className={inputCls} autoComplete="name" />
              </label>
              <label className="block">
                <span className="text-sm font-medium">טלפון נייד *</span>
                <input name="phone" type="tel" required dir="ltr" className={inputCls} autoComplete="tel" />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium">אימייל (לאישור הזמנה)</span>
                <input name="email" type="email" dir="ltr" className={inputCls} autoComplete="email" />
              </label>
            </div>
          </section>

          <section aria-labelledby="delivery-title" className="bg-white rounded-2xl border border-sand p-6">
            <h2 id="delivery-title" className="font-bold text-xl mb-4">אספקה</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <label
                className={`border rounded-xl p-4 cursor-pointer transition-colors ${delivery === "pickup" ? "border-berry bg-berry/5" : "border-sand"}`}
              >
                <input
                  type="radio"
                  name="delivery_method"
                  value="pickup"
                  checked={delivery === "pickup"}
                  onChange={() => setDelivery("pickup")}
                  className="ms-0 me-2"
                />
                <span className="font-medium">🚜 איסוף עצמי מהמשק</span>
                <span className="block text-sm text-ink/60 mt-1">חינם · נתיב העשרה</span>
              </label>
              <label
                className={`border rounded-xl p-4 cursor-pointer transition-colors ${delivery === "delivery" ? "border-berry bg-berry/5" : "border-sand"}`}
              >
                <input
                  type="radio"
                  name="delivery_method"
                  value="delivery"
                  checked={delivery === "delivery"}
                  onChange={() => setDelivery("delivery")}
                  className="ms-0 me-2"
                />
                <span className="font-medium">🚚 משלוח עד הבית</span>
                <span className="block text-sm text-ink/60 mt-1">
                  {formatPrice(deliveryFee)}
                  {freeShippingOver > 0 ? ` · חינם מעל ${formatPrice(freeShippingOver)}` : ""}
                </span>
              </label>
            </div>
            {delivery === "delivery" && (
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <label className="block">
                  <span className="text-sm font-medium">יישוב *</span>
                  <input name="city" required className={inputCls} autoComplete="address-level2" />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">כתובת מלאה *</span>
                  <input name="address" required className={inputCls} autoComplete="street-address" />
                </label>
                <p className="sm:col-span-2 text-xs text-ink/60">{deliveryAreas}</p>
              </div>
            )}
          </section>

          <section aria-labelledby="payment-title" className="bg-white rounded-2xl border border-sand p-6">
            <h2 id="payment-title" className="font-bold text-xl mb-4">אמצעי תשלום</h2>
            <div className="space-y-2">
              {Object.entries(PAYMENT_METHODS).map(([key, label]) => (
                <label
                  key={key}
                  className={`block border rounded-xl p-3 cursor-pointer transition-colors ${payment === key ? "border-berry bg-berry/5" : "border-sand"}`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value={key}
                    checked={payment === key}
                    onChange={() => setPayment(key)}
                    className="me-2"
                  />
                  {label}
                </label>
              ))}
            </div>
            <p className="text-xs text-ink/60 mt-3 leading-relaxed">{paymentInfo}</p>
          </section>

          <label className="block">
            <span className="text-sm font-medium">הערות להזמנה</span>
            <textarea name="notes" rows={3} className={inputCls} placeholder="בקשות מיוחדות, מועד אספקה מועדף..." />
          </label>
        </div>

        <aside className="lg:col-span-2">
          <div className="bg-cream-dark rounded-2xl p-6 sticky top-24">
            <h2 className="font-bold text-xl mb-4">סיכום הזמנה</h2>
            <ul className="space-y-2 text-sm">
              {items.map((i) => (
                <li key={i.id} className="flex justify-between gap-2">
                  <span>
                    {i.name} <span className="text-ink/50">× {i.qty}</span>
                  </span>
                  <span className="font-medium">{formatPrice(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-sand mt-4 pt-4 space-y-1 text-sm">
              <p className="flex justify-between">
                <span>סה״כ ביניים</span>
                <span>{formatPrice(subtotal)}</span>
              </p>
              <p className="flex justify-between">
                <span>דמי משלוח</span>
                <span>{fee === 0 ? "חינם" : formatPrice(fee)}</span>
              </p>
              <p className="flex justify-between font-black text-lg text-berry-deep pt-2">
                <span>לתשלום</span>
                <span>{formatPrice(total)}</span>
              </p>
            </div>
            {error && (
              <p role="alert" className="mt-4 bg-berry/10 text-berry-dark rounded-xl p-3 text-sm font-medium">
                ⚠️ {error}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-5 bg-berry hover:bg-berry-dark disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors"
            >
              {submitting ? "שולח הזמנה..." : "שליחת הזמנה ✓"}
            </button>
            <p className="text-xs text-ink/60 mt-3 leading-relaxed">
              בלחיצה על &quot;שליחת הזמנה&quot; אתם מאשרים את{" "}
              <Link href="/terms" className="underline">תנאי השימוש</Link> ואת{" "}
              <Link href="/privacy" className="underline">מדיניות הפרטיות</Link>.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
