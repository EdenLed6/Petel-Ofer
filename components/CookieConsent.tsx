"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "petel_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setVisible(true);
  }, []);

  const decide = (value: "accepted" | "essential") => {
    localStorage.setItem(KEY, value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="הודעת שימוש בעוגיות"
      className="fixed bottom-0 inset-x-0 z-[90] bg-ink text-cream p-4 shadow-2xl"
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4">
        <p className="text-sm leading-relaxed flex-1">
          🍪 האתר משתמש בעוגיות (Cookies) הנחוצות לתפעולו התקין – למשל שמירת עגלת הקניות והעדפות
          נגישות – וכן בעוגיות סטטיסטיות לשיפור השירות. פרטים נוספים ב
          <Link href="/privacy" className="underline font-medium mx-1">מדיניות הפרטיות</Link>
          שלנו.
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="bg-berry hover:bg-berry-dark text-white font-medium px-5 py-2 rounded-lg transition-colors"
          >
            אישור הכל
          </button>
          <button
            type="button"
            onClick={() => decide("essential")}
            className="border border-cream/40 hover:bg-cream/10 px-5 py-2 rounded-lg transition-colors"
          >
            חיוניות בלבד
          </button>
        </div>
      </div>
    </div>
  );
}
