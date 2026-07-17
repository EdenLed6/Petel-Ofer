import { redirect } from "next/navigation";
import { getDb, type Update } from "@/lib/db";
import { isAdmin } from "@/lib/session";
import { formatDate } from "@/lib/format";
import { saveUpdate, deleteUpdate } from "../actions";

export const dynamic = "force-dynamic";

const inputCls =
  "w-full border border-sand rounded-xl px-4 py-2.5 bg-white focus:border-berry outline-none";

export default async function AdminUpdatesPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const updates = getDb().prepare("SELECT * FROM updates ORDER BY pinned DESC, created_at DESC").all() as Update[];

  return (
    <div>
      <h1 className="text-3xl font-black text-berry-deep mb-6">עדכונים מהמשק</h1>

      <form action={saveUpdate} className="bg-white rounded-2xl border border-sand p-6 max-w-2xl mb-8">
        <h2 className="font-bold text-lg mb-4">פרסום עדכון חדש</h2>
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">כותרת *</span>
            <input name="title" required className={inputCls} />
          </label>
          <label className="block">
            <span className="text-sm font-medium">תוכן</span>
            <textarea name="body" rows={3} className={inputCls} />
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="active" defaultChecked className="w-4 h-4" />
              <span className="text-sm font-medium">מוצג באתר</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="pinned" className="w-4 h-4" />
              <span className="text-sm font-medium">📌 נעוץ למעלה</span>
            </label>
          </div>
        </div>
        <button type="submit" className="mt-5 bg-berry hover:bg-berry-dark text-white font-bold px-8 py-3 rounded-xl">
          פרסום ✓
        </button>
      </form>

      <div className="space-y-3">
        {updates.map((u) => (
          <div key={u.id} className="bg-white rounded-2xl border border-sand p-5 flex flex-wrap items-start justify-between gap-3">
            <div className="flex-1 min-w-60">
              <h3 className="font-bold">
                {u.pinned ? "📌 " : ""}
                {u.title}
                {!u.active && <span className="ms-2 text-xs bg-sand rounded-full px-2 py-0.5">מוסתר</span>}
              </h3>
              {u.body && <p className="text-sm text-ink/70 mt-1">{u.body}</p>}
              <p className="text-xs text-ink/50 mt-1">{formatDate(u.created_at)}</p>
            </div>
            <form action={deleteUpdate}>
              <input type="hidden" name="id" value={u.id} />
              <button type="submit" className="text-berry hover:bg-berry/10 text-sm font-medium px-3 py-1.5 rounded-lg">
                מחיקה
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
