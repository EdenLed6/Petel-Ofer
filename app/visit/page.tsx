import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "קטיף עצמי וביקור במשק",
  description:
    "קטיף עצמי חוויתי בחממת פטל קסומה בנתיב העשרה: קטיף משפחתי, זוגי וקבוצתי, עגלת קפה, מרכז מבקרים וחנות משק. הזמינו מקום מראש.",
};

export default function VisitPage() {
  const settings = getSettings();

  return (
    <div>
      <section className="bg-gradient-to-b from-leaf-dark to-leaf text-cream py-16 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-black">קטיף עצמי וביקור במשק 🍓</h1>
        <p className="max-w-2xl mx-auto mt-4 text-lg text-cream/90 leading-relaxed">
          בואו לקטוף פטל, תותים ופרחי העונה ישר מהשיח ב&quot;שדה המתחלף&quot; שלנו, בתוך חממה
          קסומה מלאה ריחות וצבעים – ולסיים בקפה טוב ומאפה מ&quot;קפה פלורה בפטל&quot;.
        </p>
        <p className="mt-3 text-sm bg-white/10 inline-block rounded-full px-4 py-1">
          {settings.picking_season}
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-3xl font-black text-berry-deep text-center mb-10">מסלולי החוויה שלנו</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              emoji: "👨‍👩‍👧‍👦",
              title: "קטיף משפחתי",
              price: "₪45 למשתתף (עד גיל 3 חינם)",
              points: ["סלסלת קטיף אישית", "קטיף עונתי: פטל, תות, חמניות ופרחים", "טעימות מריבות המשק", "כ־שעה וחצי של כיף"],
            },
            {
              emoji: "💑",
              title: "קטיף זוגי בוטיק",
              price: "₪120 לזוג",
              points: ["פינת ישיבה פרטית בחממה", "סלסלת קטיף זוגית", "קפה ומאפה מעגלת הקפה", "אפשרות לשדרוג מארז שי"],
            },
            {
              emoji: "🚌",
              title: "קבוצות מאורגנות",
              price: "מחיר לפי הצעה",
              points: ["גמלאים, גני ילדים ובתי ספר", "ימי גיבוש לחברות וארגונים", "כיבוד כשר בתיאום מראש", "התאמה אישית של התוכן"],
            },
          ].map((plan) => (
            <div key={plan.title} className="bg-white rounded-3xl border border-sand shadow-sm p-7 flex flex-col">
              <span aria-hidden="true" className="text-5xl">{plan.emoji}</span>
              <h3 className="font-bold text-2xl mt-3 text-berry-deep">{plan.title}</h3>
              <p className="text-leaf font-bold mt-1">{plan.price}</p>
              <ul className="mt-4 space-y-2 text-sm text-ink/80 flex-1">
                {plan.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span aria-hidden="true" className="text-leaf">✓</span> {p}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact?subject=הזמנת קטיף"
                className="mt-6 text-center bg-berry hover:bg-berry-dark text-white font-bold py-2.5 rounded-xl transition-colors"
              >
                הזמנת מקום
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-ink/60 mt-6">
          * הקטיף מתקיים בהתאם לעונה וליבול. מומלץ לתאם מראש טלפונית או דרך טופס יצירת הקשר.
        </p>
      </section>

      <section className="bg-cream-dark py-14">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-black text-berry-deep text-center">טוב לדעת לפני שמגיעים 📌</h2>
          <div className="grid sm:grid-cols-2 gap-5 mt-8 text-sm leading-relaxed">
            {[
              ["🕘 שעות פעילות", settings.hours_text],
              ["📍 איך מגיעים?", `${settings.address}. ניתן לנווט ב-Waze ל"פטל של עופר".`],
              ["✡️ כשרות", settings.kosher_text],
              ["♿ נגישות", "מרכז המבקרים והחממה נגישים לעגלות ולכיסאות גלגלים. לפרטים נוספים ראו את הצהרת הנגישות שלנו."],
              ["👟 מה להביא?", "נעליים נוחות, כובע ומצב רוח מעולה. סלסלות וכל הציוד – עלינו."],
              ["⚠️ עדכוני ביטחון", "הפעילות כפופה להנחיות פיקוד העורף. בימים רגישים מומלץ להתעדכן טלפונית לפני היציאה."],
            ].map(([title, text]) => (
              <div key={title} className="bg-white rounded-2xl border border-sand p-5">
                <h3 className="font-bold mb-1">{title}</h3>
                <p className="text-ink/75">{text}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/contact"
              className="inline-block bg-leaf hover:bg-leaf-dark text-white font-bold px-8 py-3 rounded-xl transition-colors"
            >
              לתיאום ביקור – דברו איתנו
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
