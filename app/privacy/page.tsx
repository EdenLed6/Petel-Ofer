import type { Metadata } from "next";
import { getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "מדיניות פרטיות" };

export default function PrivacyPage() {
  const settings = getSettings();
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 leading-relaxed">
      <h1 className="text-4xl font-black text-berry-deep mb-6">מדיניות פרטיות 🔒</h1>
      <div className="space-y-5 text-ink/85">
        <p>
          משק &quot;הפטל של עופר&quot; (להלן: &quot;המשק&quot;) מכבד את פרטיות המשתמשים באתר ופועל
          בהתאם לחוק הגנת הפרטיות, התשמ&quot;א–1981, לרבות תיקון 13 לחוק, ולתקנות הגנת הפרטיות
          (אבטחת מידע), התשע&quot;ז–2017.
        </p>

        <h2 className="text-2xl font-bold text-berry-deep">1. איזה מידע נאסף?</h2>
        <ul className="list-disc pr-6 space-y-1">
          <li>מידע שנמסר על ידכם: שם, טלפון, אימייל וכתובת – בעת ביצוע הזמנה, בקשת אירוע או פנייה בטופס יצירת קשר.</li>
          <li>מידע שנשמר במכשירכם: תוכן עגלת הקניות והעדפות נגישות (נשמרים מקומית בדפדפן שלכם).</li>
          <li>נתוני שימוש טכניים בסיסיים הנדרשים לתפעול האתר ולאבטחתו.</li>
        </ul>
        <p>לא חלה עליכם חובה חוקית למסור מידע, אולם ללא פרטי קשר לא נוכל להשלים הזמנה או לחזור אליכם.</p>

        <h2 className="text-2xl font-bold text-berry-deep">2. מטרות השימוש במידע</h2>
        <ul className="list-disc pr-6 space-y-1">
          <li>טיפול בהזמנות, אספקתן ותיאום תשלום.</li>
          <li>מענה לפניות ותיאום ביקורים ואירועים.</li>
          <li>שיפור השירות והאתר.</li>
          <li>משלוח עדכונים שיווקיים – רק בכפוף להסכמתכם המפורשת, וניתן להסיר את ההסכמה בכל עת.</li>
        </ul>

        <h2 className="text-2xl font-bold text-berry-deep">3. מסירת מידע לצדדים שלישיים</h2>
        <p>
          המשק אינו סוחר במידע האישי שלכם. מידע יימסר לצדדים שלישיים רק ככל הנדרש לצורך מתן
          השירות (למשל חברת שליחויות או ספק סליקה), או כאשר קיימת חובה חוקית לעשות כן.
        </p>

        <h2 className="text-2xl font-bold text-berry-deep">4. עוגיות (Cookies)</h2>
        <p>
          האתר עושה שימוש בעוגיות ובאחסון מקומי לצרכים תפעוליים – שמירת עגלת הקניות, העדפות
          נגישות וניהול הרשאות – וכן, בכפוף להסכמתכם, לצרכים סטטיסטיים. ניתן לחסום או למחוק
          עוגיות דרך הגדרות הדפדפן; חסימת עוגיות חיוניות עלולה לפגוע בתפקוד האתר.
        </p>

        <h2 className="text-2xl font-bold text-berry-deep">5. אבטחת מידע</h2>
        <p>
          המשק מיישם אמצעי אבטחה מקובלים להגנה על המידע, בהתאם לתקנות אבטחת מידע. עם זאת, אין
          באפשרותנו להבטיח חסינות מוחלטת מפני חדירות בלתי מורשות.
        </p>

        <h2 className="text-2xl font-bold text-berry-deep">6. זכויותיכם</h2>
        <p>
          בהתאם לחוק הגנת הפרטיות, עומדת לכם הזכות לעיין במידע האישי המוחזק אודותיכם, לבקש את
          תיקונו או מחיקתו, ולהסיר הסכמה לדיוור. לצורך מימוש זכויותיכם ניתן לפנות אלינו:
          <br />
          📞 {settings.phone} · ✉️ <a className="underline" href={`mailto:${settings.email}`}>{settings.email}</a>
        </p>

        <h2 className="text-2xl font-bold text-berry-deep">7. שינויים במדיניות</h2>
        <p>
          המשק רשאי לעדכן מדיניות זו מעת לעת. הנוסח המחייב הוא הנוסח המפורסם באתר במועד השימוש.
        </p>
        <p className="text-sm text-ink/60">
          עודכן לאחרונה: {new Date().toLocaleDateString("he-IL", { month: "long", year: "numeric" })}
        </p>
      </div>
    </div>
  );
}
