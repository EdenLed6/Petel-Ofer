import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  db = new Database(path.join(dataDir, "petel.db"));
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  migrate(db);
  seed(db);
  return db;
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      price REAL NOT NULL,
      unit TEXT NOT NULL DEFAULT 'יח׳',
      category TEXT NOT NULL DEFAULT 'כללי',
      emoji TEXT NOT NULL DEFAULT '🫐',
      image_url TEXT NOT NULL DEFAULT '',
      stock INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1,
      featured INTEGER NOT NULL DEFAULT 0,
      sort INTEGER NOT NULL DEFAULT 100,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL DEFAULT '',
      delivery_method TEXT NOT NULL DEFAULT 'pickup',
      address TEXT NOT NULL DEFAULT '',
      city TEXT NOT NULL DEFAULT '',
      payment_method TEXT NOT NULL DEFAULT 'phone',
      notes TEXT NOT NULL DEFAULT '',
      subtotal REAL NOT NULL DEFAULT 0,
      delivery_fee REAL NOT NULL DEFAULT 0,
      total REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'new'
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      qty INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS event_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL DEFAULT '',
      org TEXT NOT NULL DEFAULT '',
      event_type TEXT NOT NULL DEFAULT '',
      event_date TEXT NOT NULL DEFAULT '',
      guests INTEGER NOT NULL DEFAULT 0,
      message TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'new'
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      name TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      subject TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL,
      read INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS updates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      title TEXT NOT NULL,
      body TEXT NOT NULL DEFAULT '',
      active INTEGER NOT NULL DEFAULT 1,
      pinned INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}

export const DEFAULT_SETTINGS: Record<string, string> = {
  site_name: "הפטל של עופר",
  tagline: "משק בוטיק משפחתי לגידול פטל ופירות יער בנתיב העשרה שבעוטף עזה – מאז שנות ה-70",
  phone: "054-300-6053",
  email: "info@petel-ofer.co.il",
  address: "מושב נתיב העשרה, עוטף עזה",
  waze_link: "https://waze.com/ul?q=הפטל של עופר נתיב העשרה",
  whatsapp: "972543006053",
  facebook: "https://www.facebook.com/ofer.raspberry/",
  instagram: "https://www.instagram.com/cafeflora.petel/",
  hours_text: "ימים ב׳–ה׳: 9:00–15:00 | יום ו׳: 8:30–14:30 | שבת, א׳ וחגים: סגור",
  picking_season: "עונות הקטיף משתנות לאורך השנה: פטל, תות, חמניות ופרחים – בכפוף ליבול ולמזג האוויר",
  kosher_text: "המשק כשר – תעודת כשרות רשמית בתוקף מוצגת במרכז המבקרים.",
  delivery_fee: "30",
  free_shipping_over: "250",
  min_order: "0",
  delivery_areas: "משלוחים לאזור הדרום והשפלה. לאזורים אחרים – תיאום טלפוני.",
  payment_info: "ניתן לשלם בביט/פייבוקס, בהעברה בנקאית או באשראי בתיאום טלפוני. נחזור אליכם לאישור ההזמנה והתשלום.",
  announcement: "",
};

function seed(db: Database.Database) {
  const insertSetting = db.prepare(
    "INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)"
  );
  for (const [k, v] of Object.entries(DEFAULT_SETTINGS)) insertSetting.run(k, v);

  const count = db.prepare("SELECT COUNT(*) AS c FROM products").get() as { c: number };
  if (count.c === 0) {
    const ins = db.prepare(`
      INSERT INTO products (slug, name, description, price, unit, category, emoji, stock, active, featured, sort)
      VALUES (@slug, @name, @description, @price, @unit, @category, @emoji, @stock, @active, @featured, @sort)
    `);
    const products = [
      { slug: "petel-fresh", name: "פטל טרי מהחממה", description: "סלסלת פטל אדום טרי, נקטף באותו בוקר בחממות המשק. מתוק, עסיסי ומלא טעם.", price: 35, unit: "סלסלה 250 גר׳", category: "פירות טריים", emoji: "🍇", stock: 40, featured: 1, sort: 1 },
      { slug: "blueberries-fresh", name: "אוכמניות טריות", description: "אוכמניות כחולות וגדולות מהשדה, עשירות בנוגדי חמצון.", price: 32, unit: "סלסלה 125 גר׳", category: "פירות טריים", emoji: "🫐", stock: 35, featured: 1, sort: 2 },
      { slug: "strawberries", name: "תות שדה", description: "תותים אדומים ומתוקים, ישר מהמשק אליכם.", price: 25, unit: "סלסלה 500 גר׳", category: "פירות טריים", emoji: "🍓", stock: 50, featured: 1, sort: 3 },
      { slug: "petel-jam", name: "ריבת פטל ביתית", description: "ריבה מבושלת במשק בסירים קטנים, מפירות הבוטיק שלנו בלבד. ללא חומרים משמרים.", price: 28, unit: "צנצנת 250 גר׳", category: "ריבות וממרחים", emoji: "🍯", stock: 60, featured: 1, sort: 4 },
      { slug: "berry-mix-jam", name: "ריבת פירות יער", description: "שילוב מנצח של פטל, אוכמניות ותות בצנצנת אחת.", price: 30, unit: "צנצנת 250 גר׳", category: "ריבות וממרחים", emoji: "🍯", stock: 45, sort: 5 },
      { slug: "petel-syrup", name: "סירופ פטל טבעי", description: "סירופ מרוכז מפטל אמיתי – מושלם לסודה, לימונדה וקינוחים.", price: 38, unit: "בקבוק 500 מ״ל", category: "משקאות", emoji: "🧃", stock: 30, sort: 6 },
      { slug: "berry-liqueur", name: "ליקר פירות יער", description: "ליקר בוטיק בייצור מקומי מפירות המשק. מתנה מושלמת.", price: 75, unit: "בקבוק 375 מ״ל", category: "משקאות", emoji: "🍷", stock: 20, sort: 7 },
      { slug: "frozen-berries", name: "פירות יער קפואים", description: "תערובת פירות יער מהמשק, הוקפאו בשיא הטריות. מעולה לשייקים.", price: 45, unit: "שקית 1 ק״ג", category: "קפואים", emoji: "🧊", stock: 25, sort: 8 },
      { slug: "berry-honey", name: "דבש פריחת פטל", description: "דבש מכוורות הניצבות לצד שדות הפטל – טעם עדין ומיוחד.", price: 42, unit: "צנצנת 350 גר׳", category: "ריבות וממרחים", emoji: "🐝", stock: 30, sort: 9 },
      { slug: "gift-basket", name: "מארז שי מפנק", description: "מארז מתנה: ריבה, סירופ, דבש ופירות מיובשים באריזת בוטיק. אפשרות להקדשה אישית.", price: 149, unit: "מארז", category: "מארזים ומתנות", emoji: "🎁", stock: 15, featured: 1, sort: 10 },
      { slug: "dried-berries", name: "פירות יער מיובשים", description: "חטיף בריאות טבעי – פירות המשק בייבוש עדין ללא תוספת סוכר.", price: 26, unit: "שקית 100 גר׳", category: "חטיפים", emoji: "🍇", stock: 40, sort: 11 },
      { slug: "picking-voucher", name: "שובר קטיף עצמי זוגי", description: "שובר מתנה לחוויית קטיף עצמי זוגית בחממת הפטל הקסומה, כולל סלסלה וקפה מעגלת הקפה.", price: 120, unit: "שובר לזוג", category: "מארזים ומתנות", emoji: "🎟️", stock: 100, sort: 12 },
    ];
    for (const p of products) {
      ins.run({ featured: 0, active: 1, ...p });
    }
  }

  const uc = db.prepare("SELECT COUNT(*) AS c FROM updates").get() as { c: number };
  if (uc.c === 0) {
    const insU = db.prepare("INSERT INTO updates (title, body, active, pinned) VALUES (?, ?, ?, ?)");
    insU.run("עונת הקטיף נפתחה! 🍓", "חממת הפטל הקסומה פתוחה למבקרים – מוזמנים להזמין מקום לקטיף עצמי חוויתי לכל המשפחה.", 1, 1);
    insU.run("חדש בחנות המשק: מארזי שי", "מארזי שי מפנקים ממוצרי המשק – מושלמים למתנה לחג, לאירוח או לעובדים.", 1, 0);
  }
}

export function getSetting(key: string): string {
  const row = getDb().prepare("SELECT value FROM settings WHERE key = ?").get(key) as { value: string } | undefined;
  return row?.value ?? DEFAULT_SETTINGS[key] ?? "";
}

export function getSettings(): Record<string, string> {
  const rows = getDb().prepare("SELECT key, value FROM settings").all() as { key: string; value: string }[];
  const out: Record<string, string> = { ...DEFAULT_SETTINGS };
  for (const r of rows) out[r.key] = r.value;
  return out;
}

export function setSetting(key: string, value: string) {
  getDb()
    .prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value")
    .run(key, value);
}

export type Product = {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  emoji: string;
  image_url: string;
  stock: number;
  active: number;
  featured: number;
  sort: number;
  created_at: string;
};

export type Order = {
  id: number;
  created_at: string;
  customer_name: string;
  phone: string;
  email: string;
  delivery_method: string;
  address: string;
  city: string;
  payment_method: string;
  notes: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: string;
};

export type OrderItem = {
  id: number;
  order_id: number;
  product_id: number | null;
  name: string;
  price: number;
  qty: number;
};

export type EventRequest = {
  id: number;
  created_at: string;
  name: string;
  phone: string;
  email: string;
  org: string;
  event_type: string;
  event_date: string;
  guests: number;
  message: string;
  status: string;
};

export type ContactMessage = {
  id: number;
  created_at: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  read: number;
};

export type Update = {
  id: number;
  created_at: string;
  title: string;
  body: string;
  active: number;
  pinned: number;
};
