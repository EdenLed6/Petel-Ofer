import type { Metadata } from "next";
import { getSettings } from "@/lib/db";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "משלוחים, ביטולים והחזרות" };

export default function ShippingReturnsPage() {
  const settings = getSettings();
  const fee = Number(settings.delivery_fee) || 0;
  const freeOver = Number(settings.free_shipping_over) || 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 leading-relaxed">
      <h1 className="text-4xl font-black text-berry-deep mb-6">משלוחים, ביטולים והחזרות 🚚</h1>
      <div className="space-y-5 text-ink/85">
        <h2 className="text-2xl font-bold text-berry-deep">משלוחים</h2>
        <ul className="list-disc pr-6 space-y-1">
          <li>{settings.delivery_areas}</li>
          <li>
            דמי משלוח: {formatPrice(fee)}
            {freeOver > 0 ? ` · משלוח חינם בהזמנה מעל ${formatPrice(freeOver)}` : ""}.
          </li>
          <li>איסוף עצמי מהמשק בנתיב העשרה – ללא עלות, בתיאום מראש.</li>
          <li>מוצרים טריים נשלחים בקירור ומסופקים בהקדם האפשרי לאחר אישור ההזמנה, בתיאום טלפוני.</li>
          <li>מועדי האספקה עשויים להשתנות בהתאם לעונה, לתנאי הדרך ולמצב הביטחוני באזור.</li>
        </ul>

        <h2 className="text-2xl font-bold text-berry-deep">ביטול עסקה והחזרות</h2>
        <p>
          ביטול עסקה ייעשה בהתאם לחוק הגנת הצרכן, התשמ&quot;א–1981, ותקנות הגנת הצרכן (ביטול
          עסקה), התשע&quot;א–2010:
        </p>
        <ul className="list-disc pr-6 space-y-1">
          <li>
            <strong>מוצרים שאינם מתכלים</strong> (מארזי שי, שוברים וכיו&quot;ב): ניתן לבטל את
            העסקה מיום ביצועה ועד 14 יום מיום קבלת המוצר, בהודעה בכתב או בטלפון. החזר כספי יינתן
            בתוך 14 יום ממועד ההודעה, בניכוי דמי ביטול כדין (5% או ₪100, הנמוך מביניהם) ובלבד
            שהמוצר הוחזר שלם וללא פגיעה.
          </li>
          <li>
            <strong>מוצרי מזון טריים ומתכלים</strong> (פירות טריים, ריבות פתוחות וכיו&quot;ב):
            בהתאם לחוק, לא ניתן לבטל עסקה לגבי &quot;טובין פסידים&quot;.
          </li>
          <li>
            <strong>הזמנת קטיף או אירוע</strong>: ביטול עד 48 שעות לפני המועד – ללא חיוב; לאחר
            מכן ייתכן חיוב בהתאם להיערכות שבוצעה. במקרה של ביטול ביוזמתנו (מזג אוויר, מצב
            ביטחוני, יבול) – יוצע מועד חלופי או החזר מלא.
          </li>
          <li>
            מוצר שהתקבל פגום או שגוי – אנא צרו קשר בתוך 24 שעות מקבלתו ונחליף או נזכה אתכם
            במלואו, כולל דמי המשלוח.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-berry-deep">איך מבטלים?</h2>
        <p>
          בטלפון{" "}
          <a className="underline" href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}>{settings.phone}</a>{" "}
          או באימייל{" "}
          <a className="underline" href={`mailto:${settings.email}`}>{settings.email}</a>, בציון
          מספר ההזמנה ופרטי המזמין.
        </p>
      </div>
    </div>
  );
}
