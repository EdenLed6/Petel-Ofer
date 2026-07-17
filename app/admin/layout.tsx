import type { Metadata } from "next";
import Link from "next/link";
import { isAdmin } from "@/lib/session";
import { getDb } from "@/lib/db";
import { logout } from "./actions";

export const metadata: Metadata = {
  title: "ניהול המשק",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "🏠 לוח בקרה" },
  { href: "/admin/orders", label: "🧾 הזמנות" },
  { href: "/admin/products", label: "🧺 מוצרים" },
  { href: "/admin/events", label: "🎉 אירועים" },
  { href: "/admin/messages", label: "💬 הודעות" },
  { href: "/admin/updates", label: "📣 עדכונים" },
  { href: "/admin/settings", label: "⚙️ הגדרות" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await isAdmin();

  if (!admin) {
    return <div className="min-h-screen bg-cream-dark">{children}</div>;
  }

  const db = getDb();
  const newOrders = (db.prepare("SELECT COUNT(*) c FROM orders WHERE status = 'new'").get() as { c: number }).c;
  const newEvents = (db.prepare("SELECT COUNT(*) c FROM event_requests WHERE status = 'new'").get() as { c: number }).c;
  const unread = (db.prepare("SELECT COUNT(*) c FROM messages WHERE read = 0").get() as { c: number }).c;
  const badges: Record<string, number> = {
    "/admin/orders": newOrders,
    "/admin/events": newEvents,
    "/admin/messages": unread,
  };

  return (
    <div className="min-h-screen bg-cream-dark">
      <div className="bg-berry-deep text-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold">🍇 הפטל של עופר · ניהול</span>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="underline hover:no-underline">צפייה באתר</Link>
            <form action={logout}>
              <button type="submit" className="bg-white/15 hover:bg-white/25 rounded-lg px-3 py-1.5">
                יציאה
              </button>
            </form>
          </div>
        </div>
      </div>
      <nav aria-label="ניווט ניהול" className="bg-white border-b border-sand overflow-x-auto">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 py-2 whitespace-nowrap">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-cream-dark flex items-center gap-1.5"
            >
              {item.label}
              {badges[item.href] > 0 && (
                <span className="bg-berry text-white text-xs rounded-full px-1.5 py-0.5 min-w-5 text-center">
                  {badges[item.href]}
                </span>
              )}
            </Link>
          ))}
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
    </div>
  );
}
