"use client";

import { useState } from "react";
import { createEventRequest } from "@/app/actions";

const inputCls =
  "w-full border border-sand rounded-xl px-4 py-2.5 bg-white focus:border-berry outline-none";

export default function EventForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    const result = await createEventRequest(new FormData(e.currentTarget));
    if (result.ok) {
      setStatus("sent");
    } else {
      setError(result.error ?? "אירעה שגיאה, נסו שוב");
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="bg-leaf/10 border border-leaf rounded-2xl p-8 text-center">
        <p className="text-5xl mb-3" aria-hidden="true">🎉</p>
        <h3 className="font-bold text-xl text-leaf-dark">הבקשה נשלחה בהצלחה!</h3>
        <p className="mt-2 text-ink/75">נחזור אליכם תוך יום עסקים עם הצעה מותאמת אישית.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-3xl border border-sand p-7 shadow-sm">
      <h2 className="font-bold text-2xl text-berry-deep mb-5">בקשת הצעת מחיר לאירוע</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium">שם מלא *</span>
          <input name="name" required className={inputCls} autoComplete="name" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">טלפון *</span>
          <input name="phone" type="tel" required dir="ltr" className={inputCls} autoComplete="tel" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">אימייל</span>
          <input name="email" type="email" dir="ltr" className={inputCls} autoComplete="email" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">חברה / ארגון (אם רלוונטי)</span>
          <input name="org" className={inputCls} autoComplete="organization" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">סוג האירוע</span>
          <select name="event_type" className={inputCls} defaultValue="">
            <option value="" disabled>בחרו סוג אירוע</option>
            <option>יום גיבוש לחברה / ארגון</option>
            <option>יום הולדת</option>
            <option>אירוע משפחתי</option>
            <option>הצעת נישואין / אירוע זוגי</option>
            <option>קבוצה מאורגנת / טיול</option>
            <option>אחר</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium">תאריך מבוקש</span>
          <input name="event_date" type="date" className={inputCls} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">מספר משתתפים משוער</span>
          <input name="guests" type="number" min={1} className={inputCls} />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium">ספרו לנו על האירוע</span>
          <textarea
            name="message"
            rows={4}
            className={inputCls}
            placeholder="מה חשוב לכם? כיבוד, סדנה, מארזים לאורחים..."
          />
        </label>
      </div>
      {status === "error" && (
        <p role="alert" className="mt-4 bg-berry/10 text-berry-dark rounded-xl p-3 text-sm font-medium">
          ⚠️ {error}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 w-full bg-berry hover:bg-berry-dark disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors"
      >
        {status === "sending" ? "שולח..." : "שליחת בקשה ✓"}
      </button>
    </form>
  );
}
