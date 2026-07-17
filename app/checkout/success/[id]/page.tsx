import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb, getSettings, type Order, type OrderItem } from "@/lib/db";
import { formatPrice, DELIVERY_METHODS, PAYMENT_METHODS } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "ההזמנה התקבלה" };

export default async function OrderSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(Number(id)) as Order | undefined;
  if (!order) notFound();
  const items = db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(order.id) as OrderItem[];
  const settings = getSettings();

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <p className="text-7xl mb-4" aria-hidden="true">🎉</p>
      <h1 className="text-4xl font-black text-berry-deep">תודה, ההזמנה התקבלה!</h1>
      <p className="mt-3 text-lg text-ink/75">
        מספר הזמנה: <span className="font-bold">#{order.id}</span>
      </p>
      <p className="mt-2 text-ink/75 leading-relaxed">
        ניצור איתכם קשר בהקדם בטלפון <span dir="ltr" className="font-medium">{order.phone}</span>{" "}
        לאישור ההזמנה, תיאום {order.delivery_method === "delivery" ? "המשלוח" : "האיסוף"} והתשלום.
      </p>

      <div className="bg-white rounded-2xl border border-sand p-6 mt-8 text-right">
        <h2 className="font-bold text-xl mb-4">פרטי ההזמנה</h2>
        <ul className="space-y-2 text-sm divide-y divide-sand/60">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between pt-2 first:pt-0">
              <span>
                {i.name} <span className="text-ink/50">× {i.qty}</span>
              </span>
              <span className="font-medium">{formatPrice(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-sand mt-4 pt-4 text-sm space-y-1">
          <p className="flex justify-between">
            <span>אספקה</span>
            <span>{DELIVERY_METHODS[order.delivery_method] ?? order.delivery_method}</span>
          </p>
          <p className="flex justify-between">
            <span>תשלום</span>
            <span>{PAYMENT_METHODS[order.payment_method] ?? order.payment_method}</span>
          </p>
          <p className="flex justify-between">
            <span>דמי משלוח</span>
            <span>{order.delivery_fee === 0 ? "חינם" : formatPrice(order.delivery_fee)}</span>
          </p>
          <p className="flex justify-between font-black text-lg text-berry-deep pt-2">
            <span>סה״כ לתשלום</span>
            <span>{formatPrice(order.total)}</span>
          </p>
        </div>
      </div>

      <p className="mt-6 text-sm text-ink/60">
        שאלות? התקשרו: <a className="underline" href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}>{settings.phone}</a>
      </p>
      <Link
        href="/shop"
        className="inline-block mt-8 bg-berry hover:bg-berry-dark text-white font-bold px-8 py-3 rounded-xl transition-colors"
      >
        חזרה לחנות
      </Link>
    </div>
  );
}
