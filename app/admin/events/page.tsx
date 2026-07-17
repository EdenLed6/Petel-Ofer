import { redirect } from "next/navigation";
import { getDb, type EventRequest } from "@/lib/db";
import { isAdmin } from "@/lib/session";
import { formatDateTime, EVENT_STATUSES } from "@/lib/format";
import { updateEventStatus } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const events = getDb()
    .prepare("SELECT * FROM event_requests ORDER BY created_at DESC")
    .all() as EventRequest[];

  return (
    <div>
      <h1 className="text-3xl font-black text-berry-deep mb-6">בקשות אירועים</h1>
      {events.length === 0 ? (
        <p className="text-ink/60">אין בקשות אירועים עדיין.</p>
      ) : (
        <div className="space-y-4">
          {events.map((e) => (
            <div key={e.id} className="bg-white rounded-2xl border border-sand p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-bold text-lg">
                    {e.name}
                    {e.org && <span className="text-ink/60 font-normal"> · {e.org}</span>}
                  </h2>
                  <p className="text-sm text-ink/60 mt-0.5">
                    {formatDateTime(e.created_at)} · <a dir="ltr" className="underline text-berry" href={`tel:${e.phone}`}>{e.phone}</a>
                    {e.email && <span dir="ltr"> · {e.email}</span>}
                  </p>
                </div>
                <form action={updateEventStatus} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={e.id} />
                  <label className="sr-only" htmlFor={`ev-${e.id}`}>סטטוס</label>
                  <select
                    id={`ev-${e.id}`}
                    name="status"
                    defaultValue={e.status}
                    className="border border-sand rounded-lg px-2 py-1.5 text-sm bg-white"
                  >
                    {Object.entries(EVENT_STATUSES).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  <button type="submit" className="bg-leaf hover:bg-leaf-dark text-white text-sm font-medium px-3 py-1.5 rounded-lg">
                    עדכון
                  </button>
                </form>
              </div>
              <dl className="grid sm:grid-cols-3 gap-2 text-sm mt-3 bg-cream rounded-xl p-3">
                <div><dt className="text-ink/50 inline">סוג: </dt><dd className="inline font-medium">{e.event_type || "—"}</dd></div>
                <div><dt className="text-ink/50 inline">תאריך מבוקש: </dt><dd className="inline font-medium">{e.event_date || "—"}</dd></div>
                <div><dt className="text-ink/50 inline">משתתפים: </dt><dd className="inline font-medium">{e.guests || "—"}</dd></div>
              </dl>
              {e.message && <p className="text-sm mt-3 leading-relaxed">{e.message}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
