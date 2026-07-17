export function formatPrice(n: number): string {
  const isInt = Number.isInteger(n);
  return `₪${n.toLocaleString("he-IL", {
    minimumFractionDigits: isInt ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso.includes("T") ? iso : iso.replace(" ", "T") + "Z");
  return d.toLocaleDateString("he-IL", { day: "numeric", month: "long", year: "numeric" });
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso.includes("T") ? iso : iso.replace(" ", "T") + "Z");
  return d.toLocaleString("he-IL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const ORDER_STATUSES: Record<string, string> = {
  new: "חדשה",
  confirmed: "אושרה",
  paid: "שולמה",
  shipped: "נשלחה",
  done: "הושלמה",
  cancelled: "בוטלה",
};

export const EVENT_STATUSES: Record<string, string> = {
  new: "חדשה",
  contacted: "נוצר קשר",
  booked: "נסגר אירוע",
  declined: "לא רלוונטי",
};

export const DELIVERY_METHODS: Record<string, string> = {
  pickup: "איסוף עצמי מהמשק",
  delivery: "משלוח עד הבית",
};

export const PAYMENT_METHODS: Record<string, string> = {
  phone: "תשלום בתיאום טלפוני (אשראי/ביט)",
  bit: "ביט / פייבוקס",
  cash: "מזומן באיסוף",
  transfer: "העברה בנקאית",
};
