import type { Metadata } from "next";
import { getSettings } from "@/lib/db";
import ContactForm from "./ContactForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "צור קשר",
  description: "יצירת קשר עם פטל של עופר – טלפון, וואטסאפ, אימייל וטופס פנייה. הגעה למשק בנתיב העשרה.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const { subject } = await searchParams;
  const settings = getSettings();
  const phoneDigits = settings.phone.replace(/[^0-9+]/g, "");

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black text-berry-deep">דברו איתנו 💬</h1>
      <p className="mt-2 text-ink/70 max-w-2xl">
        יש לכם שאלה על הזמנה, קטיף או אירוע? נשמח לשמוע מכם בכל אחת מהדרכים – או פשוט השאירו הודעה
        בטופס ונחזור אליכם בהקדם.
      </p>

      <div className="grid lg:grid-cols-5 gap-8 mt-10 items-start">
        <div className="lg:col-span-2 space-y-4">
          <a
            href={`tel:${phoneDigits}`}
            className="block bg-white rounded-2xl border border-sand p-5 hover:shadow-md transition-shadow"
          >
            <h2 className="font-bold">📞 טלפון</h2>
            <p dir="ltr" className="text-berry-dark font-medium mt-1 text-right">{settings.phone}</p>
          </a>
          <a
            href={`https://wa.me/${settings.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-2xl border border-sand p-5 hover:shadow-md transition-shadow"
          >
            <h2 className="font-bold">💚 וואטסאפ</h2>
            <p className="text-ink/70 text-sm mt-1">שלחו הודעה ונענה במהירות</p>
          </a>
          <a
            href={`mailto:${settings.email}`}
            className="block bg-white rounded-2xl border border-sand p-5 hover:shadow-md transition-shadow"
          >
            <h2 className="font-bold">✉️ אימייל</h2>
            <p dir="ltr" className="text-berry-dark font-medium mt-1 text-right">{settings.email}</p>
          </a>
          <div className="bg-white rounded-2xl border border-sand p-5">
            <h2 className="font-bold">📍 כתובת והגעה</h2>
            <p className="text-ink/70 text-sm mt-1">{settings.address}</p>
            <a
              href={settings.waze_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 bg-leaf hover:bg-leaf-dark text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
            >
              🚗 ניווט ב-Waze
            </a>
          </div>
          <div className="bg-cream-dark rounded-2xl p-5 text-sm leading-relaxed">
            <h2 className="font-bold mb-1">🕘 שעות פעילות</h2>
            <p>{settings.hours_text}</p>
          </div>
        </div>

        <div className="lg:col-span-3">
          <ContactForm defaultSubject={subject ?? ""} />
        </div>
      </div>
    </div>
  );
}
