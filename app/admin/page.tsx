import Link from "next/link";
import { redirect } from "next/navigation";
import { getDb, type Order } from "@/lib/db";
import { isAdmin } from "@/lib/session";
import { formatDateTime, formatPrice, ORDER_STATUSES } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  if (!(await isAdmin())) redirect("/admin/login");
  const db = getDb();

  const stats = [
    { label: "הזמנות חדשות", value: (db.prepare("SELECT COUNT(*) c FROM orders WHERE status='new'").get() as { c: number }).c, href: "/admin/orders", emoji: "🧾" },
    { label: "בקשות אירועים", value: (db.prepare("SELECT COUNT(*) c FROM event_requests WHERE status='new'").get() as { c: number }).c, href: "/admin/events", emoji: "🎉" },
    { label: "הודעות שלא נקראו", value: (db.prepare("SELECT COUNT(*) c FROM messages WHERE read=0").get() as { c: number }).c, href: "/admin/messages", emoji: "💬" },
    { label: "מוצרים פעילים", value: (db.prepare("SELECT COUNT(*) c FROM products WHERE active=1").get() as { c: number }).c, href: "/admin/products", emoji: "🧺" },
  ];

  const revenue = (db.prepare("SELECT COALESCE(SUM(total),0) s FROM orders WHERE status NOT IN ('cancelled')").get() as { s: number }).s;
  const lowStock = db.prepare("SELECT name, stock FROM products WHERE active=1 AND stock <= 5 ORDER BY stock").all() as { name: string; stock: number }[];
  const recentOrders = db.prepare("SELECT * FROM orders ORDER BY created_at DESC LIMIT 6").all() as Order[];

  return (
    <div>
      <h1 className="text-3xl font-black text-berry-deep mb-6">לוח בקרה</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="bg-white rounded-2xl border border-sand p-5 hover:shadow-md transition-shadow">
            <span className="text-3xl" aria-hidden="true">{s.emoji}</span>
            <p className="text-3xl font-black text-berry-deep mt-2">{s.value}</p>
            <p className="text-sm text-ink/70">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-sand p-5">
          <h2 className="font-bold text-lg mb-4">הזמנות אחרונות</h2>
          {recentOrders.length === 0 ? (
            <p className="text-ink/60 text-sm">אין הזמנות עדיין.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-right text-ink/60 border-b border-sand">
                    <th className="py-2 pe-2">#</th>
                    <th className="py-2 pe-2">לקוח</th>
                    <th className="py-2 pe-2">תאריך</th>
                    <th className="py-2 pe-2">סכום</th>
                    <th className="py-2">סטטוס</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="border-b border-sand/50">
                      <td className="py-2 pe-2 font-medium">
                        <Link href={`/admin/orders/${o.id}`} className="text-berry underline">#{o.id}</Link>
                      </td>
                      <td className="py-2 pe-2">{o.customer_name}</td>
                      <td className="py-2 pe-2 text-ink/60">{formatDateTime(o.created_at)}</td>
                      <td className="py-2 pe-2 font-medium">{formatPrice(o.total)}</td>
                      <td className="py-2">{ORDER_STATUSES[o.status] ?? o.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="text-sm text-ink/50 mt-3">
            סה״כ מחזור (ללא מבוטלות): <span className="font-bold text-ink">{formatPrice(revenue)}</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-sand p-5">
          <h2 className="font-bold text-lg mb-4">⚠️ מלאי נמוך (עד 5 יח׳)</h2>
          {lowStock.length === 0 ? (
            <p className="text-ink/60 text-sm">כל המוצרים במלאי תקין 👍</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {lowStock.map((p) => (
                <li key={p.name} className="flex justify-between">
                  <span>{p.name}</span>
                  <span className={`font-bold ${p.stock === 0 ? "text-berry" : "text-amber-600"}`}>
                    {p.stock === 0 ? "אזל" : `${p.stock} יח׳`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
