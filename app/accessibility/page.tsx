import type { Metadata } from "next";
import { getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "הצהרת נגישות" };

export default function AccessibilityPage() {
  const settings = getSettings();
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 leading-relaxed">
      <h1 className="text-4xl font-black text-berry-deep mb-6">הצהרת נגישות ♿</h1>
      <div className="space-y-5 text-ink/85">
        <p>
          אנו ב&quot;הפטל של עופר&quot; רואים חשיבות עליונה במתן שירות שוויוני, מכבד ונגיש לכלל
          לקוחותינו, לרבות אנשים עם מוגבלות, ופועלים בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות,
          התשנ&quot;ח–1998, ולתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות),
          התשע&quot;ג–2013.
        </p>

        <h2 className="text-2xl font-bold text-berry-deep pt-2">נגישות האתר</h2>
        <p>אתר זה הונגש בהתאם להנחיות תקן ישראלי 5568 המבוסס על הנחיות WCAG 2.1 ברמה AA, ובין היתר כולל:</p>
        <ul className="list-disc pr-6 space-y-1">
          <li>תפריט נגישות המאפשר הגדלת טקסט, ניגודיות גבוהה, הדגשת קישורים ועצירת אנימציות.</li>
          <li>ניווט מלא באמצעות מקלדת ותמיכה בקוראי מסך (תגיות ARIA וטקסט חלופי).</li>
          <li>מבנה כותרות היררכי, ניגודיות צבעים תקינה וקישור &quot;דילוג לתוכן&quot;.</li>
          <li>טפסים עם תוויות ברורות והודעות שגיאה מונגשות.</li>
        </ul>

        <h2 className="text-2xl font-bold text-berry-deep pt-2">נגישות המשק ומרכז המבקרים</h2>
        <ul className="list-disc pr-6 space-y-1">
          <li>חניית נכים מסומנת בסמוך לכניסה למרכז המבקרים.</li>
          <li>דרכי גישה מישוריות לחממת הקטיף, לעגלת הקפה ולחנות המשק, מתאימות לכיסאות גלגלים ולעגלות.</li>
          <li>שירותים נגישים בשטח המשק.</li>
          <li>צוות המשק עבר הדרכה למתן שירות נגיש – נשמח לסייע בכל בקשה.</li>
        </ul>

        <h2 className="text-2xl font-bold text-berry-deep pt-2">הסדרי נגישות חלופיים</h2>
        <p>
          לקוחות המתקשים בביצוע הזמנה באתר מוזמנים להזמין טלפונית בשעות הפעילות, ואנו נסייע בכל
          שלב בתהליך.
        </p>

        <h2 className="text-2xl font-bold text-berry-deep pt-2">רכז הנגישות</h2>
        <p>
          נתקלתם בקושי? נשמח לשמוע ולתקן. ניתן לפנות לרכז הנגישות של המשק:
          <br />
          📞 טלפון: <a className="underline" href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}>{settings.phone}</a>
          <br />
          ✉️ אימייל: <a className="underline" href={`mailto:${settings.email}`}>{settings.email}</a>
        </p>
        <p className="text-sm text-ink/60">
          הצהרה זו עודכנה לאחרונה בתאריך {new Date().toLocaleDateString("he-IL", { month: "long", year: "numeric" })}.
          אנו ממשיכים לפעול באופן שוטף לשיפור נגישות האתר והשירות.
        </p>
      </div>
    </div>
  );
}
