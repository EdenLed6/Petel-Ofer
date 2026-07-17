import Link from "next/link";

export default function Footer({ settings }: { settings: Record<string, string> }) {
  return (
    <footer className="bg-leaf-dark text-cream mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="font-bold text-lg mb-3 flex items-center gap-2">
            <span aria-hidden="true">🍇</span> הפטל של עופר
          </div>
          <p className="text-sm text-cream/80 leading-relaxed">{settings.tagline}</p>
          <div className="mt-3 flex flex-col gap-1 text-sm">
            {settings.facebook && (
              <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
                📘 עקבו אחרינו בפייסבוק
              </a>
            )}
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
                📸 עקבו אחרינו באינסטגרם
              </a>
            )}
          </div>
          <p className="text-sm text-cream/80 mt-3 flex items-start gap-2">
            <span aria-hidden="true">✡️</span>
            <span>{settings.kosher_text}</span>
          </p>
        </div>

        <div>
          <h2 className="font-bold mb-3">ניווט מהיר</h2>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:underline" href="/shop">חנות המשק</Link></li>
            <li><Link className="hover:underline" href="/visit">קטיף עצמי וביקור</Link></li>
            <li><Link className="hover:underline" href="/events">אירועים פרטיים ועסקיים</Link></li>
            <li><Link className="hover:underline" href="/contact">צור קשר</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="font-bold mb-3">מידע ושירות</h2>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:underline" href="/accessibility">הצהרת נגישות</Link></li>
            <li><Link className="hover:underline" href="/terms">תנאי שימוש</Link></li>
            <li><Link className="hover:underline" href="/privacy">מדיניות פרטיות</Link></li>
            <li><Link className="hover:underline" href="/shipping-returns">משלוחים, ביטולים והחזרות</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="font-bold mb-3">שעות פעילות ויצירת קשר</h2>
          <p className="text-sm text-cream/80 leading-relaxed">{settings.hours_text}</p>
          <ul className="mt-3 space-y-1 text-sm">
            <li>
              <a className="hover:underline" href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}>
                📞 {settings.phone}
              </a>
            </li>
            <li>
              <a className="hover:underline" href={`mailto:${settings.email}`}>✉️ {settings.email}</a>
            </li>
            <li>📍 {settings.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/20 py-4 text-center text-xs text-cream/60 px-4">
        © {new Date().getFullYear()} הפטל של עופר – משק חקלאי משפחתי, נתיב העשרה. כל הזכויות שמורות.
      </div>
    </footer>
  );
}
