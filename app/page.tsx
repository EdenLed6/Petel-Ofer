import Link from "next/link";
import { getDb, getSettings, type Product, type Update } from "@/lib/db";
import { formatDate } from "@/lib/format";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const db = getDb();
  const settings = getSettings();
  const featured = db
    .prepare("SELECT * FROM products WHERE active = 1 AND featured = 1 ORDER BY sort LIMIT 4")
    .all() as Product[];
  const updates = db
    .prepare("SELECT * FROM updates WHERE active = 1 ORDER BY pinned DESC, created_at DESC LIMIT 3")
    .all() as Update[];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-berry-deep via-berry-dark to-berry text-white">
        <div aria-hidden="true" className="absolute inset-0 opacity-10 text-[120px] leading-none select-none">
          🍇 🫐 🍓 🍇 🫐 🍓 🍇 🫐 🍓 🍇 🫐 🍓 🍇 🫐 🍓
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28 text-center">
          <span className="inline-block bg-white/15 backdrop-blur rounded-full px-4 py-1 text-sm mb-6">
            🌱 משק חקלאי משפחתי · נתיב העשרה, עוטף עזה · כשר בהשגחה
          </span>
          <h1 className="text-4xl md:text-6xl font-black leading-tight">
            הפטל של עופר
            <span className="block text-2xl md:text-3xl font-medium mt-3 text-white/90">
              חוויית פירות יער בוטיקית בלב עוטף עזה
            </span>
          </h1>
          <p className="max-w-2xl mx-auto mt-6 text-lg text-white/85 leading-relaxed">
            קטיף עצמי בחממת פטל קסומה, עגלת הקפה &quot;קפה פלורה בפטל&quot;, מרכז מבקרים חם ואוהב
            וחנות משק עם מיטב התוצרת שלנו – פטל, תות, פירות יער ופרחי העונה.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/visit"
              className="bg-white text-berry-deep font-bold px-7 py-3 rounded-xl hover:bg-cream transition-colors"
            >
              🍓 הזמנת קטיף עצמי
            </Link>
            <Link
              href="/shop"
              className="bg-leaf hover:bg-leaf-dark font-bold px-7 py-3 rounded-xl transition-colors"
            >
              🧺 לחנות המשק
            </Link>
            <Link
              href="/events"
              className="border-2 border-white/60 hover:bg-white/10 font-bold px-7 py-3 rounded-xl transition-colors"
            >
              🎉 אירועים וקבוצות
            </Link>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section aria-labelledby="features-title" className="max-w-6xl mx-auto px-4 -mt-10 relative z-10">
        <h2 id="features-title" className="sr-only">מה מחכה לכם במשק</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { emoji: "🫐", title: "חממת פטל קסומה", text: "מרכז מבקרים ייחודי בתוך חממה פורחת של פירות יער." },
            { emoji: "☕", title: "קפה פלורה בפטל", text: "עגלת קפה משובחת בתוך חממת הפטל – קפה, מאפים ואווירה." },
            { emoji: "🧺", title: "חנות המשק", text: "ריבות, סירופים, מארזי שי ופירות טריים – הכל מתוצרת המשק." },
            { emoji: "✡️", title: "כשרות מהודרת", text: "תעודת כשרות רשמית בתוקף – מוצגת במרכז המבקרים." },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl shadow-md border border-sand p-6 text-center">
              <span aria-hidden="true" className="text-4xl block mb-3">{f.emoji}</span>
              <h3 className="font-bold text-lg text-berry-deep">{f.title}</h3>
              <p className="text-sm text-ink/70 mt-1 leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section aria-labelledby="about-title" className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 id="about-title" className="text-3xl font-black text-berry-deep">הסיפור שלנו 💚</h2>
          <p className="mt-4 leading-relaxed text-ink/85">
            הסיפור שלנו מתחיל בשנות ה-70, כשסבא ינקל&apos;ה הקים משק משפחתי קטן במושב נתיב
            העשרה שבעוטף עזה. עם השנים הפך המשק, בהובלת עופר, לאחד ממרכזי הגידול המובילים
            בישראל לפטל ולפירות יער.
          </p>
          <p className="mt-3 leading-relaxed text-ink/85">
            אחרי לכתו הפתאומית של עופר ז&quot;ל בשנת 2021, ממשיכים הילדים – מור וערן – את דרכו
            באהבה ובתחושת שליחות. לצד הגידול החקלאי הקמנו מרכז מבקרים קסום בתוך חממת הפטל:
            עגלת הקפה &quot;קפה פלורה בפטל&quot;, פינות ישיבה בין השיחים, חנות משק עם תוצרת
            ביתית – ו&quot;שדה מתחלף&quot; שבו קוטפים לפי העונה פטל, תות, חמניות ופרחים.
          </p>
          <p className="mt-3 leading-relaxed text-ink/85 font-medium">
            ביקור אצלנו הוא חיבוק לחקלאות הישראלית, למשפחה שלנו וליישובי העוטף. מחכים לכם! 🍓
          </p>
        </div>
        <div aria-hidden="true" className="grid grid-cols-2 gap-4">
          {["🍇", "☕", "🌿", "🍓"].map((e, i) => (
            <div
              key={i}
              className={`rounded-3xl h-36 md:h-44 flex items-center justify-center text-6xl bg-gradient-to-br ${
                ["from-rose-100 to-pink-200", "from-amber-100 to-orange-200", "from-emerald-100 to-teal-200", "from-red-100 to-rose-200"][i]
              } ${i % 2 ? "animate-float-slow" : ""}`}
            >
              {e}
            </div>
          ))}
        </div>
      </section>

      {/* Picking options */}
      <section aria-labelledby="picking-title" className="bg-cream-dark py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 id="picking-title" className="text-3xl font-black text-berry-deep text-center">
            אפשרויות קטיף ואירוח 🧑‍🌾
          </h2>
          <p className="text-center mt-2 text-ink/70">{settings.picking_season}</p>
          <div className="grid gap-6 md:grid-cols-3 mt-10">
            <div className="bg-white rounded-2xl border border-sand p-6 shadow-sm">
              <span aria-hidden="true" className="text-4xl">👨‍👩‍👧‍👦</span>
              <h3 className="font-bold text-xl mt-3">קטיף משפחתי</h3>
              <p className="text-sm text-ink/75 mt-2 leading-relaxed">
                חוויה מתוקה לכל המשפחה: סלסלת קטיף, סיור קצר בחממה והסבר על הגידול.
                הילדים קוטפים – וטועמים בדרך 😋
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-sand p-6 shadow-sm">
              <span aria-hidden="true" className="text-4xl">💑</span>
              <h3 className="font-bold text-xl mt-3">קטיף זוגי בוטיק</h3>
              <p className="text-sm text-ink/75 mt-2 leading-relaxed">
                בוקר רומנטי בין שיחי הפטל: קטיף, קפה ומאפה מעגלת הקפה ופינת ישיבה שקטה בחממה.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-sand p-6 shadow-sm">
              <span aria-hidden="true" className="text-4xl">🏢</span>
              <h3 className="font-bold text-xl mt-3">קבוצות, חברות וארגונים</h3>
              <p className="text-sm text-ink/75 mt-2 leading-relaxed">
                ימי גיבוש, אירועי חברה וסיורים חקלאיים בהתאמה אישית – כולל כיבוד כשר,
                סדנאות ומארזי שי לעובדים.
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link
              href="/visit"
              className="inline-block bg-berry hover:bg-berry-dark text-white font-bold px-8 py-3 rounded-xl transition-colors"
            >
              לפרטים והזמנת מקום
            </Link>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section aria-labelledby="featured-title" className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 id="featured-title" className="text-3xl font-black text-berry-deep">מהחנות שלנו 🧺</h2>
          <Link href="/shop" className="text-berry font-medium hover:underline">
            לכל המוצרים ←
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Updates + hours */}
      <section className="bg-leaf-dark text-cream py-16">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10">
          <div aria-labelledby="updates-title">
            <h2 id="updates-title" className="text-2xl font-black mb-5">עדכונים מהמשק 📣</h2>
            {updates.length === 0 ? (
              <p className="text-cream/70">אין עדכונים חדשים כרגע – עקבו אחרינו!</p>
            ) : (
              <ul className="space-y-4">
                {updates.map((u) => (
                  <li key={u.id} className="bg-white/10 rounded-2xl p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold">{u.pinned ? "📌 " : ""}{u.title}</h3>
                      <span className="text-xs text-cream/60 shrink-0">{formatDate(u.created_at)}</span>
                    </div>
                    {u.body && <p className="text-sm text-cream/85 mt-1 leading-relaxed">{u.body}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div aria-labelledby="hours-title">
            <h2 id="hours-title" className="text-2xl font-black mb-5">שעות פעילות והגעה 🕘</h2>
            <div className="bg-white/10 rounded-2xl p-5 space-y-3 text-sm leading-relaxed">
              <p className="font-medium text-base">{settings.hours_text}</p>
              <p>{settings.picking_season}</p>
              <p>📍 {settings.address}</p>
              <p>
                📞{" "}
                <a className="underline" href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}>
                  {settings.phone}
                </a>
                {" · "}
                ✉️ <a className="underline" href={`mailto:${settings.email}`}>{settings.email}</a>
              </p>
              <div className="flex gap-3 pt-2">
                <a
                  href={settings.waze_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-leaf-dark font-bold px-5 py-2 rounded-xl hover:bg-cream transition-colors"
                >
                  🚗 ניווט ב-Waze
                </a>
                <Link
                  href="/contact"
                  className="border border-cream/50 hover:bg-white/10 font-bold px-5 py-2 rounded-xl transition-colors"
                >
                  צרו קשר
                </Link>
              </div>
            </div>
            <p className="text-xs text-cream/60 mt-4">
              ⚠️ בשל אופי האזור, מומלץ להתעדכן טלפונית לפני הגעה בימים רגישים. פעילות המשק כפופה
              להנחיות פיקוד העורף.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
