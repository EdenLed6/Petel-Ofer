"use server";

import { getDb, getSetting, type Product } from "@/lib/db";

export type OrderPayload = {
  customer_name: string;
  phone: string;
  email: string;
  delivery_method: "pickup" | "delivery";
  address: string;
  city: string;
  payment_method: string;
  notes: string;
  items: { id: number; qty: number }[];
};

export async function createOrder(
  payload: OrderPayload
): Promise<{ ok: true; orderId: number } | { ok: false; error: string }> {
  const { customer_name, phone, items } = payload;
  if (!customer_name.trim() || !phone.trim()) {
    return { ok: false, error: "נא למלא שם וטלפון" };
  }
  if (!items.length) {
    return { ok: false, error: "העגלה ריקה" };
  }
  if (payload.delivery_method === "delivery" && (!payload.address.trim() || !payload.city.trim())) {
    return { ok: false, error: "למשלוח יש למלא כתובת ויישוב" };
  }

  const db = getDb();
  const getProduct = db.prepare("SELECT * FROM products WHERE id = ? AND active = 1");

  let subtotal = 0;
  const resolved: { product: Product; qty: number }[] = [];
  for (const item of items) {
    const product = getProduct.get(item.id) as Product | undefined;
    if (!product) return { ok: false, error: "אחד המוצרים בעגלה אינו זמין עוד" };
    const qty = Math.max(1, Math.min(99, Math.floor(item.qty)));
    if (product.stock < qty) {
      return { ok: false, error: `המלאי של "${product.name}" אינו מספיק (נותרו ${product.stock})` };
    }
    subtotal += product.price * qty;
    resolved.push({ product, qty });
  }

  const minOrder = Number(getSetting("min_order")) || 0;
  if (subtotal < minOrder) {
    return { ok: false, error: `סכום הזמנה מינימלי הוא ₪${minOrder}` };
  }

  const deliveryFeeBase = Number(getSetting("delivery_fee")) || 0;
  const freeOver = Number(getSetting("free_shipping_over")) || 0;
  const deliveryFee =
    payload.delivery_method === "delivery" && !(freeOver > 0 && subtotal >= freeOver)
      ? deliveryFeeBase
      : 0;
  const total = subtotal + deliveryFee;

  const insertOrder = db.prepare(`
    INSERT INTO orders (customer_name, phone, email, delivery_method, address, city, payment_method, notes, subtotal, delivery_fee, total)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertItem = db.prepare(
    "INSERT INTO order_items (order_id, product_id, name, price, qty) VALUES (?, ?, ?, ?, ?)"
  );
  const updateStock = db.prepare("UPDATE products SET stock = stock - ? WHERE id = ?");

  const orderId = db.transaction(() => {
    const res = insertOrder.run(
      customer_name.trim(),
      phone.trim(),
      payload.email.trim(),
      payload.delivery_method,
      payload.address.trim(),
      payload.city.trim(),
      payload.payment_method,
      payload.notes.trim(),
      subtotal,
      deliveryFee,
      total
    );
    const id = Number(res.lastInsertRowid);
    for (const { product, qty } of resolved) {
      insertItem.run(id, product.id, product.name, product.price, qty);
      updateStock.run(qty, product.id);
    }
    return id;
  })();

  return { ok: true, orderId };
}

export async function createEventRequest(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  if (!name || !phone) return { ok: false, error: "נא למלא שם וטלפון" };

  getDb()
    .prepare(
      `INSERT INTO event_requests (name, phone, email, org, event_type, event_date, guests, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      name,
      phone,
      String(formData.get("email") ?? "").trim(),
      String(formData.get("org") ?? "").trim(),
      String(formData.get("event_type") ?? "").trim(),
      String(formData.get("event_date") ?? "").trim(),
      Number(formData.get("guests")) || 0,
      String(formData.get("message") ?? "").trim()
    );
  return { ok: true };
}

export async function createContactMessage(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const name = String(formData.get("name") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  if (!name || !message) return { ok: false, error: "נא למלא שם ותוכן הודעה" };
  if (!phone && !email) return { ok: false, error: "נא למלא טלפון או אימייל לחזרה" };

  getDb()
    .prepare("INSERT INTO messages (name, phone, email, subject, message) VALUES (?, ?, ?, ?, ?)")
    .run(name, phone, email, String(formData.get("subject") ?? "").trim(), message);
  return { ok: true };
}
