"use client";

import { useState } from "react";
import { createContactMessage } from "@/app/actions";

const inputCls =
  "w-full border border-sand rounded-xl px-4 py-2.5 bg-white focus:border-berry outline-none";

export default function ContactForm({ defaultSubject = "" }: { defaultSubject?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    const result = await createContactMessage(new FormData(e.currentTarget));
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
        <p className="text-5xl mb-3" aria-hidden="true">💌</p>
        <h3 className="font-bold text-xl text-leaf-dark">ההודעה נשלחה!</h3>
        <p className="mt-2 text-ink/75">תודה שכתבתם לנו – נחזור אליכם בהקדם.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-3xl border border-sand p-7 shadow-sm">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium">שם מלא *</span>
          <input name="name" required className={inputCls} autoComplete="name" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">טלפון</span>
          <input name="phone" type="tel" dir="ltr" className={inputCls} autoComplete="tel" />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium">אימייל</span>
          <input name="email" type="email" dir="ltr" className={inputCls} autoComplete="email" />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium">נושא</span>
          <input name="subject" defaultValue={defaultSubject} className={inputCls} />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium">תוכן ההודעה *</span>
          <textarea name="message" rows={5} required className={inputCls} />
        </label>
      </div>
      <p className="text-xs text-ink/60 mt-3">* יש למלא טלפון או אימייל כדי שנוכל לחזור אליכם.</p>
      {status === "error" && (
        <p role="alert" className="mt-4 bg-berry/10 text-berry-dark rounded-xl p-3 text-sm font-medium">
          ⚠️ {error}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-5 w-full bg-berry hover:bg-berry-dark disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors"
      >
        {status === "sending" ? "שולח..." : "שליחת הודעה ✓"}
      </button>
    </form>
  );
}
