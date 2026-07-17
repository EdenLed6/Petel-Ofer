"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb, setSetting } from "@/lib/db";
import { adminPassword, clearAdminCookie, isAdmin, setAdminCookie } from "@/lib/session";
import crypto from "crypto";

async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function login(_prev: { error: string }, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const expected = adminPassword();
  const a = crypto.createHash("sha256").update(password).digest();
  const b = crypto.createHash("sha256").update(expected).digest();
  if (!crypto.timingSafeEqual(a, b)) {
    return { error: "סיסמה שגויה" };
  }
  await setAdminCookie();
  redirect("/admin");
}

export async function logout() {
  await clearAdminCookie();
  redirect("/admin/login");
}

// ---- Products ----
export async function saveProduct(formData: FormData) {
  await requireAdmin();
  const db = getDb();
  const id = Number(formData.get("id")) || 0;
  const data = {
    slug: String(formData.get("slug") ?? "").trim() || `p-${Date.now()}`,
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    price: Number(formData.get("price")) || 0,
    unit: String(formData.get("unit") ?? "").trim() || "יח׳",
    category: String(formData.get("category") ?? "").trim() || "כללי",
    emoji: String(formData.get("emoji") ?? "").trim() || "🫐",
    image_url: String(formData.get("image_url") ?? "").trim(),
    stock: Number(formData.get("stock")) || 0,
    active: formData.get("active") ? 1 : 0,
    featured: formData.get("featured") ? 1 : 0,
    sort: Number(formData.get("sort")) || 100,
  };
  if (!data.name) return;
  if (id) {
    db.prepare(
      `UPDATE products SET slug=@slug, name=@name, description=@description, price=@price, unit=@unit,
       category=@category, emoji=@emoji, image_url=@image_url, stock=@stock, active=@active,
       featured=@featured, sort=@sort WHERE id=@id`
    ).run({ ...data, id });
  } else {
    db.prepare(
      `INSERT INTO products (slug, name, description, price, unit, category, emoji, image_url, stock, active, featured, sort)
       VALUES (@slug, @name, @description, @price, @unit, @category, @emoji, @image_url, @stock, @active, @featured, @sort)`
    ).run(data);
  }
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (id) getDb().prepare("DELETE FROM products WHERE id = ?").run(id);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

// ---- Orders ----
export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");
  if (id && status) getDb().prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, id);
  revalidatePath("/admin/orders");
}

// ---- Events ----
export async function updateEventStatus(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");
  if (id && status)
    getDb().prepare("UPDATE event_requests SET status = ? WHERE id = ?").run(status, id);
  revalidatePath("/admin/events");
}

// ---- Messages ----
export async function toggleMessageRead(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (id) getDb().prepare("UPDATE messages SET read = 1 - read WHERE id = ?").run(id);
  revalidatePath("/admin/messages");
}

export async function deleteMessage(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (id) getDb().prepare("DELETE FROM messages WHERE id = ?").run(id);
  revalidatePath("/admin/messages");
}

// ---- Updates ----
export async function saveUpdate(formData: FormData) {
  await requireAdmin();
  const db = getDb();
  const id = Number(formData.get("id")) || 0;
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const active = formData.get("active") ? 1 : 0;
  const pinned = formData.get("pinned") ? 1 : 0;
  if (!title) return;
  if (id) {
    db.prepare("UPDATE updates SET title=?, body=?, active=?, pinned=? WHERE id=?").run(
      title, body, active, pinned, id
    );
  } else {
    db.prepare("INSERT INTO updates (title, body, active, pinned) VALUES (?, ?, ?, ?)").run(
      title, body, active, pinned
    );
  }
  revalidatePath("/admin/updates");
  revalidatePath("/");
  redirect("/admin/updates");
}

export async function deleteUpdate(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (id) getDb().prepare("DELETE FROM updates WHERE id = ?").run(id);
  revalidatePath("/admin/updates");
  revalidatePath("/");
}

// ---- Settings ----
export async function saveSettings(formData: FormData) {
  await requireAdmin();
  const keys = [
    "site_name", "tagline", "phone", "email", "address", "waze_link", "whatsapp",
    "facebook", "instagram", "hours_text", "picking_season", "kosher_text",
    "delivery_fee", "free_shipping_over", "min_order", "delivery_areas",
    "payment_info", "announcement",
  ];
  for (const key of keys) {
    const value = formData.get(key);
    if (value !== null) setSetting(key, String(value).trim());
  }
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}
