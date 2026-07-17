import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import HideOnAdmin from "@/components/HideOnAdmin";
import { CartProvider } from "@/components/CartProvider";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
});

export const metadata: Metadata = {
  title: {
    default: "הפטל של עופר | משק בוטיק לפירות יער בנתיב העשרה",
    template: "%s | הפטל של עופר",
  },
  description:
    "משק חקלאי משפחתי בוטיקי בנתיב העשרה שבעוטף עזה: קטיף עצמי חוויתי בחממת פטל קסומה, מרכז מבקרים, עגלת הקפה קפה פלורה בפטל וחנות משק עם מוצרים מפירות המשק. כשר בהשגחה.",
  keywords: [
    "פטל",
    "פירות יער",
    "קטיף עצמי",
    "נתיב העשרה",
    "עוטף עזה",
    "משק חקלאי",
    "אוכמניות",
    "תות שדה",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = getSettings();
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className="min-h-screen flex flex-col">
        <a href="#main-content" className="skip-link">
          דילוג לתוכן הראשי
        </a>
        <CartProvider>
          <Header announcement={settings.announcement} />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <HideOnAdmin>
            <Footer settings={settings} />
          </HideOnAdmin>
        </CartProvider>
        <HideOnAdmin>
          <CookieConsent />
        </HideOnAdmin>
        <AccessibilityWidget />
      </body>
    </html>
  );
}
