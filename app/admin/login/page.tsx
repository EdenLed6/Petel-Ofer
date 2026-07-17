"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, { error: "" });

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <form
        action={formAction}
        className="bg-white rounded-3xl border border-sand shadow-md p-8 w-full max-w-sm"
      >
        <div className="text-center mb-6">
          <span className="text-5xl" aria-hidden="true">🍇</span>
          <h1 className="text-2xl font-black text-berry-deep mt-2">ניהול המשק</h1>
          <p className="text-sm text-ink/60 mt-1">הפטל של עופר · כניסת מנהלים</p>
        </div>
        <label className="block">
          <span className="text-sm font-medium">סיסמת ניהול</span>
          <input
            type="password"
            name="password"
            required
            autoFocus
            className="w-full border border-sand rounded-xl px-4 py-2.5 bg-white focus:border-berry outline-none mt-1"
          />
        </label>
        {state.error && (
          <p role="alert" className="mt-3 bg-berry/10 text-berry-dark rounded-xl p-3 text-sm font-medium">
            ⚠️ {state.error}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="w-full mt-5 bg-berry hover:bg-berry-dark disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors"
        >
          {pending ? "מתחבר..." : "כניסה"}
        </button>
      </form>
    </div>
  );
}
