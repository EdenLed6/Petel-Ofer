import type { Metadata } from "next";
import EventForm from "./EventForm";

export const metadata: Metadata = {
  title: "אירועים פרטיים ועסקיים",
  description:
    "אירועים פרטיים, ימי גיבוש לחברות וארגונים וקבוצות מאורגנות בחממת הפטל הקסומה של פטל של עופר בנתיב העשרה. כשר בהשגחה.",
};

export default function EventsPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-berry-deep to-berry text-white py-16 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-black">אירועים בחממת הפטל הקסומה 🎉</h1>
        <p className="max-w-2xl mx-auto mt-4 text-lg text-white/90 leading-relaxed">
          מקום אחר לגמרי לאירוע הבא שלכם: ימי גיבוש, ימי הולדת, אירועים משפחתיים ואירוח עסקי –
          בין שיחי פטל, קפה ריחני ואוויר של דרום.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-14 grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="text-3xl font-black text-berry-deep">למה לחגוג אצלנו? 💫</h2>
          <ul className="mt-6 space-y-4">
            {[
              ["🫐 לוקיישן ייחודי", "חממת פטל קסומה ומרכז מבקרים כפרי – תפאורה טבעית שאין באולמות."],
              ["☕ עגלת קפה ופינוקים", "קפה משובח, מאפים ושתייה קרה – והכל כשר בהשגחה עם תעודה בתוקף."],
              ["🍓 פעילות חוויתית", "קטיף עצמי, סדנאות ריבה וסיורים חקלאיים שמתאימים לכל גיל."],
              ["🎁 מארזי שי מהמשק", "מתנות טעימות לאורחים ולעובדים – מריבות ועד מארזים מפנקים."],
              ["🏢 מותאם לחברות", "חבילות גיבוש לצוותים קטנים וגדולים, כולל חשבונית מס כחוק."],
              ["💚 תמיכה בעוטף", "האירוע שלכם מחזק חקלאות ישראלית ומשפחה מקומית בנתיב העשרה."],
            ].map(([title, text]) => (
              <li key={title} className="bg-white rounded-2xl border border-sand p-5">
                <h3 className="font-bold">{title}</h3>
                <p className="text-sm text-ink/75 mt-1 leading-relaxed">{text}</p>
              </li>
            ))}
          </ul>
        </div>
        <EventForm />
      </section>
    </div>
  );
}
