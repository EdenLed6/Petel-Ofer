import Link from "next/link";
import { redirect } from "next/navigation";
import { getDb, type Order } from "@/lib/db";
import { isAdmin } from "@/lib/session";
import { formatDateTime, formatPrice, ORDER_STATUSES, DELIVERY_METHODS } from "@/lib/format";
import { updateOrderStatus } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { status } = await searchParams;
  const db = getDb();
  const orders = (
    status
      ? db.prepare("SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC").all(status)
      : db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all()
  ) as Order[];

  return (
    <div>
      <h1 className="text-3xl font-black text-berry-deep mb-6">הזמנות</h1>

      <nav aria-label="סינון סטטוס" className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/admin/orders"
          className={`px-3 py-1.5 rounded-full text-sm border ${!status ? "bg-berry text-white border-berry" : "bg-white border-sand"}`}
        >
          הכל
        </Link>
        {Object.entries(ORDER_STATUSES).map(([key, label]) => (
          <Link
            key={key}
            href={`/admin/orders?status=${key}`}
            className={`px-3 py-1.5 rounded-full text-sm border ${status === key ? "bg-berry text-white border-berry" : "bg-white border-sand"}`}
          >
            {label}
          </Link>
        ))}
      </nav>

      {orders.length === 0 ? (
        <p className="text-ink/60">אין הזמנות להצגה.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="bg-white rounded-2xl border border-sand p-4 flex flex-wrap items-center gap-4">
              <Link href={`/admin/orders/${o.id}`} className="font-black text-berry text-lg underline">
                #{o.id}
              </Link>
              <div className="flex-1 min-w-40">
                <p className="font-bold">{o.customer_name}</p>
                <p className="text-sm text-ink/60">
                  {formatDateTime(o.created_at)} · <span dir="ltr">{o.phone}</span> ·{" "}
                  {DELIVERY_METHODS[o.delivery_method] ?? o.delivery_method}
                </p>
              </div>
              <span className="font-bold text-lg">{formatPrice(o.total)}</span>
              <form action={updateOrderStatus} className="flex items-center gap-2">
                <input type="hidden" name="id" value={o.id} />
                <label className="sr-only" htmlFor={`status-${o.id}`}>סטטוס הזמנה {o.id}</label>
                <select
                  id={`status-${o.id}`}
                  name="status"
                  defaultValue={o.status}
                  className="border border-sand rounded-lg px-2 py-1.5 text-sm bg-white"
                >
                  {Object.entries(ORDER_STATUSES).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                <button type="submit" className="bg-leaf hover:bg-leaf-dark text-white text-sm font-medium px-3 py-1.5 rounded-lg">
                  עדכון
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
