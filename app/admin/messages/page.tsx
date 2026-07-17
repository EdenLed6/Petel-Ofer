import { redirect } from "next/navigation";
import { getDb, type ContactMessage } from "@/lib/db";
import { isAdmin } from "@/lib/session";
import { formatDateTime } from "@/lib/format";
import { toggleMessageRead, deleteMessage } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const messages = getDb()
    .prepare("SELECT * FROM messages ORDER BY read ASC, created_at DESC")
    .all() as ContactMessage[];

  return (
    <div>
      <h1 className="text-3xl font-black text-berry-deep mb-6">הודעות מהאתר</h1>
      {messages.length === 0 ? (
        <p className="text-ink/60">אין הודעות עדיין.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-2xl border p-5 ${m.read ? "bg-white border-sand" : "bg-berry/5 border-berry/30"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-bold text-lg">
                    {!m.read && <span className="text-berry me-1" aria-label="הודעה חדשה">●</span>}
                    {m.subject || "פנייה מהאתר"}
                  </h2>
                  <p className="text-sm text-ink/60 mt-0.5">
                    {m.name} · {formatDateTime(m.created_at)}
                    {m.phone && <> · <a dir="ltr" className="underline text-berry" href={`tel:${m.phone}`}>{m.phone}</a></>}
                    {m.email && <> · <a dir="ltr" className="underline text-berry" href={`mailto:${m.email}`}>{m.email}</a></>}
                  </p>
                </div>
                <div className="flex gap-2">
                  <form action={toggleMessageRead}>
                    <input type="hidden" name="id" value={m.id} />
                    <button type="submit" className="bg-cream hover:bg-cream-dark text-sm font-medium px-3 py-1.5 rounded-lg">
                      {m.read ? "סמן כלא נקרא" : "סמן כנקרא"}
                    </button>
                  </form>
                  <form action={deleteMessage}>
                    <input type="hidden" name="id" value={m.id} />
                    <button type="submit" className="text-berry hover:bg-berry/10 text-sm font-medium px-3 py-1.5 rounded-lg">
                      מחיקה
                    </button>
                  </form>
                </div>
              </div>
              <p className="text-sm mt-3 leading-relaxed whitespace-pre-wrap">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
