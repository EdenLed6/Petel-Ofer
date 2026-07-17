import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "תנאי שימוש" };

export default function TermsPage() {
  const settings = getSettings();
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 leading-relaxed">
      <h1 className="text-4xl font-black text-berry-deep mb-6">תנאי שימוש 📜</h1>
      <div className="space-y-5 text-ink/85">
        <h2 className="text-2xl font-bold text-berry-deep">1. כללי</h2>
        <p>
          ברוכים הבאים לאתר &quot;הפטל של עופר&quot; (להלן: &quot;האתר&quot;), המופעל על ידי משק
          הפטל של עופר מנתיב העשרה (להלן: &quot;המשק&quot;). השימוש באתר, לרבות ביצוע הזמנות,
          מהווה הסכמה לתנאים אלה. אם אינכם מסכימים לתנאים – אנא הימנעו משימוש באתר. התנאים
          מנוסחים בלשון זכר מטעמי נוחות בלבד ומופנים לכל המגדרים.
        </p>

        <h2 className="text-2xl font-bold text-berry-deep">2. רכישה באתר</h2>
        <ul className="list-disc pr-6 space-y-1">
          <li>הרכישה באתר פתוחה לכל אדם מעל גיל 18 בעל כשרות משפטית.</li>
          <li>המחירים באתר כוללים מע&quot;מ כדין, אלא אם צוין אחרת.</li>
          <li>השלמת הזמנה כפופה לאישור טלפוני של המשק ולזמינות המלאי.</li>
          <li>המשק רשאי לעדכן מחירים, מוצרים ומבצעים בכל עת; המחיר המחייב הוא המחיר בעת אישור ההזמנה.</li>
          <li>תמונות והמחשות המוצרים נועדו להתרשמות בלבד; ייתכנו הבדלים בין התמונה למוצר בפועל.</li>
        </ul>

        <h2 className="text-2xl font-bold text-berry-deep">3. אספקה ומשלוחים</h2>
        <p>
          פרטים מלאים על אזורי המשלוח, מועדי האספקה ודמי המשלוח מפורטים בעמוד{" "}
          <Link href="/shipping-returns" className="underline">משלוחים, ביטולים והחזרות</Link>.
          מדובר בתוצרת חקלאית טרייה – ייתכנו שינויים בזמינות בהתאם לעונה וליבול.
        </p>

        <h2 className="text-2xl font-bold text-berry-deep">4. ביטול עסקה</h2>
        <p>
          ביטול עסקה יתבצע בהתאם להוראות חוק הגנת הצרכן, התשמ&quot;א–1981, ותקנותיו. יובהר כי
          בהתאם לחוק, זכות הביטול אינה חלה על טובין פסידים (מוצרי מזון טריים ומתכלים). פירוט מלא
          בעמוד <Link href="/shipping-returns" className="underline">משלוחים, ביטולים והחזרות</Link>.
        </p>

        <h2 className="text-2xl font-bold text-berry-deep">5. קטיף עצמי ואירועים</h2>
        <ul className="list-disc pr-6 space-y-1">
          <li>פעילות הקטיף מותנית בעונה, במזג האוויר וביבול, וייתכנו שינויים או ביטולים בהתראה קצרה.</li>
          <li>הזמנת אירוע תיכנס לתוקף רק לאחר אישור בכתב או טלפונית מהמשק ותשלום מקדמה ככל שנדרש.</li>
          <li>הביקור במשק הינו באחריות המבקרים; יש להישמע להנחיות הצוות ולהנחיות פיקוד העורף.</li>
        </ul>

        <h2 className="text-2xl font-bold text-berry-deep">6. קניין רוחני</h2>
        <p>
          כל התכנים באתר – טקסטים, תמונות, לוגו ועיצוב – הינם קניינו של המשק או של צדדים שלישיים
          שהתירו את השימוש בהם, ואין להעתיקם או לעשות בהם שימוש מסחרי ללא אישור מראש ובכתב.
        </p>

        <h2 className="text-2xl font-bold text-berry-deep">7. הגבלת אחריות</h2>
        <p>
          המשק פועל לכך שהאתר יפעל באופן תקין, אך אינו מתחייב שהשירות יהיה רציף וללא תקלות. אין
          המשק אחראי לנזק עקיף שנגרם משימוש באתר. אין באמור כדי לגרוע מזכויות צרכן על פי דין.
        </p>

        <h2 className="text-2xl font-bold text-berry-deep">8. דין וסמכות שיפוט</h2>
        <p>
          על תנאים אלה יחולו דיני מדינת ישראל בלבד, וסמכות השיפוט הבלעדית נתונה לבתי המשפט
          המוסמכים במחוז הדרום.
        </p>

        <h2 className="text-2xl font-bold text-berry-deep">9. יצירת קשר</h2>
        <p>
          לשאלות בנוגע לתנאים אלה: {settings.phone} · <a className="underline" href={`mailto:${settings.email}`}>{settings.email}</a>
        </p>
      </div>
    </div>
  );
}
