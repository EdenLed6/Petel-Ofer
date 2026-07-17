import type { Product } from "@/lib/db";
import { saveProduct } from "../actions";

const inputCls =
  "w-full border border-sand rounded-xl px-4 py-2.5 bg-white focus:border-berry outline-none";

export default function ProductForm({ product }: { product?: Product }) {
  return (
    <form action={saveProduct} className="bg-white rounded-2xl border border-sand p-6 max-w-2xl">
      {product && <input type="hidden" name="id" value={product.id} />}
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium">שם המוצר *</span>
          <input name="name" required defaultValue={product?.name} className={inputCls} />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium">תיאור</span>
          <textarea name="description" rows={3} defaultValue={product?.description} className={inputCls} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">מחיר (₪) *</span>
          <input name="price" type="number" step="0.1" min="0" required defaultValue={product?.price} className={inputCls} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">יחידת מכירה</span>
          <input name="unit" defaultValue={product?.unit ?? "יח׳"} className={inputCls} placeholder="למשל: סלסלה 250 גר׳" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">קטגוריה</span>
          <input name="category" defaultValue={product?.category ?? "כללי"} className={inputCls} list="categories" />
          <datalist id="categories">
            <option value="פירות טריים" />
            <option value="ריבות וממרחים" />
            <option value="משקאות" />
            <option value="קפואים" />
            <option value="מארזים ומתנות" />
            <option value="חטיפים" />
          </datalist>
        </label>
        <label className="block">
          <span className="text-sm font-medium">מלאי</span>
          <input name="stock" type="number" min="0" defaultValue={product?.stock ?? 0} className={inputCls} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">אימוג׳י (לתצוגה)</span>
          <input name="emoji" defaultValue={product?.emoji ?? "🫐"} className={inputCls} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">קישור לתמונה (לא חובה)</span>
          <input name="image_url" dir="ltr" defaultValue={product?.image_url} className={inputCls} placeholder="https://..." />
        </label>
        <label className="block">
          <span className="text-sm font-medium">מזהה לכתובת (slug)</span>
          <input name="slug" dir="ltr" defaultValue={product?.slug} className={inputCls} placeholder="נוצר אוטומטית אם ריק" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">סדר תצוגה</span>
          <input name="sort" type="number" defaultValue={product?.sort ?? 100} className={inputCls} />
        </label>
        <label className="flex items-center gap-2 mt-2">
          <input type="checkbox" name="active" defaultChecked={product ? !!product.active : true} className="w-4 h-4" />
          <span className="text-sm font-medium">מוצר פעיל (מוצג בחנות)</span>
        </label>
        <label className="flex items-center gap-2 mt-2">
          <input type="checkbox" name="featured" defaultChecked={!!product?.featured} className="w-4 h-4" />
          <span className="text-sm font-medium">מומלץ (מוצג בדף הבית)</span>
        </label>
      </div>
      <button
        type="submit"
        className="mt-6 bg-berry hover:bg-berry-dark text-white font-bold px-8 py-3 rounded-xl"
      >
        שמירה ✓
      </button>
    </form>
  );
}
