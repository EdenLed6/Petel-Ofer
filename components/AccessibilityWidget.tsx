"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "petel_a11y";

type A11yState = {
  textSize: 0 | 1 | 2;
  highContrast: boolean;
  underlineLinks: boolean;
  noMotion: boolean;
};

const DEFAULT_STATE: A11yState = {
  textSize: 0,
  highContrast: false,
  underlineLinks: false,
  noMotion: false,
};

function applyState(s: A11yState) {
  const html = document.documentElement;
  html.classList.toggle("a11y-large-text", s.textSize === 1);
  html.classList.toggle("a11y-larger-text", s.textSize === 2);
  html.classList.toggle("a11y-high-contrast", s.highContrast);
  html.classList.toggle("a11y-underline-links", s.underlineLinks);
  html.classList.toggle("a11y-no-motion", s.noMotion);
}

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<A11yState>(DEFAULT_STATE);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = { ...DEFAULT_STATE, ...JSON.parse(raw) };
        setState(parsed);
        applyState(parsed);
      }
    } catch {}
  }, []);

  const update = (patch: Partial<A11yState>) => {
    const next = { ...state, ...patch };
    setState(next);
    applyState(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const reset = () => {
    setState(DEFAULT_STATE);
    applyState(DEFAULT_STATE);
    localStorage.removeItem(KEY);
  };

  return (
    <div className="fixed bottom-20 left-4 z-[95]" dir="rtl">
      {open && (
        <div
          role="dialog"
          aria-label="תפריט נגישות"
          className="mb-2 w-64 bg-white rounded-2xl shadow-2xl border border-sand p-4 text-ink"
        >
          <h2 className="font-bold mb-3">הגדרות נגישות</h2>
          <div className="space-y-2 text-sm">
            <button
              type="button"
              onClick={() => update({ textSize: ((state.textSize + 1) % 3) as 0 | 1 | 2 })}
              className="w-full text-right px-3 py-2 rounded-lg bg-cream hover:bg-cream-dark"
            >
              🔠 גודל טקסט: {["רגיל", "מוגדל", "גדול מאוד"][state.textSize]}
            </button>
            <button
              type="button"
              aria-pressed={state.highContrast}
              onClick={() => update({ highContrast: !state.highContrast })}
              className={`w-full text-right px-3 py-2 rounded-lg ${state.highContrast ? "bg-berry text-white" : "bg-cream hover:bg-cream-dark"}`}
            >
              🎨 ניגודיות גבוהה
            </button>
            <button
              type="button"
              aria-pressed={state.underlineLinks}
              onClick={() => update({ underlineLinks: !state.underlineLinks })}
              className={`w-full text-right px-3 py-2 rounded-lg ${state.underlineLinks ? "bg-berry text-white" : "bg-cream hover:bg-cream-dark"}`}
            >
              🔗 הדגשת קישורים
            </button>
            <button
              type="button"
              aria-pressed={state.noMotion}
              onClick={() => update({ noMotion: !state.noMotion })}
              className={`w-full text-right px-3 py-2 rounded-lg ${state.noMotion ? "bg-berry text-white" : "bg-cream hover:bg-cream-dark"}`}
            >
              🛑 עצירת אנימציות
            </button>
            <button
              type="button"
              onClick={reset}
              className="w-full text-right px-3 py-2 rounded-lg text-berry-dark hover:bg-cream"
            >
              ↺ איפוס הגדרות
            </button>
            <Link href="/accessibility" className="block px-3 py-2 text-leaf-dark underline">
              להצהרת הנגישות המלאה
            </Link>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="פתיחת תפריט נגישות"
        className="w-12 h-12 rounded-full bg-leaf text-white shadow-lg hover:bg-leaf-dark flex items-center justify-center text-2xl"
      >
        ♿
      </button>
    </div>
  );
}
