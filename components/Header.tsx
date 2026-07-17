"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";

const NAV = [
  { href: "/", label: "ראשי" },
  { href: "/shop", label: "חנות המשק" },
  { href: "/visit", label: "קטיף וביקור" },
  { href: "/events", label: "אירועים וקבוצות" },
  { href: "/contact", label: "צור קשר" },
];

export default function Header({ announcement }: { announcement?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { count } = useCart();

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      {announcement ? (
        <div className="bg-leaf-dark text-cream text-center text-sm py-2 px-4">{announcement}</div>
      ) : null}
      <div className="bg-cream/95 backdrop-blur border-b border-sand">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-berry-deep text-xl">
            <span aria-hidden="true" className="text-2xl">🍇</span>
            <span>
              הפטל של עופר
              <span className="block text-[11px] font-normal text-leaf -mt-1">
                משק בוטיק · נתיב העשרה
              </span>
            </span>
          </Link>

          <nav aria-label="ניווט ראשי" className="hidden md:flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-berry text-white"
                    : "text-ink hover:bg-cream-dark hover:text-berry-dark"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              aria-label={`עגלת קניות, ${count} פריטים`}
              className="relative p-2 rounded-lg hover:bg-cream-dark transition-colors"
            >
              <span aria-hidden="true" className="text-2xl">🧺</span>
              {count > 0 && (
                <span className="absolute -top-1 -left-1 bg-berry text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
            <button
              type="button"
              className="md:hidden p-2 rounded-lg hover:bg-cream-dark"
              aria-expanded={open}
              aria-label="פתיחת תפריט"
              onClick={() => setOpen((o) => !o)}
            >
              <span aria-hidden="true" className="text-2xl">{open ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>

        {open && (
          <nav aria-label="ניווט נייד" className="md:hidden border-t border-sand bg-cream px-4 py-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-3 rounded-lg font-medium ${
                  pathname === item.href ? "bg-berry text-white" : "hover:bg-cream-dark"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
