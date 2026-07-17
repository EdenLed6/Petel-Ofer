import { redirect } from "next/navigation";
import { getSettings } from "@/lib/db";
import { isAdmin } from "@/lib/session";
import { saveSettings } from "../actions";

export const dynamic = "force-dynamic";

const inputCls =
  "w-full border border-sand rounded-xl px-4 py-2.5 bg-white focus:border-berry outline-none";

function Field({
  label,
  name,
  value,
  dir,
  textarea,
}: {
  label: string;
  name: string;
  value: string;
  dir?: "ltr";
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      {textarea ? (
        <textarea name={name} defaultValue={value} rows={2} className={inputCls} />
      ) : (
        <input name={name} defaultValue={value} dir={dir} className={inputCls} />
      )}
    </label>
  );
}

export default async function AdminSettingsPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const s = getSettings();

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-black text-berry-deep mb-6">הגדרות האתר</h1>
      <form action={saveSettings} className="space-y-6">
        <section className="bg-white rounded-2xl border border-sand p-6 space-y-4">
          <h2 className="font-bold text-lg">פרטי המשק</h2>
          <Field label="שם האתר" name="site_name" value={s.site_name} />
          <Field label="משפט תיאור (מוצג בפוטר)" name="tagline" value={s.tagline} textarea />
          <Field label="כתובת" name="address" value={s.address} />
          <Field label="טקסט כשרות" name="kosher_text" value={s.kosher_text} textarea />
          <Field label="שעות פעילות" name="hours_text" value={s.hours_text} textarea />
          <Field label="טקסט עונת קטיף" name="picking_season" value={s.picking_season} textarea />
          <Field label="באנר הכרזה בראש האתר (ריק = מוסתר)" name="announcement" value={s.announcement} />
        </section>

        <section className="bg-white rounded-2xl border border-sand p-6 space-y-4">
          <h2 className="font-bold text-lg">יצירת קשר ורשתות</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="טלפון" name="phone" value={s.phone} dir="ltr" />
            <Field label="וואטסאפ (מספר בינלאומי)" name="whatsapp" value={s.whatsapp} dir="ltr" />
            <Field label="אימייל" name="email" value={s.email} dir="ltr" />
            <Field label="קישור Waze" name="waze_link" value={s.waze_link} dir="ltr" />
            <Field label="פייסבוק" name="facebook" value={s.facebook} dir="ltr" />
            <Field label="אינסטגרם" name="instagram" value={s.instagram} dir="ltr" />
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-sand p-6 space-y-4">
          <h2 className="font-bold text-lg">חנות ומשלוחים</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="דמי משלוח (₪)" name="delivery_fee" value={s.delivery_fee} dir="ltr" />
            <Field label="משלוח חינם מעל (₪, 0 = ללא)" name="free_shipping_over" value={s.free_shipping_over} dir="ltr" />
            <Field label="מינימום הזמנה (₪, 0 = ללא)" name="min_order" value={s.min_order} dir="ltr" />
          </div>
          <Field label="אזורי משלוח (טקסט ללקוח)" name="delivery_areas" value={s.delivery_areas} textarea />
          <Field label="הסבר תשלום בצ׳ק-אאוט" name="payment_info" value={s.payment_info} textarea />
        </section>

        <button type="submit" className="bg-berry hover:bg-berry-dark text-white font-bold px-8 py-3 rounded-xl">
          שמירת הגדרות ✓
        </button>
      </form>
    </div>
  );
}
