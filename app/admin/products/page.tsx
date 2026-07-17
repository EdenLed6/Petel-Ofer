import Link from "next/link";
import { redirect } from "next/navigation";
import { getDb, type Product } from "@/lib/db";
import { isAdmin } from "@/lib/session";
import { formatPrice } from "@/lib/format";
import { deleteProduct } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const products = getDb()
    .prepare("SELECT * FROM products ORDER BY sort, name")
    .all() as Product[];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-3xl font-black text-berry-deep">מוצרים</h1>
        <Link
          href="/admin/products/new"
          className="bg-berry hover:bg-berry-dark text-white font-bold px-5 py-2.5 rounded-xl"
        >
          + מוצר חדש
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl border border-sand">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-right text-ink/60 border-b border-sand bg-cream">
              <th className="p-3">מוצר</th>
              <th className="p-3">קטגוריה</th>
              <th className="p-3">מחיר</th>
              <th className="p-3">מלאי</th>
              <th className="p-3">מצב</th>
              <th className="p-3">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-sand/50">
                <td className="p-3">
                  <span aria-hidden="true" className="me-2">{p.emoji}</span>
                  <span className="font-medium">{p.name}</span>
                  {p.featured ? <span className="ms-2 text-xs bg-amber-100 text-amber-800 rounded-full px-2 py-0.5">מומלץ</span> : null}
                </td>
                <td className="p-3 text-ink/70">{p.category}</td>
                <td className="p-3">{formatPrice(p.price)} <span className="text-ink/50 text-xs">/ {p.unit}</span></td>
                <td className={`p-3 font-medium ${p.stock === 0 ? "text-berry" : p.stock <= 5 ? "text-amber-600" : ""}`}>
                  {p.stock}
                </td>
                <td className="p-3">
                  {p.active ? (
                    <span className="text-leaf font-medium">פעיל</span>
                  ) : (
                    <span className="text-ink/50">מוסתר</span>
                  )}
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="bg-cream hover:bg-cream-dark px-3 py-1.5 rounded-lg font-medium"
                    >
                      עריכה
                    </Link>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <button
                        type="submit"
                        className="text-berry hover:bg-berry/10 px-3 py-1.5 rounded-lg font-medium"
                      >
                        מחיקה
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
