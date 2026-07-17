import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/session";
import ProductForm from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  return (
    <div>
      <Link href="/admin/products" className="text-sm text-berry underline">← חזרה למוצרים</Link>
      <h1 className="text-3xl font-black text-berry-deep mt-2 mb-6">מוצר חדש</h1>
      <ProductForm />
    </div>
  );
}
