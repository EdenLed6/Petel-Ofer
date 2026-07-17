import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getDb, type Order, type OrderItem } from "@/lib/db";
import { isAdmin } from "@/lib/session";
import {
  formatDateTime,
  formatPrice,
  ORDER_STATUSES,
  DELIVERY_METHODS,
  PAYMENT_METHODS,
} from "@/lib/format";
import { updateOrderStatus } from "../../actions";

export const dynamic = "force-dynamic";

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { id } = await params;
  const db = getDb();
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(Number(id)) as Order | undefined;
  if (!order) notFound();
  const items = db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(order.id) as OrderItem[];

  return (
    <div className="max-w-3xl">
      <Link href="/admin/orders" className="text-sm text-berry underline">← חזרה לכל ההזמנות</Link>
      <div className="flex items-center justify-between mt-2 mb-6 flex-wrap gap-3">
        <h1 className="text-3xl font-black text-berry-deep">הזמנה #{order.id}</h1>
        <form action={updateOrderStatus} className="flex items-center gap-2">
          <input type="hidden" name="id" value={order.id} />
          <label className="sr-only" htmlFor="status">סטטוס</label>
          <select
            id="status"
            name="status"
            defaultValue={order.status}
            className="border border-sand rounded-lg px-3 py-2 bg-white"
          >
            {Object.entries(ORDER_STATUSES).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <button type="submit" className="bg-leaf hover:bg-leaf-dark text-white font-medium px-4 py-2 rounded-lg">
            עדכון סטטוס
          </button>
        </form>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-sand p-5">
          <h2 className="font-bold mb-3">פרטי לקוח</h2>
          <dl className="text-sm space-y-1.5">
            <div className="flex gap-2"><dt className="text-ink/60 w-20">שם:</dt><dd className="font-medium">{order.customer_name}</dd></div>
            <div className="flex gap-2"><dt className="text-ink/60 w-20">טלפון:</dt><dd><a dir="ltr" className="underline text-berry" href={`tel:${order.phone}`}>{order.phone}</a></dd></div>
            {order.email && <div className="flex gap-2"><dt className="text-ink/60 w-20">אימייל:</dt><dd dir="ltr">{order.email}</dd></div>}
            <div className="flex gap-2"><dt className="text-ink/60 w-20">תאריך:</dt><dd>{formatDateTime(order.created_at)}</dd></div>
          </dl>
        </div>
        <div className="bg-white rounded-2xl border border-sand p-5">
          <h2 className="font-bold mb-3">אספקה ותשלום</h2>
          <dl className="text-sm space-y-1.5">
            <div className="flex gap-2"><dt className="text-ink/60 w-20">אספקה:</dt><dd>{DELIVERY_METHODS[order.delivery_method] ?? order.delivery_method}</dd></div>
            {order.delivery_method === "delivery" && (
              <div className="flex gap-2"><dt className="text-ink/60 w-20">כתובת:</dt><dd>{order.address}, {order.city}</dd></div>
            )}
            <div className="flex gap-2"><dt className="text-ink/60 w-20">תשלום:</dt><dd>{PAYMENT_METHODS[order.payment_method] ?? order.payment_method}</dd></div>
            {order.notes && <div className="flex gap-2"><dt className="text-ink/60 w-20">הערות:</dt><dd>{order.notes}</dd></div>}
          </dl>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-sand p-5 mt-4">
        <h2 className="font-bold mb-3">פריטים</h2>
        <ul className="divide-y divide-sand/60 text-sm">
          {items.map((i) => (
            <li key={i.id} className="py-2 flex justify-between">
              <span>{i.name} <span className="text-ink/50">× {i.qty}</span></span>
              <span className="font-medium">{formatPrice(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-sand mt-3 pt-3 text-sm space-y-1">
          <p className="flex justify-between"><span>סה״כ ביניים</span><span>{formatPrice(order.subtotal)}</span></p>
          <p className="flex justify-between"><span>משלוח</span><span>{order.delivery_fee === 0 ? "חינם" : formatPrice(order.delivery_fee)}</span></p>
          <p className="flex justify-between font-black text-lg text-berry-deep"><span>סה״כ</span><span>{formatPrice(order.total)}</span></p>
        </div>
      </div>
    </div>
  );
}
